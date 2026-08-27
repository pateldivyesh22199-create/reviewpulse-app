import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-6 py-16 w-full">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-white border-b border-gray-800 pb-4">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-base">
          <p>
            Welcome to ReviewPulse AI. We respect your privacy and are committed to protecting your personal data.
          </p>
          
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, such as your name and email address via Clerk authentication.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">2. How We Use Information</h2>
            <p>
              We use your data to operate, maintain, and provide the features of ReviewPulse AI, including generating AI-based review responses.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">3. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}