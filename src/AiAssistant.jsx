// import React, { useState, useEffect, useRef } from "react";
// import { GoogleGenAI } from "@google/genai";
// import { MessageSquare, Send, Bot, Wheat, ArrowLeft, Mic, MicOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// export default function Assistant() {
//   const navigate = useNavigate();
//   const chatEndRef = useRef(null);
  
//   // Voice Recognition Ref
//   const recognitionRef = useRef(null);

//   // ===================== USER PROFILE & PERSISTENT KEY SCOPING =====================
//   const [userProfile] = useState(() => {
//     const stored = localStorage.getItem("userProfile");
//     return stored
//       ? JSON.parse(stored)
//       : { name: "Guest", phone: "", savings: 0, district: "" };
//   });

//   const userKey = userProfile.phone || "guest";
//   const chatHistoryKey = `chat_history_${userKey}`;

//   // ===================== CHAT & VOICE STATE ENGINE =====================
//   const [messages, setMessages] = useState(() => {
//     const savedChat = localStorage.getItem(chatHistoryKey);
//     return savedChat ? JSON.parse(savedChat) : [
//       {
//         sender: "bot",
//         text: `Namaste ${userProfile.name}! 🙏 I am your GraamSeva AI Assistant. You can ask me questions about loans, savings, mandi crop prices, or government schemes in English, Hindi, Kannada, or Tamil. How can I help you today?`,
//       },
//     ];
//   });

//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [language, setLanguage] = useState("English"); // Tracks active speech/response language

//   // Dictionary for localized loading states
//   const loadingMessages = {
//     "Kannada": "ಯೋಚಿಸುತ್ತಿದೆ...",
//     "Tamil": "சிந்திக்கிறது...",
//     "Hindi": "सोच रहा है...",
//     "English": "Thinking..."
//   };

//   // Loan Calculator local view states
//   const [principal, setPrincipal] = useState(10000);
//   const [rate, setRate] = useState(7);
//   const [years, setYears] = useState(1);
//   const interest = (principal * rate * years) / 100;
//   const totalAmount = Number(principal) + Number(interest);

//   useEffect(() => {
//     localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, chatHistoryKey]);

//   // ===================== CORE UTILITIES =====================
//   const getLanguageCode = (langName) => {
//     if (langName === "Kannada") return "kn-IN";
//     if (langName === "Tamil") return "ta-IN";
//     if (langName === "Hindi") return "hi-IN";
//     return "en-IN";
//   };

//   // ===================== GEMINI API CONNECTOR =====================
//   const askGeminiDirect = async (textToAsk, lang) => {
//     if (!textToAsk.trim() || isLoading) return;

//     setIsLoading(true);
    
//     if (!ai) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ API Key Configuration Error. Please ensure VITE_GEMINI_API_KEY is defined in your root local .env file." },
//       ]);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Pull and update context history
//       const currentChatHistory = JSON.parse(localStorage.getItem(chatHistoryKey)) || messages;
//       const recentContextPool = currentChatHistory.slice(1).slice(-3);

//       const contents = [
//         ...recentContextPool.map((msg) => ({
//           role: msg.sender === "user" ? "user" : "model",
//           parts: [{ text: msg.text }],
//         })),
//         { role: "user", parts: [{ text: textToAsk }] }
//       ];

//       const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: contents,
//         config: {
//           systemInstruction: 
//             "You are GraamSeva AI, a helpful, empathetic, and expert rural banking, microfinance, and agriculture assistant. " +
//             `CRITICAL RULE: You must write your entire final response in the ${lang} language. ` +
//             "Keep your responses short, simple, clear, and limit it to 3 sentences maximum.",
//           temperature: 0.3,
//         },
//       });

//       const aiReply = response.text || "I apologize, I could not process that request. Please try again.";
//       setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
//     } catch (error) {
//       console.error("Gemini Pipeline Failure:", error);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Sorry, I am facing a tiny network connection block right now. Let's try that query one more time!" },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ===================== HANDLERS =====================
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputValue.trim() || isLoading) return;

//     const userQuery = inputValue.trim();
//     setInputValue(""); 

//     setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
//     askGeminiDirect(userQuery, language);
//   };

//   const toggleVoiceInput = () => {
//     if (isListening && recognitionRef.current) {
//       recognitionRef.current.stop();
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Voice recognition is not supported in this browser. Try using Google Chrome.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = getLanguageCode(language);
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setIsListening(true);
    
//     recognition.onresult = (event) => {
//       let fullTranscript = "";
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         fullTranscript += event.results[i][0].transcript;
//       }
      
//       if (fullTranscript.trim() !== "") {
//         setInputValue(fullTranscript);
//         // Instantly log onto the UI message blocks
//         setMessages((prev) => [...prev, { sender: "user", text: fullTranscript }]);
//         askGeminiDirect(fullTranscript, language);
//       }
//     };

//     recognition.onend = () => setIsListening(false);
//     recognition.start();
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] relative overflow-hidden pb-32 font-sans text-slate-800">
      
//       {/* BACKGROUND GRAPHICS LAYER */}
//       <div className="absolute inset-0 opacity-[0.35] pointer-events-none" style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
//       <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none z-0" />
//       <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[120px] pointer-events-none z-0" />

//       {/* Navigation Top-Bar */}
//       <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
//             <Wheat className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-slate-900 text-lg tracking-tight">GraamSeva</span>
//         </div>
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-sm transition"
//         >
//           <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
//         </button>
//       </nav>

//       {/* Main Grid Workspace */}
//       <div className="relative z-10 p-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
//         {/* ================= LEFT SIDEBAR (Shortcuts & Language Picker) ================= */}
//         <div className="hidden lg:block col-span-3 space-y-6 mt-16">
//           <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
//             <div>
//               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assistant Language</h3>
//               <select 
//                 value={language} 
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 transition cursor-pointer"
//               >
//                 <option value="English">English</option>
//                 <option value="Hindi">Hindi (हिंदी)</option>
//                 <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
//                 <option value="Tamil">Tamil (தமிழ்)</option>
//               </select>
//             </div>
            
//             <div className="pt-2 border-t border-slate-100 space-y-3">
//               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Shortcuts</h3>
//               <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 transition flex items-center gap-3 shadow-sm">
//                 <span>🌾</span> Mandi Market Rates
//               </button>
//               <button onClick={() => window.open("https://pmkisan.gov.in/", "_blank")} className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 transition flex items-center gap-3 shadow-sm">
//                 <span>🏛️</span> Govt. Schemes (PM-KISAN)
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ================= CENTER COLUMN (Chat Thread Console) ================= */}
//         <div className="col-span-1 lg:col-span-6 flex flex-col h-[calc(100vh-200px)]">
//           <div className="pb-4 border-b border-slate-200/60 flex items-center justify-between gap-4 shrink-0">
//             <div className="flex items-center gap-4">
//               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
//                 <MessageSquare className="w-5 h-5" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GraamSeva Assistant</h1>
//                 <p className="text-xs text-slate-500 font-medium">Speaking and responding in: {language}</p>
//               </div>
//             </div>
            
//             {/* Mobile/Tablet Inline Selector Dropdown */}
//             <select 
//               value={language} 
//               onChange={(e) => setLanguage(e.target.value)}
//               className="lg:hidden bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none"
//             >
//               <option value="English">EN</option>
//               <option value="Hindi">हिंदी</option>
//               <option value="Kannada">ಕನ್ನಡ</option>
//               <option value="Tamil">தமிழ்</option>
//             </select>
//           </div>

//           {/* Scrolling Conversation Stream Container */}
//           <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2 min-h-[350px]">
//             {messages.map((msg, index) => (
//               <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`max-w-[85%] px-5 py-3.5 rounded-2xl font-medium text-sm shadow-sm border ${
//                     msg.sender === "user"
//                       ? "bg-blue-700 text-white border-blue-600 rounded-tr-sm"
//                       : "bg-white border-slate-200 text-slate-800 rounded-tl-sm"
//                   }`}
//                 >
//                   {msg.sender === "bot" && (
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
//                       <Bot className="w-3 h-3 text-emerald-600" /> GraamSeva AI
//                     </span>
//                   )}
//                   <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
//                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
//                     {loadingMessages[language] || "Thinking..."}
//                   </span>
//                   <div className="flex gap-1">
//                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         {/* ================= RIGHT SIDEBAR (Calculator Widget) ================= */}
//         <div className="hidden lg:block col-span-3 mt-16">
//           <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-6 rounded-3xl shadow-sm sticky top-6">
//             <h3 className="text-base font-bold text-slate-900 mb-1">Loan Calculator</h3>
//             <p className="text-xs text-slate-400 mb-5">Quick simple interest check</p>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-1">Loan Amount (₹)</label>
//                 <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium shadow-sm" />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-600 mb-1">Rate (%)</label>
//                   <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium shadow-sm" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-600 mb-1">Years</label>
//                   <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium shadow-sm" />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 pt-5 border-t border-slate-200">
//               <div className="flex justify-between items-end mb-2 text-xs font-semibold text-slate-500">
//                 <span>Interest</span>
//                 <span className="text-blue-600 font-bold">+₹{interest.toLocaleString('en-IN')}</span>
//               </div>
//               <div className="flex justify-between items-end pt-2">
//                 <span className="text-xs font-bold text-slate-700">Total to Pay</span>
//                 <span className="text-xl font-black text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* ================= FIXED LOWER INPUT PANEL FOOTER ================= */}
//       <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f5f6f8] via-[#f5f6f8] to-transparent z-20">
//         <div className="max-w-3xl mx-auto flex gap-3 items-center">
//           <form onSubmit={handleSendMessage} className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 flex gap-2 items-center focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-700/10 transition duration-300">
//             <input
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder={isListening ? "Listening... Speak clearly now" : "Ask your question or speak..."}
//               disabled={isLoading}
//               className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-900 placeholder-slate-400 font-medium text-sm disabled:cursor-not-allowed"
//             />
            
//             {/* INLINE MIC INPUT TRIGGER ICON COMPONENT */}
//             <button
//               type="button"
//               onClick={toggleVoiceInput}
//               className={`p-2.5 rounded-xl border transition active:scale-95 shrink-0 ${
//                 isListening 
//                   ? "bg-red-500 border-red-600 text-white animate-pulse shadow-md shadow-red-500/20" 
//                   : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
//               }`}
//               title={`Speak in ${language}`}
//             >
//               {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
//             </button>

//             <button 
//               type="submit"
//               disabled={isLoading || !inputValue.trim()}
//               className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-teal-400 font-bold px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5 text-sm shrink-0 shadow-sm active:scale-95 disabled:scale-100"
//             >
//               <Send className="w-4 h-4" /> Send
//             </button>
//           </form>
//         </div>
//       </div>

//     </div>
//   );
// }