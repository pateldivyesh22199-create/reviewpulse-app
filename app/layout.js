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