import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Region-based income idea database.
 * Keyed loosely by district / state. Extend freely.
 * Each entry: { crops: [...], businesses: [{name, invest, category, note}] }
 */
const REGION_DATA = {
  // ---------- KARNATAKA ----------
  Mysuru: {
    crops: ["Mulberry (silk)", "Sugarcane", "Ragi", "Tobacco", "Marigold"],
    businesses: [
      { name: "Mysore Silk Reeling Unit", invest: "₹15,000", category: "Textiles", note: "Sericulture is govt-subsidised" },
      { name: "Sandalwood Agarbatti Making", invest: "₹5,000", category: "Cottage", note: "High margin, local demand" },
      { name: "Ragi Flour & Malt Packaging", invest: "₹8,000", category: "Food", note: "Health-food market growing" },
      { name: "Banana Fiber Crafts", invest: "₹3,000", category: "Handicraft", note: "Eco-friendly export demand" },
    ],
  },
  Bengaluru: {
    crops: ["Grapes", "Roses", "Tomato", "Mulberry"],
    businesses: [
      { name: "Terrace Microgreens Farming", invest: "₹4,000", category: "Farming", note: "Sells to cafes/restaurants" },
      { name: "Flower Bouquet Supply", invest: "₹2,500", category: "Retail", note: "Daily demand in city" },
      { name: "Tiffin Service for IT parks", invest: "₹10,000", category: "Food", note: "Subscription model" },
    ],
  },

  // ---------- MAHARASHTRA ----------
  Nashik: {
    crops: ["Grapes", "Onion", "Pomegranate", "Tomato"],
    businesses: [
      { name: "Raisin (Kishmish) Processing", invest: "₹12,000", category: "Food Processing", note: "Use local grapes" },
      { name: "Onion Dehydration Unit", invest: "₹20,000", category: "Food Processing", note: "Export potential" },
      { name: "Pomegranate Juice Bottling", invest: "₹8,000", category: "Beverages", note: "FSSAI licence needed" },
    ],
  },
  Kolhapur: {
    crops: ["Sugarcane", "Soybean", "Turmeric", "Jowar"],
    businesses: [
      { name: "Kolhapuri Chappal Making", invest: "₹6,000", category: "Handicraft", note: "GI-tagged, premium pricing" },
      { name: "Jaggery (Gur) Production", invest: "₹15,000", category: "Food", note: "Local sugarcane supply" },
      { name: "Turmeric Powder Packing", invest: "₹5,000", category: "Spices", note: "Brand it as organic" },
    ],
  },

  // ---------- TAMIL NADU ----------
  Coimbatore: {
    crops: ["Coconut", "Turmeric", "Cotton", "Maize"],
    businesses: [
      { name: "Coconut Coir Doormats", invest: "₹4,000", category: "Handicraft", note: "Steady wholesale demand" },
      { name: "Handloom Cotton Sarees", invest: "₹10,000", category: "Textiles", note: "Heritage craft" },
      { name: "Cold-pressed Coconut Oil", invest: "₹12,000", category: "Food", note: "Premium D2C market" },
    ],
  },
  Madurai: {
    crops: ["Jasmine", "Banana", "Paddy", "Chillies"],
    businesses: [
      { name: "Jasmine Garland Supply", invest: "₹1,500", category: "Retail", note: "Daily temple demand" },
      { name: "Banana Chips Frying Unit", invest: "₹6,000", category: "Snacks", note: "Bulk to tea-stalls" },
      { name: "Chilli Powder & Masala", invest: "₹4,000", category: "Spices", note: "Madurai brand strength" },
    ],
  },

  // ---------- ANDHRA / TELANGANA ----------
  Guntur: {
    crops: ["Chillies", "Cotton", "Tobacco", "Turmeric"],
    businesses: [
      { name: "Guntur Chilli Powder Export", invest: "₹8,000", category: "Spices", note: "World-famous variety" },
      { name: "Avakaya Pickle Manufacturing", invest: "₹5,000", category: "Pickles", note: "Mango season bulk" },
      { name: "Cotton Wick (Vathi) Making", invest: "₹2,000", category: "Cottage", note: "Temple supply chain" },
    ],
  },

  // ---------- PUNJAB ----------
  Ludhiana: {
    crops: ["Wheat", "Rice", "Maize", "Mustard"],
    businesses: [
      { name: "Woolen Hosiery Stitching", invest: "₹10,000", category: "Textiles", note: "Ludhiana is hosiery hub" },
      { name: "Mustard Oil Ghani", invest: "₹15,000", category: "Food", note: "Cold-pressed premium" },
      { name: "Dairy / Paneer Unit", invest: "₹20,000", category: "Dairy", note: "Daily cashflow" },
    ],
  },

  // ---------- UTTAR PRADESH ----------
  Lucknow: {
    crops: ["Mango", "Mentha (mint)", "Wheat", "Sugarcane"],
    businesses: [
      { name: "Chikankari Embroidery", invest: "₹3,000", category: "Textiles", note: "GI-tagged craft" },
      { name: "Mango Pickle & Aam Papad", invest: "₹5,000", category: "Pickles", note: "Seasonal high margin" },
      { name: "Mentha Oil Distillation", invest: "₹25,000", category: "Agro-processing", note: "Pharma demand" },
    ],
  },

  // ---------- KERALA ----------
  Idukki: {
    crops: ["Cardamom", "Pepper", "Coffee", "Tea"],
    businesses: [
      { name: "Cardamom Grading & Packing", invest: "₹8,000", category: "Spices", note: "Export grade pricing" },
      { name: "Black Pepper Powder", invest: "₹4,000", category: "Spices", note: "Direct-to-consumer" },
      { name: "Homestay for Eco-tourists", invest: "₹20,000", category: "Tourism", note: "Munnar circuit" },
    ],
  },

  // ---------- WEST BENGAL ----------
  Murshidabad: {
    crops: ["Jute", "Mulberry", "Rice", "Mango"],
    businesses: [
      { name: "Murshidabad Silk Weaving", invest: "₹12,000", category: "Textiles", note: "Famous handloom" },
      { name: "Jute Bag Production", invest: "₹6,000", category: "Eco-products", note: "Replace plastic bags" },
      { name: "Mango Pulp Processing", invest: "₹10,000", category: "Food Processing", note: "Himsagar variety" },
    ],
  },
};

const DEFAULT_REGION = {
  crops: ["Paddy", "Pulses", "Vegetables", "Seasonal fruits"],
  businesses: [
    { name: "Pickle Making (mango/lemon/chilli)", invest: "₹3,000", category: "Pickles", note: "Low setup, home kitchen" },
    { name: "Spice Powder Packaging", invest: "₹4,000", category: "Spices", note: "Turmeric, chilli, coriander" },
    { name: "Tailoring / Stitching Unit", invest: "₹8,000", category: "Textiles", note: "Steady local demand" },
    { name: "Dairy / Goat Rearing", invest: "₹15,000", category: "Livestock", note: "NABARD loans available" },
    { name: "Mushroom Cultivation", invest: "₹5,000", category: "Farming", note: "30-day harvest cycle" },
    { name: "Vermicompost Production", invest: "₹2,500", category: "Agro", note: "Sell to local farmers" },
    { name: "Agarbatti Rolling", invest: "₹2,000", category: "Cottage", note: "Work-from-home friendly" },
    { name: "Honey Bee Keeping", invest: "₹10,000", category: "Farming", note: "Govt subsidy schemes" },
  ],
};

const ALL_DISTRICTS = Object.keys(REGION_DATA);

const CATEGORY_COLORS = {
  Farming: "bg-green-100 text-green-700",
  Spices: "bg-orange-100 text-orange-700",
  Pickles: "bg-amber-100 text-amber-700",
  Textiles: "bg-pink-100 text-pink-700",
  Handicraft: "bg-purple-100 text-purple-700",
  Food: "bg-red-100 text-red-700",
  "Food Processing": "bg-red-100 text-red-700",
  Dairy: "bg-blue-100 text-blue-700",
  Livestock: "bg-blue-100 text-blue-700",
  Cottage: "bg-yellow-100 text-yellow-700",
  Beverages: "bg-cyan-100 text-cyan-700",
  Snacks: "bg-rose-100 text-rose-700",
  Retail: "bg-indigo-100 text-indigo-700",
  Tourism: "bg-teal-100 text-teal-700",
  "Eco-products": "bg-emerald-100 text-emerald-700",
  Agro: "bg-lime-100 text-lime-700",
  "Agro-processing": "bg-lime-100 text-lime-700",
};

export default function IncomeIdeas() {
  const navigate = useNavigate();

  const [district, setDistrict] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      const u = JSON.parse(saved);
      return u.district || "";
    }
    return "";
  });

  // Persist district choice back to user profile
  useEffect(() => {
    if (!district) return;
    const saved = localStorage.getItem("currentUser");
    const user = saved ? JSON.parse(saved) : {};
    if (user.district !== district) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...user, district })
      );
      window.dispatchEvent(new Event("storage_update"));
    }
  }, [district]);

  const data = REGION_DATA[district] || DEFAULT_REGION;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-white w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-lg"
          aria-label="Back"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Extra Income Sources 🌱
          </h1>
          <p className="text-slate-500 text-sm">
            Small businesses you can start with low investment
          </p>
        </div>
      </div>

      {/* District selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Your District
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">— Select your district —</option>
          {ALL_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {!district && (
          <p className="text-xs text-slate-400 mt-2">
            Showing general ideas. Pick your district for tailored suggestions.
          </p>
        )}
      </div>

      {/* Suggested Crops */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-slate-800">
          🌾 Suggested Crops {district && `for ${district}`}
        </h2>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow-sm">
          <p className="text-emerald-50 text-sm mb-3">
            Best-suited crops for your region's soil & climate
          </p>
          <div className="flex flex-wrap gap-2">
            {data.crops.map((c) => (
              <span
                key={c}
                className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Business Ideas */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-slate-800">
          💡 Business Ideas ({data.businesses.length})
        </h2>
        <div className="space-y-3">
          {data.businesses.map((b, i) => {
            const colorClass =
              CATEGORY_COLORS[b.category] || "bg-slate-100 text-slate-700";
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{b.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{b.note}</p>
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}
                    >
                      {b.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Start with</p>
                    <p className="font-bold text-emerald-600">{b.invest}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer tip */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm text-amber-800">
          💬 Tip: Ask the AI Assistant for a step-by-step starter plan for any
          of these ideas.
        </p>
      </div>
    </div>
  );
}
