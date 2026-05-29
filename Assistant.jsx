import React, { useState } from 'react';

export default function Assistant() {
  // Calculator State
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(1);
  
  // Basic Simple Interest Math
  const interest = (principal * rate * years) / 100;
  const totalAmount = Number(principal) + Number(interest);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-28">

      {/* ================= ADVANCED BACKGROUND ================= */}
      {/* 1. Organic Curves & Straight Lines (SVG + CSS Grid) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
        }}
      >
        {/* Straight Engineering Grid */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(to right, #cbd5e1 0.5px, transparent 0.5px), linear-gradient(to bottom, #cbd5e1 0.5px, transparent 0.5px)`, 
          backgroundSize: '100px 100px'
        }}></div>
        
        {/* Curvy Data Flow Lines (SVG) */}
        <svg className="absolute w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 200C150 250 350 -50 700 150C1050 350 1250 50 1500 200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-50 400C200 300 400 600 800 400C1200 200 1300 500 1550 450" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M0 600C300 700 500 400 900 650C1300 900 1400 700 1600 800" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      </div>

      {/* 2. Soft Ambient Glows (Deep Blue & Teal) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/30 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
      {/* ======================================================= */}

      {/* 3-COLUMN LAYOUT WRAPPER */}
      <div className="relative z-10 p-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT SIDEBAR (Quick Links) ================= */}
        <div className="hidden lg:block col-span-3 space-y-6 mt-16">
          <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center gap-3 shadow-sm">
                <span>🌾</span> Mandi Market Rates
              </button>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center gap-3 shadow-sm">
                <span>🌦️</span> Weather & Crop Info
              </button>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center gap-3 shadow-sm">
                <span>🏛️</span> Govt. Schemes (PM-KISAN)
              </button>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN (AI Chat) ================= */}
        <div className="col-span-1 lg:col-span-6">
          
          <div className="mb-8 pb-6 border-b border-slate-200/60 flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-900 rounded-full opacity-5"></div>
              <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center p-1 relative z-10 shadow-md">
                 <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                GraamSeva Assistant
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Ask in English, Hindi, Kannada, or Tamil.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* User Message (Deep Blue) */}
            <div className="flex justify-end">
              <div className="bg-blue-700 text-white font-medium px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md border border-blue-600">
                Tractor loan ka interest kitna hoga?
              </div>
            </div>
            
            {/* AI Bot Message */}
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[90%]">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                  GraamSeva AI
                </span>
                <p className="leading-relaxed">
                  Tractor loan par aam taur par 7% se 9% ka interest lagta hai, jo aapke bank aur sarkari subsidy par nirbhar karta hai. Aap right side mein diye gaye calculator ka use karke apna total payment check kar sakte hain!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR (Loan Calculator) ================= */}
        <div className="hidden lg:block col-span-3 mt-16">
          <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-6 rounded-3xl shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Loan Calculator</h3>
            <p className="text-xs text-slate-500 mb-5">Quick simple interest check</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Loan Amount (₹)</label>
                <input 
                  type="number" 
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rate (%)</label>
                  <input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Years</label>
                  <input 
                    type="number" 
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-500">Interest</span>
                <span className="text-sm font-bold text-blue-600">+₹{interest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-slate-700">Total to Pay</span>
                <span className="text-2xl font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= FIXED INPUT AREA ================= */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-200/50 p-2 flex gap-3 items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300">
            <input
              type="text"
              placeholder="Ask your question..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-900 placeholder-slate-400 font-medium"
            />
            {/* Dark button with Teal accent text */}
            <button className="bg-slate-900 hover:bg-slate-800 text-teal-400 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-95">
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}