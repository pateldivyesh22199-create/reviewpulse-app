'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('generator');
  const [review, setReview] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [tone, setTone] = useState('Professional');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!review) return alert('Please enter a review!');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review, businessType, tone })
      });
      const data = await res.json();
      setReply(data.reply || data.error || 'Generated response will appear here.');
    } catch (err) {
      setReply('Failed to generate response. Check your API key.');
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', margin: 0 }}>
      {/* Navigation Header */}
      <nav style={{ background: '#1e293b', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#38bdf8' }}>ReviewPulse AI</h2>
        <div>
          <button onClick={() => setActiveTab('generator')} style={tabStyle(activeTab === 'generator')}>Generator</button>
          <button onClick={() => setActiveTab('dashboard')} style={tabStyle(activeTab === 'dashboard')}>Dashboard</button>
          <button onClick={() => setActiveTab('pricing')} style={tabStyle(activeTab === 'pricing')}>Pricing</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

        {/* TAB 1: AI GENERATOR */}
        {activeTab === 'generator' && (
          <div style={cardStyle}>
            <h2 style={{ color: '#0f172a' }}>AI Review Reply Generator</h2>
            <p style={{ color: '#64748b' }}>Generate professional AI responses for your customer reviews instantly.</p>
            
            <label style={labelStyle}>Business Type</label>
            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} style={inputStyle}>
              <option>Restaurant</option>
              <option>E-commerce Store</option>
              <option>Hotel / Hospitality</option>
              <option>Software / SaaS</option>
              <option>Services / Clinic</option>
            </select>

            <label style={labelStyle}>Reply Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={inputStyle}>
              <option>Professional</option>
              <option>Friendly & Warm</option>
              <option>Apologetic & Helpful</option>
              <option>Short & Direct</option>
            </select>

            <label style={labelStyle}>Customer Review</label>
            <textarea 
              rows="4" 
              placeholder="Paste customer review here..." 
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              style={inputStyle} 
            />

            <button onClick={handleGenerate} disabled={loading} style={btnStyle}>
              {loading ? 'Generating AI Reply...' : 'Generate AI Response'}
            </button>

            {reply && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '5px solid #0284c7' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#0369a1' }}>Generated AI Response:</h4>
                <p style={{ margin: 0, color: '#0c4a6e' }}>{reply}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
              <div style={cardStyle}><h3>Total Reviews</h3><p style={statStyle}>1,248</p></div>
              <div style={cardStyle}><h3>Replies Generated</h3><p style={statStyle}>1,120</p></div>
              <div style={cardStyle}><h3>Avg Rating</h3><p style={statStyle}>4.8 / 5.0</p></div>
            </div>
            <div style={cardStyle}>
              <h3>Recent Automated Replies</h3>
              <ul>
                <li><strong>John D. (5 Stars):</strong> "Great service!" → <em>Reply sent via AI</em></li>
                <li><strong>Sarah M. (2 Stars):</strong> "Late delivery." → <em>Apology draft ready</em></li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={cardStyle}>
              <h3>Starter</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$19 / mo</p>
              <p>100 AI Replies / Month</p>
            </div>
            <div style={{ ...cardStyle, border: '2px solid #0284c7' }}>
              <h3>Pro (Popular)</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$49 / mo</p>
              <p>Unlimited AI Replies</p>
            </div>
            <div style={cardStyle}>
              <h3>Agency</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$99 / mo</p>
              <p>Multi-business support</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const tabStyle = (active) => ({
  padding: '8px 16px',
  marginLeft: '10px',
  background: active ? '#0284c7' : 'transparent',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

const cardStyle = { background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const labelStyle = { display: 'block', margin: '15px 0 5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { marginTop: '20px', width: '100%', background: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' };
const statStyle = { fontSize: '28px', fontWeight: 'bold', color: '#0284c7', margin: 0 };