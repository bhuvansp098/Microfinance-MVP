<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';

export default function Expenses() {
  const mockUserBaseBalance = 50000;
  const mockTxnLength = 2;

  // ===================== STATE ENGINE =====================
  // LAZY INITIALIZATION: Reads from localStorage first so data persists on page reload/navigation
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('local_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [
      { name: 'Rice Purchase', amount: 500, category: 'Food' },
      { name: 'Bus Fare', amount: 50, category: 'Travel' },
    ];
  });
=======
import React, { useState } from 'react';

export default function Expenses() {
  // ===================== BASE ENGINE POOL =====================
  // Dynamic initial pool to mimic your backend storage engine
  const mockUserBaseBalance = 50000;
  const mockTxnLength = 2; // Baseline from dev1's dashboard template

  // ===================== STATE ENGINE =====================
  const [expenses, setExpenses] = useState([
    { name: 'Rice Purchase', amount: 500, category: 'Food' },
    { name: 'Bus Fare', amount: 50, category: 'Travel' },
  ]);
>>>>>>> Stashed changes

  const [inputName, setInputName] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputCategory, setInputCategory] = useState('Food');

<<<<<<< Updated upstream
  const barMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseHistoricalData = [1000, 1000, 1000, 1000, 1000, 0];

  // ===================== PERSISTENCE LAYER =====================
  // Automatically writes to localStorage whenever the expenses array changes
  useEffect(() => {
    localStorage.setItem('local_expenses', JSON.stringify(expenses));
    
    // HACKATHON SYNC: Dispatches a custom event to notify the home page dashboard to update its stats live!
    window.dispatchEvent(new Event('storage_update'));
  }, [expenses]);

  // ===================== MATH ENGINE =====================
=======
  // Chart tracking configurations
  const barMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseHistoricalData = [2100, 3400, 2800, 1900, 3240, 0];

  // ===================== MATHEMATICAL EQUATIONS =====================
>>>>>>> Stashed changes
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingSaved = mockUserBaseBalance - totalSpent;
  const combinedTxnsCount = expenses.length + mockTxnLength;

<<<<<<< Updated upstream
=======
  // Dynamically map current values into the June index slot
>>>>>>> Stashed changes
  const dynamicBarData = [...baseHistoricalData];
  dynamicBarData[5] = totalSpent;
  const maxBarValue = Math.max(...dynamicBarData.slice(0, -1), 1);

<<<<<<< Updated upstream
  // ===================== HANDLERS =====================
=======
  // ===================== FORM HANDLERS =====================
>>>>>>> Stashed changes
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputAmount || parseInt(inputAmount) <= 0) {
      alert('⚠️ Enter a valid expense name and amount.');
      return;
    }

    const newExpense = {
      name: inputName.trim(),
      amount: parseInt(inputAmount),
      category: inputCategory,
    };

    setExpenses([newExpense, ...expenses]);
    setInputName('');
    setInputAmount('');
  };

  const handleClearExpenses = () => {
    if (window.confirm('Are you sure you want to clear your entire expense history?')) {
      setExpenses([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      
      {/* Top Heading Banner */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Expense Tracker 📊</h1>
          <p className="text-slate-500">Monitor your daily spending</p>
        </div>
        <button 
<<<<<<< Updated upstream
          type="button"
=======
>>>>>>> Stashed changes
          onClick={handleClearExpenses}
          className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition"
        >
          🗑️ Reset History
        </button>
      </div>

<<<<<<< Updated upstream
      {/* Real-time Summary Cards */}
=======
      {/* Real-time Math Summary Blocks */}
>>>>>>> Stashed changes
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Spent</p>
          <h3 className="text-xl font-bold text-red-500 mt-1">₹{totalSpent.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Remaining</p>
          <h3 className="text-xl font-bold text-green-600 mt-1">₹{remainingSaved.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Transactions</p>
          <h3 className="text-xl font-bold text-blue-500 mt-1">{combinedTxnsCount}</h3>
        </div>
      </div>

      {/* Add Expense Form Card */}
      <form onSubmit={handleAddExpense} className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4 text-slate-800">Add New Entry</h2>

        <div className="space-y-3">
          <input
            type="text"
<<<<<<< Updated upstream
            placeholder="Expense Name"
=======
            placeholder="Expense Name (e.g., Fertilizer, Seeds)"
>>>>>>> Stashed changes
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-green-500 transition text-sm"
          />

          <input
            type="number"
<<<<<<< Updated upstream
            placeholder="Amount"
=======
            placeholder="Amount (₹)"
>>>>>>> Stashed changes
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-green-500 transition text-sm"
          />

          <select 
            value={inputCategory} 
            onChange={(e) => setInputCategory(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-green-500 transition text-sm bg-white"
          >
<<<<<<< Updated upstream
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
          </select>

          <button type="submit" className="w-full bg-green-600 text-white font-semibold rounded-xl p-3 hover:bg-green-700 transition duration-200 active:scale-[0.99]">
            Add Expense
=======
            <option value="Food">Food 🍚</option>
            <option value="Travel">Travel 🚗</option>
            <option value="Education">Education 📚</option>
            <option value="Healthcare">Healthcare 💊</option>
            <option value="Agriculture">Agriculture 🌾</option>
          </select>

          <button type="submit" className="w-full bg-green-600 text-white font-semibold rounded-xl p-3 hover:bg-green-700 transition duration-200 shadow-md shadow-green-600/10 active:scale-[0.99]">
            Add Expense +
>>>>>>> Stashed changes
          </button>
        </div>
      </form>

<<<<<<< Updated upstream
      {/* Dynamic CSS Bar Chart */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4 text-slate-800">Monthly Spending History</h2>
=======
      {/* Dynamic Native CSS Bar Chart Section */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4 text-slate-800">Monthly Spending History</h2>
        
>>>>>>> Stashed changes
        <div className="h-36 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-end gap-3 justify-between">
          {barMonths.map((month, index) => {
            const heightPct = Math.max(6, Math.round((dynamicBarData[index] / maxBarValue) * 100));
            const isJune = index === 5;
<<<<<<< Updated upstream
=======
            
>>>>>>> Stashed changes
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 min-h-[4px] ${
                    isJune ? 'bg-green-600 shadow-sm shadow-green-600/20' : 'bg-slate-200'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] text-slate-400 font-bold mt-1">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Recent Expenses List Output */}
      <div>
        <h2 className="font-semibold mb-4 text-slate-800">Recent Expenses</h2>
<<<<<<< Updated upstream
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">
=======

        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl border-2 border-dashed border-slate-100">
>>>>>>> Stashed changes
              No expenses recorded yet.
            </div>
          ) : (
            expenses.map((exp, index) => (
<<<<<<< Updated upstream
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{exp.name}</p>
                  <p className="text-sm text-slate-500">{exp.category}</p>
                </div>
                <p className="text-red-500 font-semibold">-₹{exp.amount.toLocaleString('en-IN')}</p>
=======
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center animate-fadeIn">
                <div>
                  <p className="font-semibold text-slate-800">{exp.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider font-bold">{exp.category}</p>
                </div>
                <p className="text-red-500 font-bold text-lg">-₹{exp.amount.toLocaleString('en-IN')}</p>
>>>>>>> Stashed changes
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}