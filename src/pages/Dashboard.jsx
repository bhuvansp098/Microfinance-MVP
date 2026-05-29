import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const GREET_EMOJIS = ["👋", "🌸", "🌟", "🌻", "🙌", "✨", "🌾", "🪴", "😊", "🌞"];

export default function Dashboard() {
  const navigate = useNavigate();
  

  // ===================== USER PROFILE =====================
  const [userProfile, setUserProfile] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored
      ? JSON.parse(stored)
      : { name: "Guest", phone: "", savings: 0, district: "" };
  });

  // Per-user storage keys (scoped by phone so each user has their own data)
  const userKey = userProfile.phone || "guest";
  const expensesKey = `expenses_${userKey}`;
  const txnsKey = `transactions_${userKey}`;
  const seenKey = `seenUser_${userKey}`;

  // ===================== EXPENSES =====================
  const [expenses, setExpenses] = useState(() => {
    const isReturning = localStorage.getItem(seenKey) === "true";
    if (!isReturning) return []; // new user → fresh
    const saved = localStorage.getItem(expensesKey);
    return saved ? JSON.parse(saved) : [];
  });

  // ===================== TRANSACTIONS =====================
  const [transactions, setTransactions] = useState(() => {
    const isReturning = localStorage.getItem(seenKey) === "true";
    if (!isReturning) return []; // new user → fresh
    const saved = localStorage.getItem(txnsKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Mark this user as "seen" so next login is treated as returning
  useEffect(() => {
    if (userProfile.phone) {
      localStorage.setItem(seenKey, "true");
    }
  }, [seenKey, userProfile.phone]);

  // Persist whenever they change
  useEffect(() => {
    localStorage.setItem(expensesKey, JSON.stringify(expenses));
  }, [expenses, expensesKey]);

  useEffect(() => {
    localStorage.setItem(txnsKey, JSON.stringify(transactions));
  }, [transactions, txnsKey]);

  // ===================== BALANCE =====================
  const baseSavings = Number(userProfile.savings) || 0;
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );
  const availableBalance = baseSavings - totalExpenses;

  // ===================== UI =====================
  const [greetEmoji] = useState(
  () => GREET_EMOJIS[Math.floor(Math.random() * GREET_EMOJIS.length)]
);
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-slate-500 text-sm">Welcome back,</p>
          <h2 className="text-xl font-bold text-slate-800">
            {userProfile.name} {greetEmoji}
          </h2>
          {userProfile.district && (
            <p className="text-xs text-slate-400">{userProfile.district}</p>
          )}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("currentUser");
            navigate("/login");
          }}
          className="text-sm text-red-500"
        >
          Logout
        </button>
      </div>

      {/* Available Balance */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-lg mb-6">
        <p className="text-sm opacity-80">Available Balance</p>
        <h1 className="text-3xl font-bold mt-1">
          ₹{availableBalance.toLocaleString("en-IN")}
        </h1>
        <p className="text-xs opacity-75 mt-2">
          Starting savings: ₹{baseSavings.toLocaleString("en-IN")} · Spent: ₹
          {totalExpenses.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Extra Income Sources */}
      <div
        onClick={() => navigate("/income-ideas")}
        className="bg-white rounded-2xl p-5 shadow cursor-pointer mb-6 hover:shadow-md transition"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-800">
              💡 Extra Income Sources
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {userProfile.district
                ? `Ideas for ${userProfile.district}`
                : "Region-based business ideas"}
            </p>
          </div>
          <span className="text-green-600 text-sm">Explore →</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => navigate("/expenses")}
          className="bg-white rounded-xl p-4 shadow text-left"
        >
          <p className="text-2xl">💸</p>
          <p className="font-semibold mt-1">Expenses</p>
          <p className="text-xs text-slate-500">{expenses.length} entries</p>
        </button>
        <button
          onClick={() => navigate("/transactions")}
          className="bg-white rounded-xl p-4 shadow text-left"
        >
          <p className="text-2xl">📜</p>
          <p className="font-semibold mt-1">Transactions</p>
          <p className="text-xs text-slate-500">
            {transactions.length} entries
          </p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <h3 className="font-semibold text-slate-800 mb-3">Recent Activity</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400">
            No transactions yet. Start by adding an expense.
          </p>
        ) : (
          <ul className="space-y-2">
            {transactions.slice(0, 5).map((t, i) => (
              <li
                key={i}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span>{t.title || t.category}</span>
                <span className="text-red-500">
                  -₹{Number(t.amount).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
