import Link from 'next/link';

export default function TermsPage() {
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
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-base">
          <p>
            By accessing or using ReviewPulse AI, you agree to be bound by these Terms of Service.
          </p>
          
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">1. Use of Service</h2>
            <p>
              You must use ReviewPulse AI in compliance with all applicable local, state, national, and international laws and regulations.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">2. Accounts & Security</h2>
            <p>
              You are responsible for maintaining the security and confidentiality of your account credentials at all times.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">3. Subscriptions & Billing</h2>
            <p>
              Fees for paid services are billed in advance on a recurring monthly or annual basis. You can cancel your subscription at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}