import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  Wheat, 
  ArrowLeft, 
  Mic, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Clock,
  PiggyBank,
  User
} from 'lucide-react';

export default function Transactions() {
  const navigate = useNavigate();

  // ===================== REGISTRATION AND PROFILE LAYERS =====================
  const [userProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored
      ? JSON.parse(stored)
      : { name: "Guest", phone: "", savings: 0, district: "" };
  });

  // Scoped database engines mapped cleanly by phone key signatures
  const userKey = userProfile.phone || "guest";
  const expensesKey = `expenses_${userKey}`;
  const txnsKey = `transactions_${userKey}`;
  const contactsKey = `contacts_${userKey}`;
  const seenKey = `seenUser_${userKey}`;

  // ===================== LIVE SYSTEM STATE ENGINES =====================
  const [transactionMode, setTransactionMode] = useState('send'); 
  
  const [recipient, setRecipient] = useState('');
  const [senderName, setSenderName] = useState(''); // NEW STATE: Optional sender name tracker
  const [amount, setAmount] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi-IN');

  // Dynamic Contacts Pool Engine
  const [frequentContacts, setFrequentContacts] = useState(() => {
    const savedContacts = localStorage.getItem(contactsKey);
    return savedContacts ? JSON.parse(savedContacts) : [
      { name: 'Ramu', role: 'Farmer Friend' },
      { name: 'Sita', role: 'SHG Leader' },
      { name: 'Suresh', role: 'Seed Shop' }
    ];
  });

  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [showAddContactForm, setShowAddContactForm] = useState(false);

  // Dynamic Expenses Live Cache (To accurately calculate remaining balance pools)
  const [expenses] = useState(() => {
    const saved = localStorage.getItem(expensesKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic Local Transactions Ledger
  const [transactions, setTransactions] = useState(() => {
    const isReturning = localStorage.getItem(seenKey) === "true";
    if (!isReturning) return []; 
    const saved = localStorage.getItem(txnsKey);
    return saved ? JSON.parse(saved) : [];
  });

  // ===================== PERSISTENCE DRIVERS =====================
  useEffect(() => {
    localStorage.setItem(txnsKey, JSON.stringify(transactions));
    window.dispatchEvent(new Event('storage_update'));
  }, [transactions, txnsKey]);

  useEffect(() => {
    localStorage.setItem(contactsKey, JSON.stringify(frequentContacts));
  }, [frequentContacts, contactsKey]);

  // ===================== COMPUTE Live MATHEMATICS =====================
  const baseSavings = Number(userProfile.savings) || 0;
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  
  const totalSentTxns = transactions.filter(t => t.type === 'sent').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalReceivedTxns = transactions.filter(t => t.type === 'received').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  const availableBalance = baseSavings + totalReceivedTxns - totalExpenses - totalSentTxns;

  // ===================== SYSTEM OPERATION HANDLERS =====================
  const startVoiceInput = (stateSetterFunction) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support voice typing. Try using Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (stateSetterFunction === setAmount) {
         const numbersOnly = transcript.replace(/[^0-9.]/g, '');
         if (numbersOnly) stateSetterFunction(numbersOnly);
      } else {
         stateSetterFunction(transcript);
      }
    };
    recognition.start();
  };

  const handleProcessTransaction = (e) => {
    e.preventDefault();
    const actionAmount = parseFloat(amount);
    
    if (!actionAmount || actionAmount <= 0) {
      alert("⚠️ Please enter a valid currency amount.");
      return;
    }

    if (transactionMode === 'send') {
      if (!recipient.trim()) {
        alert("⚠️ Please enter a valid recipient name.");
        return;
      }
      if (actionAmount > availableBalance) {
        alert("❌ Not enough money in your available savings balance pool!");
        return;
      }

      const newTxn = {
        id: Date.now(),
        name: recipient.trim(),
        amount: actionAmount,
        category: "Money Transfer 💸",
        title: `Sent to ${recipient.trim()}`,
        type: 'sent',
        date: 'Just now'
      };
      setTransactions([newTxn, ...transactions]);
      setRecipient('');
    } else {
      // Add Savings Mode execution
      const finalSender = senderName.trim() ? senderName.trim() : "Self Deposit 💰";
      const newTxn = {
        id: Date.now(),
        name: finalSender,
        amount: actionAmount,
        category: senderName.trim() ? "Received Payment 📥" : "Savings Added 🐷",
        title: senderName.trim() ? `Received from ${senderName.trim()}` : "Added to Savings",
        type: 'received',
        date: 'Just now'
      };
      setTransactions([newTxn, ...transactions]);
      setSenderName(''); // reset the field
    }
    
    setAmount('');
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    
    const newContact = {
      name: newContactName.trim(),
      role: newContactRole.trim() || "Local Link"
    };

    setFrequentContacts([...frequentContacts, newContact]);
    setNewContactName('');
    setNewContactRole('');
    setShowAddContactForm(false);
  };

  const addQuickAmount = (val) => {
    setAmount(prev => (prev ? (parseFloat(prev) + val).toString() : val.toString()));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20 font-sans text-slate-800">
      
      {/* BACKGROUND GRAPHICS LAYER */}
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
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-300/20 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-teal-200/15 rounded-full filter blur-[120px] pointer-events-none z-0"></div>

      {/* CORE FRAME LAYOUT */}
      <div className="relative z-10 p-4 lg:p-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="hidden lg:block col-span-3 space-y-6 mt-4">
          <div className="bg-blue-700 rounded-3xl p-6 shadow-lg border border-blue-600 text-white relative overflow-hidden">
            <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold tracking-tight">₹{availableBalance.toLocaleString('en-IN')}</h2>
            <p className="text-blue-200 text-xs mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></span>
              Secure Passbook Connected
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-teal-400 rounded-full"></span>
                Tap to Send
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAddContactForm(!showAddContactForm)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-100 rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showAddContactForm && (
              <form onSubmit={handleAddContact} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2.5 animate-fadeIn">
                <input 
                  type="text" 
                  placeholder="Contact Name" 
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Role (e.g. Dairy Shop)" 
                  value={newContactRole}
                  onChange={(e) => setNewContactRole(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none"
                />
                <button type="submit" className="w-full bg-slate-900 text-white font-bold text-[11px] py-1.5 rounded-lg">
                  Save Contact
                </button>
              </form>
            )}

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {frequentContacts.map((contact, index) => (
                <button 
                  type="button"
                  key={index}
                  onClick={() => {
                    setTransactionMode('send');
                    setRecipient(contact.name);
                  }}
                  className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition shadow-sm flex items-center gap-3 active:scale-95"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{contact.name}</p>
                    <p className="text-[10px] text-slate-400 truncate font-medium">{contact.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN WORKSPACE ================= */}
        <div className="col-span-1 lg:col-span-6 space-y-6">
          
          <div className="mb-2 pb-6 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Transactions 🏦
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Manage and process your financial tasks.
              </p>
            </div>
            
          </div>

          {/* MODE TABS SWITCHER */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl border border-slate-200/40">
            <button
              type="button"
              onClick={() => setTransactionMode('send')}
              className={`py-3 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                transactionMode === 'send' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4" />
              Send Money
            </button>
            <button
              type="button"
              onClick={() => setTransactionMode('deposit')}
              className={`py-3 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                transactionMode === 'deposit' 
                  ? 'bg-blue-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              Add Savings
            </button>
          </div>

          {/* Unified Form Card */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
            <form onSubmit={handleProcessTransaction} className="space-y-6">
              
              {/* Recipient box when in 'Send Money' state */}
              {transactionMode === 'send' && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    1. Send to (Name or Number)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Enter name or Account Number..."
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => startVoiceInput(setRecipient)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Amount Box (Universal) */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {transactionMode === 'send' ? '2. How much to send? (₹)' : '1. Enter Amount to Deposit (₹)'}
                </label>
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold shadow-inner text-lg"
                  />
                  <button 
                    type="button"
                    onClick={() => startVoiceInput(setAmount)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button type="button" onClick={() => addQuickAmount(500)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-2 text-xs font-bold transition-colors">+ ₹500</button>
                  <button type="button" onClick={() => addQuickAmount(1000)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-2 text-xs font-bold transition-colors">+ ₹1,000</button>
                  <button type="button" onClick={() => addQuickAmount(2000)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-2 text-xs font-bold transition-colors">+ ₹2,000</button>
                </div>
              </div>

              {/* NEW: Optional 'From' field specifically rendered for Add Savings deposits */}
              {transactionMode === 'deposit' && (
                <div className="animate-fadeIn pt-2">
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    2. From <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Payment from whom?"
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold shadow-inner text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => startVoiceInput(setSenderName)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full font-bold text-lg rounded-xl px-4 py-4 mt-2 transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98] ${
                  transactionMode === 'send' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                }`}
              >
                {transactionMode === 'send' ? <Send className="w-5 h-5" /> : <PiggyBank className="w-5 h-5" />}
                {transactionMode === 'send' ? 'Send Money Now' : 'Deposit Savings Now'}
              </button>
            </form>
          </div>

          {/* Passbook Feed */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 mt-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> My Passbook (Past Payments)
            </h3>
            
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-2 p-2">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl bg-white">
                  No payment logs found on local user channels.
                </div>
              ) : (
                transactions.map((txn) => (
                  <div key={txn.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm animate-fadeIn">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${txn.type === 'sent' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {txn.type === 'sent' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{txn.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{txn.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`font-bold tracking-tight text-sm ${txn.type === 'sent' ? 'text-red-500' : 'text-emerald-600'}`}>
                        {txn.type === 'sent' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                      </p>
                      <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        txn.type === 'sent' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {txn.type === 'sent' ? 'Debit' : 'Credit'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden lg:block col-span-3 space-y-6 mt-4">
          <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-5 rounded-3xl shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-orange-400 rounded-full"></span>
              Bills to Pay Soon
            </h3>
            <div className="bg-orange-50 border border-orange-100/70 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-slate-800">SHG Group Savings</p>
                <span className="bg-orange-200 text-orange-800 text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide">PAY SOON</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Pay your monthly savings before the 5th.</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-black text-slate-900">₹500</p>
                <button 
                  type="button"
                  onClick={() => {
                    setTransactionMode('send');
                    setRecipient('SHG Group Fund'); 
                    setAmount('500');
                  }} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-5 shadow-sm text-white">
             <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-teal-400 rounded-full"></span>
              Safety Rules
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To keep your money safe, you can only send up to <strong>₹50,000</strong> per day. Never share your OTP.
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-teal-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((totalSentTxns / 50000) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium text-right">₹{totalSentTxns.toLocaleString('en-IN')} sent today</p>
          </div>
        </div>

      </div>
    </div>
  );
}