"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAiReply("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName, rating, reviewText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate reply.");
      } else {
        setAiReply(data.aiResponse);
        if (data.creditsUsed !== undefined) {
          setCredits(data.creditsUsed);
        }
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Review Reply</h1>
        {credits !== null && (
          <div className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-sm text-gray-300">
            Credits Used: <span className="text-blue-400 font-bold">{credits}</span> / 200
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div>
            <label className="block text-sm mb-1">Customer Name (Optional)</label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Star Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            >
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="1">1 Star ⭐</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Customer Review *</label>
            <textarea
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste the customer review here..."
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-32"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-2 rounded text-white"
          >
            {loading ? "Generating AI Reply..." : "Generate Reply"}
          </button>
        </form>

        {/* AI Output Box */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-3">AI Response</h2>
            {aiReply ? (
              <p className="bg-gray-800 border border-gray-700 p-4 rounded text-gray-200 whitespace-pre-wrap leading-relaxed">
                {aiReply}
              </p>
            ) : (
              <div className="text-gray-500 text-center py-12">
                Your AI generated response will appear here.
              </div>
            )}
          </div>

          {aiReply && (
            <button
              onClick={copyToClipboard}
              className="mt-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium py-2 rounded"
            >
              {copied ? "Copied to Clipboard! ✓" : "Copy Response"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}