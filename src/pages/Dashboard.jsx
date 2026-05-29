import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const mockBaseBalance = 50000; // Baseline to subtract expenses from

  // ===================== DYNAMIC STATE ENGINE =====================
  
  // 1. Fetch user profile from localStorage (handles your dynamic login name)
  const [userProfile, setUserProfile] = useState(() => {
    // Falls back to a mock default object if dev2's login hasn't saved a user yet
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : { name: "Ashwin" };
  });

  // 2. Fetch the expenses array dynamically from your localStorage key
  const [dashboardExpenses, setDashboardExpenses] = useState(() => {
  const saved = localStorage.getItem('local_expenses');
  return saved ? JSON.parse(saved) : []; // Make sure this array is empty!
});

  // ===================== LIVE SYNC LISTENER =====================
  useEffect(() => {
    const handleUpdate = () => {
      // Pull fresh data from localStorage when an expense is added/wiped
      const savedExpenses = localStorage.getItem('local_expenses');
      if (savedExpenses) {
        setDashboardExpenses(JSON.parse(savedExpenses));
      }
      
      // Also check if a new user logged in
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
      }
    };

    // Listen for our custom event fired from Expenses.jsx
    window.addEventListener('storage_update', handleUpdate);
    return () => window.removeEventListener('storage_update', handleUpdate);
  }, []);

  // ===================== MATHEMATICAL EQUATIONS =====================
  const totalExpenses = dashboardExpenses.reduce((sum, item) => sum + item.amount, 0);
  const availableBalance = mockBaseBalance - totalExpenses;
  const totalTransactionsCount = dashboardExpenses.length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Hello {userProfile.name} 👋
        </h1>
        <p className="text-slate-500">
          Welcome back to GraamSeva
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-green-600 text-white rounded-3xl p-6 shadow-lg mb-6">
        <p className="text-green-100">
          Available Balance
        </p>
        <h1 className="text-4xl font-bold mt-2">
          ₹{availableBalance.toLocaleString('en-IN')}
        </h1>
        <p className="text-green-100 mt-2">
          SHG Member • Rural Savings Group
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">Savings Pool</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{mockBaseBalance.toLocaleString('en-IN')}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">Loan Due</p>
          <h2 className="text-2xl font-bold text-red-500">
            ₹0
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">Expenses</p>
          <h2 className="text-2xl font-bold text-orange-500">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold text-blue-500">
            {totalTransactionsCount}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/transactions")}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-center"
          >
            <div className="text-xl">💸</div>
            <p className="text-sm mt-2">Send</p>
          </button>

          <button
            onClick={() => navigate("/expenses")}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-center"
          >
            <div className="text-xl">📊</div>
            <p className="text-sm mt-2">Expenses</p>
          </button>

          <button
            onClick={() => navigate("/assistant")}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-center"
          >
            <div className="text-xl">🤖</div>
            <p className="text-sm mt-2">AI Help</p>
          </button>
        </div>
      </div>

      {/* Dynamic Recent Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {dashboardExpenses.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">
              No recent logs found.
            </div>
          ) : (
            dashboardExpenses.map((exp, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">
                    {exp.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {exp.category || "General"}
                  </p>
                </div>
                <p className="text-red-500 font-semibold">
                  -₹{exp.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}