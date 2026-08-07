import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import NoiseOverlay from "@/components/NoiseOverlay";
import Preloader from "@/components/Preloader";
import { LoadingProvider } from "@/context/LoadingContext";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Nisarg Chauhan — AI Engineer",
  description:
    "AI Engineer focused on Computer Vision & NLP, bridging Intelligent Systems with Real-World Deployment and Community Engagement.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Nisarg Chauhan — AI Engineer",
    description: "Building the bridge between Imagination & Intelligence. Explore my portfolio of AI, CV, and Web Projects.",
    url: "https://nisarg-portfolio.vercel.app",
    siteName: "Nisarg Chauhan Portfolio",
    images: [
      {
        url: "/hero/bg.png",
        width: 1200,
        height: 630,
        alt: "Nisarg Chauhan Portfolio Overview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nisarg Chauhan — AI Engineer",
    description: "AI Engineer focused on Computer Vision & NLP. Check out my work.",
    images: ["/hero/bg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        <LoadingProvider>
          <Preloader />
          <NoiseOverlay />
          <SmoothScroll>
            <main>
              {children}
            </main>
          </SmoothScroll>
        </LoadingProvider>
      </body>
    </html>
  );
}
