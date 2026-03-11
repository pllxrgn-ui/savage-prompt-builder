import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
      var colors = {rose:'#FF4D6D',violet:'#A78BFA',blue:'#3B82F6',cyan:'#22D3EE',emerald:'#34D399',amber:'#F59E0B',orange:'#F97316',pink:'#EC4899'};
      document.documentElement.style.setProperty('--accent', colors[a] || '#FF4D6D');
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
      <body className={`${dmSans.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
