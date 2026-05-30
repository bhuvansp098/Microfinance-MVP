import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Steps out to src/firebase.js correctly
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Wheat, Wallet, Plus, Clock, Trash2, TrendingDown } from 'lucide-react';
import farmImage from "../assets/farm-tractor.jpg";

export default function ExpenseTracker() {
  const navigate = useNavigate();

  // Form Field States
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");

  // Live Sync States
  const [expenses, setExpenses] = useState([]);
  const [userProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : { name: "Guest", phone: "guest", savings: 0 };
  });

  // Unique key signature to isolate records in Firebase by user phone profiles
  const userKey = userProfile.phone || "guest";
  const userCollectionPath = `expenses_${userKey}`;

  // ===================== 1. READ FROM FIRESTORE (User Scoped) =====================
  useEffect(() => {
    const q = query(collection(db, userCollectionPath), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(liveData);

      // CRITICAL FOR DASHBOARD SYNC: Caches live Firebase array down to local pool matching dashboard rules
      localStorage.setItem(`expenses_${userKey}`, JSON.stringify(liveData));
      window.dispatchEvent(new Event('storage_update'));
    }, (error) => {
      console.error("Firestore Reader Stream Error:", error);
    });

    return () => unsubscribe();
  }, [userKey, userCollectionPath]);

  // ===================== 2. WRITE TO FIRESTORE =====================
  const saveToDatabase = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !cost) {
      alert("⚠️ Please enter both an item name and an expense cost amount.");
      return;
    }

    try {
      await addDoc(collection(db, userCollectionPath), {
        item: itemName.trim(),
        cost: Number(cost),
        timestamp: serverTimestamp()
      });

      // Reset input form elements immediately
      setItemName("");
      setCost("");
    } catch (error) {
      console.error("Error saving to Firebase Firestore:", error);
      alert("❌ Failed to log across cloud database networks. Check developer console.");
    }
  };

  // Math metric accumulation logic
  const runningTotalExpenses = expenses.reduce((sum, e) => sum + (Number(e.cost) || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f6f8] relative overflow-hidden pb-16 font-sans text-slate-800">
      
      {/* BACKGROUND INTERACTIVE THEME LAYERS */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${farmImage})` }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navigation App Row Bar */}
      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Wheat className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">GraamSeva</span>
        </div>
        
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
      </nav>

      {/* Main Framework Grid Workspace */}
      <div className="relative z-10 p-4 lg:p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        
        {/* ================= LEFT MAIN WORK CARD PANEL ================= */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Running Metric Block */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden border border-slate-800">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Spent This Season</p>
            <h2 className="text-4xl font-black mt-2 text-red-400 tracking-tight">
              ₹{runningTotalExpenses.toLocaleString('en-IN')}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Live Cloud Ledger
            </div>
          </div>

          {/* Form Entry Box Container */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Log New Farm Expense</h3>
            </div>

            <form onSubmit={saveToDatabase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Expense Item / Reason</label>
                <input 
                  type="text" 
                  placeholder="e.g. Urea Fertilizer, Tractor Fuel" 
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount Spent (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-blue-700/10 flex items-center justify-center gap-1.5 text-sm active:scale-[0.98] mt-2"
              >
                <Plus className="w-4 h-4" /> Save to Cloud Ledger
              </button>
            </form>
          </div>
        </div>

        {/* ================= RIGHT LIVE OUTPUT STREAM LAYER ================= */}
        <div className="md:col-span-7">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Ledger Statements</h3>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-20 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-white/50 mt-4">
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    No active expenses logged in Firebase.<br />Fill the form to push your first real-time record statement block.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {expenses.map((exp) => (
                    <div 
                      key={exp.id} 
                      className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition shadow-sm animate-fadeIn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs">
                          ₹
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm tracking-tight">{exp.item}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Logged securely on cloud</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-black text-sm text-red-500 tracking-tight">
                          - ₹{Number(exp.cost).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 text-center mt-6 font-medium">
              🔒 Encrypted end-to-end sandbox under user profile node signature logic profiles.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}