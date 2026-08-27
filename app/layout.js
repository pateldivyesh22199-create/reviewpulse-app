import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'ReviewPulse AI',
  description: 'Automate your business reviews with AI',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}

          {/* Footer Legal Links */}
          <footer className="w-full border-t border-gray-200 py-6 text-center text-sm text-gray-500">
            <div className="flex justify-center gap-6">
              <a href="/privacy" className="hover:underline hover:text-gray-800">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:underline hover:text-gray-800">Terms of Service</a>
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