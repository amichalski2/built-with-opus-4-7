import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Built with Opus 4.7 · Participant Directory",
  description:
    "A directory of the 497 builders in the Built with Opus 4.7 Claude Code hackathon. Find people by interest, company, location, or GitHub activity and reach them on the socials they listed.",
  openGraph: {
    title: "Built with Opus 4.7 · Participant Directory",
    description:
      "497 builders in the Built with Opus 4.7 Claude Code hackathon — find your collaborators.",
    type: "website",
  },
};

// Runs before hydration to prevent a flash of the wrong theme.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.dataset.theme = t;
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <div className="noise" aria-hidden />
        <Nav />
        {children}
      </body>
    </html>
  );
}
