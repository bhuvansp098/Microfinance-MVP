import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wheat,ArrowLeft, Calculator, HelpCircle } from "lucide-react";

// Adjusted double dot path to step up correctly from src/pages/ to src/assets/
import farmImage from "../assets/farm-tractor.jpg";

export default function LoanCalc() {
  const navigate = useNavigate();

  // ===================== CALCULATION STATES =====================
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("1");

  // ===================== FORM MATHEMATICAL ENGINE =====================
  const P = Number(principal) || 0;
  const R = Number(rate) || 0;
  const T = Number(years) || 0;

  // Simple Interest Formula: SI = (P * R * T) / 100
  const interest = (P * R * T) / 100;
  const totalAmount = P + interest;

  return (
    <div className="min-h-screen bg-[#f5f6f8] relative overflow-hidden font-sans text-slate-800">
      
      {/* 1. BACKGROUND THEME ENGINE */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${farmImage})` }}
      />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-blue-700/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[380px] h-[380px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* 2. NAVIGATION ROW TOP-BAR CONTAINER */}
      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
      <Wheat className="w-4 h-4 text-white" />
    </div>
    <span className="font-bold text-slate-900 text-lg tracking-tight">
      GraamSeva
    </span>
  </div>
        
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
      </nav>

      {/* 3. CORE CALCULATOR INTERFACE CONTAINER */}
      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        
        {/* Component Title Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-700/20 mb-3">
            <Calculator className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Loan Calculator</h1>
          <p className="text-slate-500 text-sm mt-1">Plan your microfinance borrowing wisely</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_-15px_rgba(29,78,216,0.15)] p-7">
          <h3 className="text-base font-bold text-slate-900 mb-1">Simple Interest Calculator</h3>
          <p className="text-xs text-slate-400 mb-5">Quick interest check calculation tool</p>
          
          {/* Input Fields Stack */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Loan Amount (₹)</label>
              <input 
                type="number" 
                value={principal}
                placeholder="e.g. 10000"
                min="0"
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-700/10 transition text-sm font-medium shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Rate (% p.a.)</label>
                <input 
                  type="number" 
                  value={rate}
                  placeholder="e.g. 12"
                  min="0"
                  step="0.1"
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-700/10 transition text-sm font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Years)</label>
                <input 
                  type="number" 
                  value={years}
                  placeholder="e.g. 1"
                  min="0"
                  step="0.5"
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-700/10 transition text-sm font-medium shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Results Sheet */}
          <div className="mt-6 pt-5 border-t border-slate-200/80">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-slate-500">Interest Component</span>
              <span className="text-sm font-bold text-blue-600">+₹{interest.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between items-end p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mt-3">
              <span className="text-sm font-semibold text-slate-700">Total Repayable</span>
              <span className="text-2xl font-black text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

        {/* Warning Badge */}
        <div className="mt-5 flex items-start gap-2.5 px-4 py-3 bg-blue-50/50 border border-blue-100/40 rounded-2xl text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Note: This engine tracks <strong>Simple Interest</strong> parameters. Real self-help group loans may compute variant reducing monthly matrices depending on your village rules.
          </p>
        </div>

      </div>

    </div>
  );
}