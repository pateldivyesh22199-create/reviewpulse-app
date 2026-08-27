import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata = {
  title: 'ReviewPulse AI',
  description: 'Automate your business reviews with AI',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-950 text-gray-100 flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>

          {/* Dark Styled Footer Legal Links */}
          <footer className="w-full border-t border-gray-800 bg-gray-950 py-6 text-center text-sm text-gray-400">
            <div className="flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
            </div>
          </footer>

          {/* Crisp Support Chat */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.$crisp=[];
                window.CRISP_WEBSITE_ID="61383ea7-deae-4d61-9e58-1a036cfebc68";
                (function(){
                  d=document;
                  s=d.createElement("script");
                  s.src="https://client.crisp.chat/l.js";
                  s.async=1;
                  d.getElementsByTagName("head")[0].appendChild(s);
                })();
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}