import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Savage Prompt Builder",
  description: "Build precise, beautiful AI image prompts",
};

const accentScript = `
  (function() {
    try {
      var s = JSON.parse(localStorage.getItem('spb-settings') || '{}');
      var st = (s.state || {});
      var a = st.accent;
      var t = st.theme;
      var colors = {orange:'#FF6B00',rose:'#FF4D6D',violet:'#A78BFA',blue:'#3B82F6',cyan:'#22D3EE',emerald:'#34D399',amber:'#F59E0B',pink:'#EC4899'};
      document.documentElement.style.setProperty('--accent', colors[a] || '#FF6B00');
      if (t) document.documentElement.setAttribute('data-theme', t);
    } catch(e) {}
  })();
`;

import { AuthProvider } from "@/components/auth/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
      </head>
      <body className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`}>
        {/* CRT background effects — global */}
        <div className="crt-glow" aria-hidden="true" />
        <div className="noise-grain" aria-hidden="true" />
        <div className="crt-scanlines" aria-hidden="true" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
