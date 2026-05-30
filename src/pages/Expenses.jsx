import React, { useState, useEffect } from 'react';

export default function Expenses() {
  // ===================== USER PROFILE LOOKUP ENGINE =====================
  // Dynamic extraction layer to load the active user profile scoped keys
  const [userProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored
      ? JSON.parse(stored)
      : { name: "Guest", phone: "", savings: 0, district: "" };
  });

  // Scopes database keys to the logged-in user's phone number
  const userKey = userProfile.phone || "guest";
  const expensesKey = `expenses_${userKey}`;
  const seenKey = `seenUser_${userKey}`;

  // Dynamically reading real initial savings typed by user in the login setup screen
  const mockUserBaseBalance = Number(userProfile.savings) || 0;
  const mockTxnLength = 0;

  // ===================== STATE ENGINE =====================
  const [expenses, setExpenses] = useState(() => {
    const isReturning = localStorage.getItem(seenKey) === "true";
    if (!isReturning) return []; // New user starts with clean slate
    const savedExpenses = localStorage.getItem(expensesKey);
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [inputName, setInputName] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputCategory, setInputCategory] = useState('Food');
   
  const [showClearModal, setShowClearModal] = useState(false);
   
  // === Full Screen Graph State ===
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(5); // Default to current month (Jun)

  const barMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseHistoricalData = [2100, 3400, 2800, 1900, 3240, 0];

  // ===================== PERSISTENCE LAYER =====================
  useEffect(() => {
    // Saves to the specific user-scoped key structure matching Dashboard.jsx
    localStorage.setItem(expensesKey, JSON.stringify(expenses));
    
    // Aligns returning flag states safely
    if (userProfile.phone) {
      localStorage.setItem(seenKey, "true");
    }
    
    // TRIGGERS INTER-COMPONENT TELEMETRY BROADCAST OVER THE BROWSER STORAGE CHANNELS
    window.dispatchEvent(new Event('storage_update'));
  }, [expenses, expensesKey, seenKey, userProfile.phone]);

  // ===================== MATH ENGINE =====================
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingSaved = mockUserBaseBalance - totalSpent;
  const combinedTxnsCount = expenses.length + mockTxnLength;

  // Combine historical data with the live current month data
  const dynamicBarData = [...baseHistoricalData];
  dynamicBarData[5] = totalSpent;
   
  const maxBarValue = Math.max(...dynamicBarData.slice(0, -1), 1); // For the mini bar chart
   
  // === Advanced Math for the Full Screen Graph ===
  const totalYearlySpent = dynamicBarData.reduce((a, b) => a + b, 0);
  const highestAmount = Math.max(...dynamicBarData);
  const highestMonthIdx = dynamicBarData.indexOf(highestAmount);
   
  // Custom SVG Smooth Curve Generator
  const generateSmoothCurve = (data, width, height) => {
    if (data.length === 0) return "";
    const max = Math.max(...data, 1);
    const padding = 60; // Padding inside the SVG
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
     
    // Start point
    let path = `M ${padding} ${height - padding - (data[0] / max) * usableHeight}`;
     
    // Draw bezier curves between points
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = (i / (data.length - 1)) * usableWidth + padding;
      const y1 = height - padding - (data[i] / max) * usableHeight;
      const x2 = ((i + 1) / (data.length - 1)) * usableWidth + padding;
      const y2 = height - padding - (data[i + 1] / max) * usableHeight;
       
      // Control points for smooth curve
      const cx1 = x1 + (x2 - x1) / 2;
      const cx2 = x1 + (x2 - x1) / 2;
       
      path += ` C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
    }
    return path;
  };

  // ===================== HANDLERS =====================
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputAmount || parseInt(inputAmount) <= 0) {
      alert('⚠️ Please enter a real name and amount.');
      return;
    }
    const newExpense = {
      name: inputName.trim(),
      amount: parseInt(inputAmount),
      category: inputCategory,
      title: inputName.trim() // Mapping title token parameter directly to patch Recent Activity log items on Home Dashboard array pipelines
    };
    setExpenses([newExpense, ...expenses]);
    setInputName('');
    setInputAmount('');
  };

  const confirmClearExpenses = () => {
    setExpenses([]);
    setShowClearModal(false);
  };

  const addQuickAmount = (val) => {
    setInputAmount(prev => (prev ? (parseFloat(prev) + val).toString() : val.toString()));
  };

  // ===================== UI LAYER =====================
  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20 font-sans text-slate-800">
       
      {/* ================= BACKGROUND ================= */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #cbd5e1 0.5px, transparent 0.5px), linear-gradient(to bottom, #cbd5e1 0.5px, transparent 0.5px)`,
          backgroundSize: '100px 100px'
        }}></div>
        <svg className="absolute w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 200C150 250 350 -50 700 150C1050 350 1250 50 1500 200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-50 400C200 300 400 600 800 400C1200 200 1300 500 1550 450" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M0 600C300 700 500 400 900 650C1300 900 1400 700 1600 800" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 p-4 lg:p-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6">
         
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="hidden lg:block col-span-3 space-y-6 mt-4">
          <div className="bg-blue-700 rounded-3xl p-6 shadow-lg border border-blue-600 text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-50"></div>
            <p className="text-blue-100 text-sm font-medium mb-1">Money Saved Left</p>
            <h2 className="text-4xl font-bold tracking-tight">₹{remainingSaved.toLocaleString('en-IN')}</h2>
            <p className="text-blue-200 text-xs mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
              Out of ₹{mockUserBaseBalance.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-5 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-teal-400 rounded-full"></span>
              Quick Add
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => {setInputCategory('Food'); setInputName('Groceries');}} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 text-center shadow-sm active:scale-95 transition-all">🍚 Food</button>
              <button onClick={() => {setInputCategory('Travel'); setInputName('Bus/Auto');}} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 text-center shadow-sm active:scale-95 transition-all">🚗 Travel</button>
              <button onClick={() => {setInputCategory('Healthcare'); setInputName('Medicines');}} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 text-center shadow-sm active:scale-95 transition-all">💊 Health</button>
              <button onClick={() => {setInputCategory('Education'); setInputName('School Fees');}} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 text-center shadow-sm active:scale-95 transition-all">📚 School</button>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN ================= */}
        <div className="col-span-1 lg:col-span-6 space-y-6">
          <div className="mb-2 pb-6 border-b border-slate-200/60 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                Track Expenses📊
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Write down what you spent money on today.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="bg-red-50 border border-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-red-100 transition-colors"
            >
              🗑️ Start Fresh
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl font-bold">₹</div>
               <div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Spent</p>
                 <h3 className="text-xl font-bold text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</h3>
               </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">📋</div>
               <div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Bills</p>
                 <h3 className="text-xl font-bold text-slate-900">{combinedTxnsCount} items</h3>
               </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">1. What did you buy?</label>
                <input type="text" placeholder="e.g. Groceries or Bus Ticket" value={inputName} onChange={(e) => setInputName(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold shadow-inner" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">2. How much? (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input type="number" placeholder="0" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold shadow-inner text-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">3. What kind of bill?</label>
                  <select value={inputCategory} onChange={(e) => setInputCategory(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold shadow-inner cursor-pointer">
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => addQuickAmount(50)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-1.5 text-xs font-bold transition-colors">+ ₹50</button>
                <button type="button" onClick={() => addQuickAmount(100)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-1.5 text-xs font-bold transition-colors">+ ₹100</button>
                <button type="button" onClick={() => addQuickAmount(500)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-1.5 text-xs font-bold transition-colors">+ ₹500</button>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl px-4 py-4 mt-2 transition-all duration-200 shadow-md shadow-blue-600/20 active:scale-[0.98]">Save This Expense</button>
            </form>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 mt-6">My Old Bills</h3>
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-2 p-2">
              {expenses.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm font-medium">No expenses saved yet.</div>
              ) : (
                expenses.map((exp, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{exp.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium uppercase">{exp.category}</p>
                      </div>
                    </div>
                    <p className="font-bold tracking-tight text-slate-900">-₹{exp.amount.toLocaleString('en-IN')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden lg:block col-span-3 space-y-6 mt-4">
           
          {/* === Clickable Mini Graph === */}
          <button
            onClick={() => setShowGraphModal(true)}
            className="w-full text-left bg-white/70 backdrop-blur-md border border-slate-200 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-teal-400 rounded-full"></span>
                My Monthly Spending
              </h3>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
            </div>
             
            <div className="h-40 bg-white border border-slate-100 rounded-2xl p-4 flex items-end gap-2 justify-between shadow-inner">
              {barMonths.map((month, index) => {
                const heightPct = Math.max(8, Math.round((dynamicBarData[index] / maxBarValue) * 100));
                const isJune = index === 5;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className={`w-full rounded-t-md transition-all duration-700 min-h-[4px] ${isJune ? 'bg-blue-600 shadow-sm shadow-blue-600/30' : 'bg-slate-200 group-hover:bg-blue-100'}`} style={{ height: `${heightPct}%` }} />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{month}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center text-slate-400 mt-4 font-medium">Click to see details</p>
          </button>
           
          <div className="bg-slate-900 rounded-3xl p-5 shadow-sm text-white">
             <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-teal-400 rounded-full"></span>
              Saving Tips
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Writing down your daily expenses helps you save up to <strong>15% more money</strong> at the end of the month!</p>
            <button onClick={() => {setInputCategory('Savings'); setInputName('Piggy Bank Deposit');}} className="w-full text-center text-xs font-bold text-teal-400 hover:text-teal-300 border border-slate-700 hover:border-teal-400/50 py-2 rounded-xl transition-colors">+ Log a Saving Today</button>
          </div>
        </div>

      </div>

      {/* ================= CUSTOM MODAL OVERLAY (Clear History) ================= */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-[24px] p-6 lg:p-8 max-w-sm w-full shadow-2xl border border-slate-100">
            <p className="text-slate-700 font-medium mb-8 pt-2">Are you sure you want to delete all your old bills?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClearModal(false)} className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-[#e0e7ff] text-[#3730a3] hover:bg-[#c7d2fe] transition-colors">Cancel</button>
              <button onClick={confirmClearExpenses} className="px-8 py-2.5 rounded-2xl text-sm font-bold bg-[#43508a] text-white hover:bg-[#323d6a] ring-[3px] ring-offset-2 ring-[#43508a] transition-all shadow-md active:scale-95">OK</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM MODAL OVERLAY (Full Screen Graph Analysis) ================= */}
      {showGraphModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
           
          <div className="bg-[#f8fafc] rounded-3xl w-full h-full max-w-5xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
             
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center z-10 relative shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Spending Details</h2>
                <p className="text-sm text-slate-500">Tap on any dot to see how much you spent that month.</p>
              </div>
              <button
                onClick={() => setShowGraphModal(false)}
                className="w-10 h-10 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full flex items-center justify-center transition-colors font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Highest Spending Alert */}
            <div className="bg-red-50 border-b border-red-100 p-4 flex justify-center items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-700 text-sm font-medium">
                Your highest spending was in <strong>{barMonths[highestMonthIdx]}</strong> (₹{highestAmount.toLocaleString('en-IN')}).
              </p>
            </div>

            {/* Main Graph Area */}
            <div className="flex-1 bg-white p-6 lg:p-10 relative overflow-hidden flex flex-col">
               
              {/* Interactive SVG Curve */}
              <div className="flex-1 relative w-full border-b-2 border-l-2 border-slate-100 mt-10">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="0" y1="300" x2="1000" y2="300" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="5 5" />
                   
                  {/* The Curved Line */}
                  <path
                    d={generateSmoothCurve(dynamicBarData, 1000, 400)}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                  />
                   
                  {/* Interactive Points */}
                  {dynamicBarData.map((val, idx) => {
                    const cx = (idx / (dynamicBarData.length - 1)) * (1000 - 120) + 60;
                    const cy = 400 - 60 - (val / Math.max(highestAmount, 1)) * (400 - 120);
                    const isSelected = selectedMonthIdx === idx;
                     
                    return (
                      <g key={idx} onClick={() => setSelectedMonthIdx(idx)} className="cursor-pointer group">
                        {/* Hover/Click area expansion */}
                        <circle cx={cx} cy={cy} r="25" fill="transparent" />
                         
                        {/* Actual visual dot */}
                        <circle
                          cx={cx} cy={cy}
                          r={isSelected ? "8" : "5"}
                          fill={isSelected ? "#2dd4bf" : "white"}
                          stroke={isSelected ? "#134e4a" : "#2563eb"}
                          strokeWidth="3"
                          className="transition-all duration-300 group-hover:r-[8px]"
                        />
                      </g>
                    );
                  })}
                </svg>
                 
                {/* X-Axis Labels */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-[60px]">
                  {barMonths.map((month, idx) => (
                    <span key={month} className={`text-xs font-bold uppercase transition-colors ${selectedMonthIdx === idx ? 'text-blue-600' : 'text-slate-400'}`}>
                      {month}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Selected Month Analysis Panel */}
            <div className="bg-[#f8fafc] border-t border-slate-200 p-6 lg:p-8 shrink-0">
               <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
                 
                 <div className="flex-1 w-full">
                   <h3 className="text-lg font-bold text-slate-800 mb-1">
                     {barMonths[selectedMonthIdx]} Details
                   </h3>
                   <div className="flex items-end gap-3 mb-2">
                     <span className="text-4xl font-bold text-blue-600">
                       ₹{dynamicBarData[selectedMonthIdx].toLocaleString('en-IN')}
                     </span>
                     <span className="text-sm font-medium text-slate-500 mb-1">spent</span>
                   </div>
                 </div>
                 
                 <div className="flex-1 w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-3">
                     <span className="text-sm font-bold text-slate-700">Percentage of Total Year</span>
                     <span className="text-lg font-bold text-teal-500">
                       {totalYearlySpent > 0 ? Math.round((dynamicBarData[selectedMonthIdx] / totalYearlySpent) * 100) : 0}%
                     </span>
                   </div>
                   <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                     <div
                       className="bg-teal-400 h-full rounded-full transition-all duration-700"
                       style={{ width: `${totalYearlySpent > 0 ? (dynamicBarData[selectedMonthIdx] / totalYearlySpent) * 100 : 0}%` }}
                     ></div>
                   </div>
                   <p className="text-xs text-slate-500 mt-3 text-center">
                     Total spent this year: ₹{totalYearlySpent.toLocaleString('en-IN')}
                   </p>
                 </div>
                 
               </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}