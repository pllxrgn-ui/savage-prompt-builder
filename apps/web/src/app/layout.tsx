import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
      <body className={`${dmSans.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
