"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    aiTone: "Professional & Formal",
    customInstructions: "",
  });

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      try {
        const res = await fetch("/api/business");
        const data = await res.json();
        if (data.business) {
          setFormData({
            name: data.business.name || "",
            category: data.business.category || "",
            description: data.business.description || "",
            phone: data.business.phone || "",
            aiTone: data.business.ai_tone || "Professional & Formal",
            customInstructions: data.business.custom_instructions || "",
          });
        }
      } catch (err) {
        console.error("Failed to load business details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Business setup saved successfully!");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (err) {
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading setup...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Business Setup & AI Settings</h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-600/30 border border-blue-500 rounded text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-800">
        <div>
          <label className="block text-sm mb-1">Business Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            placeholder="e.g. Rajwadi Restaurant"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category / Industry</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            placeholder="e.g. Restaurant, Auto Repair, Dental Clinic"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Business Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-24"
            placeholder="Describe your business services, specialties, and timing..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Support Phone (for negative reviews)</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            placeholder="+91-XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">AI Response Tone</label>
          <select
            value={formData.aiTone}
            onChange={(e) => setFormData({ ...formData, aiTone: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
          >
            <option value="Professional & Formal">Professional & Formal</option>
            <option value="Friendly & Warm">Friendly & Warm</option>
            <option value="Polite & Apologetic">Polite & Apologetic</option>
            <option value="Casual & Enthusiastic">Casual & Enthusiastic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Custom Instructions for AI</label>
          <textarea
            value={formData.customInstructions}
            onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-20"
            placeholder="e.g. Always offer a 10% discount on 1-star reviews or mention our manager's email."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 font-semibold px-6 py-2 rounded text-white"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}