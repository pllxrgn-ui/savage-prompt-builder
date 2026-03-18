import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { buildPrompt, templateBuilders } from "@spb/prompt-engine";

console.log("Starting Savage Prompt Builder HTTP / SSE MCP Server...");

const app = express();

// Required so Claude Desktop or external clients can access the endpoints
app.use(cors());

// You MUST NOT use app.use(express.json()) globally if handlePostMessage expects raw requests!
// Actually SSEServerTransport expects the raw express req/res objects with the body unparsed or parsed?
// In the official SDK, it expects `req` to possibly have `req.body` parsed as JSON, but we can just let it handle it.
// Safe to add express.json() but ONLY for the /messages route if necessary. Wait, standard is to use it.
app.use(express.json());

const server = new McpServer({
  name: "savage-prompt-builder-live",
  version: "1.0.0"
});

// Tool: list_templates
server.tool(
  "list_templates",
  "Lists all available prompt builder template IDs.",
  {},
  async () => {
    const templates = Object.keys(templateBuilders);
    return {
      content: [{ type: "text", text: JSON.stringify(templates, null, 2) }]
    };
  }
);

// Tool: build_prompt
server.tool(
  "build_prompt",
  "Constructs a final, highly-optimized AI image generator prompt using the Savage Prompt Builder engine.",
  {
    templateId: z.string().describe("The ID of the template to use (e.g. freestyle, clothing, logo)"),
    fields: z.record(z.string(), z.string()).describe("The key-value pairs of fields required by the template"),
    styles: z.array(z.string()).optional().describe("Array of aesthetic style modifiers"),
    palette: z.string().optional().describe("Pre-defined color palette name"),
    keywords: z.array(z.string()).optional().describe("Extra detailed keywords to include"),
    negative: z.string().optional().describe("Negative prompt (what to avoid)"),
    generator: z.enum(["midjourney", "dalle", "stable-diffusion", "nanobanana"]).default("nanobanana").describe("Target AI generator model"),
    phrases: z.array(z.string()).optional().describe("Custom user phrases")
  },
  async (args) => {
    try {
      const result = buildPrompt({
         templateId: args.templateId,
         fields: args.fields as Record<string, string>,
         styles: args.styles ?? [],
         palette: args.palette ?? null,
         keywords: args.keywords ?? [],
         negative: args.negative ?? "",
         generator: args.generator,
         phrases: args.phrases ?? []
       });

       return {
         content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
       };
    } catch (e: any) {
       return {
          content: [{ type: "text", text: `Error building prompt: ${e.message}` }],
          isError: true
       };
    }
  }
);

// Map to hold persistent connections for Web/Live users (Server-Sent Events)
const transports = new Map<string, SSEServerTransport>();

// The `/sse` endpoint establishes the connection
app.get("/sse", async (req, res) => {
  console.log("New MCP SSE connection attempting to link...");
  
  // Note: SSEServerTransport expects an absolute URL to the messages endpoint, or a relative one.
  // When deploying live, it's safer to read the host from headers if possible, or just use /messages.
  // SSEServerTransport auto-generates a sessionId.
  const transport = new SSEServerTransport("/messages", res);
  
  await server.connect(transport);
  transports.set(transport.sessionId, transport);
  
  console.log(`Assigned Session ID: ${transport.sessionId}`);

  // Cleanup map when connection is closed
  res.on("close", () => {
    console.log(`SSE connection closed: ${transport.sessionId}`);
    transports.delete(transport.sessionId);
  });
});

// The `/messages` endpoint routes JSON-RPC messages to the correct SSE transport
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).send("Session not found or connection lost.");
    return;
  }

  // The SDK correctly routes the request through the transport
  await transport.handlePostMessage(req, res);
});

// Start the Live Web Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Savage Prompt Builder LIVE Web MCP Server running`);
  console.log(`📡 SSE URL:       http://localhost:${PORT}/sse`);
  console.log(`✉️  Messages URL: http://localhost:${PORT}/messages?sessionId=...`);
  console.log(`\nTo make this public, deploy the "packages/mcp-server" folder to a host like Railway or Render!`);
});
