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
server.tool("list_templates", "Lists all available prompt builder template IDs.", {}, async () => {
    const templates = Object.keys(templateBuilders);
    return {
        content: [{ type: "text", text: JSON.stringify(templates, null, 2) }]
    };
});
// Tool: build_prompt
server.tool("build_prompt", "Constructs a final, highly-optimized AI image generator prompt using the Savage Prompt Builder engine.", {
    templateId: z.string().describe("The ID of the template to use (e.g. freestyle, clothing, logo)"),
    fields: z.record(z.string(), z.string()).describe("The key-value pairs of fields required by the template"),
    styles: z.array(z.string()).optional().describe("Array of aesthetic style modifiers"),
    palette: z.string().optional().describe("Pre-defined color palette name"),
    keywords: z.array(z.string()).optional().describe("Extra detailed keywords to include"),
    negative: z.string().optional().describe("Negative prompt (what to avoid)"),
    generator: z.enum(["midjourney", "dalle", "stable-diffusion", "nanobanana"]).default("nanobanana").describe("Target AI generator model"),
    phrases: z.array(z.string()).optional().describe("Custom user phrases")
}, async (args) => {
    try {
        const result = buildPrompt({
            templateId: args.templateId,
            fields: args.fields,
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
    }
    catch (e) {
        return {
            content: [{ type: "text", text: `Error building prompt: ${e.message}` }],
            isError: true
        };
    }
});
// Tool 3: get_template_info
server.tool("get_template_info", "Returns likely fields needed for a specific template.", { templateId: z.string() }, async ({ templateId }) => {
    // Basic heuristic since actual fields are dynamic in typescript functions
    let fields = ["subject", "style", "mood", "colors", "avoid"];
    if (templateId === "clothing")
        fields.push("background");
    if (templateId === "marketing")
        fields = ["product", "headline", "style", "mood", "colors"];
    if (templateId === "brand")
        fields = ["brandname", "subject", "composition"];
    if (templateId === "jewelry")
        fields = ["piece", "material", "gemstones"];
    return { content: [{ type: "text", text: `Fields typically expected for ${templateId}: ${fields.join(", ")}` }] };
});
// Tool 4: list_generators
server.tool("list_generators", "Lists all supported prompt AI generators and their nuances.", {}, async () => {
    return {
        content: [{ type: "text", text: JSON.stringify(["midjourney", "dalle3", "stable-diffusion", "flux", "leonardo", "firefly", "ideogram", "nanobanana", "replicate"]) }]
    };
});
// Tool 5: format_raw_prompt
server.tool("format_raw_prompt", "Formats an explicitly raw positive and negative text for a specific AI generator's optimal syntax.", { generatorId: z.string(), positive: z.string(), negative: z.string().optional(), parameters: z.string().optional() }, async ({ generatorId, positive, negative, parameters }) => {
    // A dynamic requirement of the prompt tools
    // We dynamically import `formatForGenerator` logic.
    const { formatForGenerator } = await import("@spb/prompt-engine");
    const result = formatForGenerator(generatorId, { positive, negative: negative ?? "", parameters });
    return { content: [{ type: "text", text: result }] };
});
// Tool 6: reverse_engineer_prompt
server.tool("reverse_engineer_prompt", "Predicts the internal fields of a provided raw image prompt so it can be re-built using the builder engine.", { rawPrompt: z.string() }, async ({ rawPrompt }) => {
    return { content: [{ type: "text", text: `(AI Simulation) Recognized Subject: Automatically parsed from "${rawPrompt}". Suggest saving into freestyle or marketing template.` }] };
});
// Tool 7: get_style_modifiers
server.tool("get_style_modifiers", "Returns a list of popular aesthetic styles available.", {}, async () => {
    return { content: [{ type: "text", text: JSON.stringify(["Cinematic", "Cyberpunk", "Minimalist", "Photorealistic", "Surreal", "Vaporwave", "Anime", "Baroque", "Neon", "Vintage"]) }] };
});
// Tool 8: get_color_palettes
server.tool("get_color_palettes", "Returns common color palettes for image generation.", {}, async () => {
    return { content: [{ type: "text", text: JSON.stringify(["Teal and Orange", "Pastel Dream", "Monochrome Dark", "Neon Cyberpunk", "Muted Earth Tones", "Vibrant Pop Art", "High Contrast Black & White"]) }] };
});
// Map to hold persistent connections for Web/Live users (Server-Sent Events)
const transports = new Map();
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
    const sessionId = req.query.sessionId;
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
//# sourceMappingURL=index.js.map