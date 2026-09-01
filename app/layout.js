import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// ૧. વર્લ્ડ-ક્લાસ SEO અને સોશિયલ મીડિયા પ્રીવ્યુ સેટિંગ્સ
export const metadata = {
  title: "ReviewPulse AI | World's First Context-Aware Reputation Agent",
  description: "Automate your Google reviews, intercept negative feedback with Crisis Shield™, and boost your local SEO rankings using AI.",
  openGraph: {
    title: "ReviewPulse AI | AI Reputation Management",
    description: "Stop 1-star reviews and automate your brand growth in Canada & USA.",
    url: "https://reviewpulse-ai-app.vercel.app",
    siteName: "ReviewPulse AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          {/* ૨. ગૂગલ એનાલિટિક્સ (Google Analytics - G-61P1L22Y1N) */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-61P1L22Y1N`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.location || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-61P1L22Y1N', {
                page_path: window.location.pathname,
              });
            `}
          </Script>

          {/* ૩. લાઈવ સપોર્ટ ચેટ (Crisp Chat - 61383ea7-deae-4d61-9e58-1a036cfebc68) */}
          <Script id="crisp-chat" strategy="afterInteractive">
            {`
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="61383ea7-deae-4d61-9e58-1a036cfebc68";
              (function(){
                d=document;s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `}
          </Script>
        </head>
        <body className={`${inter.className} bg-[#030712] antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}