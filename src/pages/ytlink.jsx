import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wheat, Play, Award, ShieldAlert, Users, Landmark } from "lucide-react";

import farmImage from "../assets/farm-tractor.jpg";

export default function YtLink() {
  const navigate = useNavigate();

  // Curated educational video directory array targeted at rural financial clarity
  const localizedVideos = [
    {
      id: "1",
      title: "Understanding Bank Accounts & ATM Safety 🏦",
      desc: "Learn how to operate savings accounts, earn deposit interest, and keep your ATM PIN safe from scams.",
      duration: "5 mins",
      language: "English",
      icon: <Landmark className="w-5 h-5 text-blue-600" />,
      url: "https://youtu.be/O4-MtfawzAY?si=A9FLa89ZU4uwHkDR" // Replace with real educational links
    },
    {
      id: "2",
      title: "How Self-Help Group (SHG) Loans Work 👥",
      desc: "A complete walkthrough on how village women clusters can save money collectively and unlock group loans.",
      duration: "20 mins",
      language: "English",
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      url: "https://youtu.be/Lws1lNhEYpU?si=HV2dI0aIX5yMT8w7"
    },
    {
      id: "3",
      title: "PM-KISAN & Crop Insurance Scheme Rules 🌾",
      desc: "Step-by-step guide to verifying your structural DBT financial status and applying for weather crop claims.",
      duration: "5 mins",
      language: "Kannada",
      icon: <Award className="w-5 h-5 text-amber-600" />,
      url: "https://youtu.be/ldUJysCFLm8?si=2MupMwl6DriefVVw"
    },
    {
      id: "4",
      title: "How to Avoid Online OTP & Lottery Frauds ⚠️",
      desc: "Crucial mobile safety video protecting your hard-earned digital savings from fake calls and lottery SMS traps.",
      duration: "6 mins",
      language: "Kannada",
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      url: "https://youtu.be/Ip_HS0qiFew?si=ljAr-TPQgNyJjtZD"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] relative overflow-hidden font-sans text-slate-800 pb-16">
      
      {/* BACKGROUND THEME ENGINE */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${farmImage})` }}
      />
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Top Header Navigation bar wrapper */}
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

      {/* Content Interface Workspace */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-10">
        
        <div className="mb-8">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-md">
            Gyaan Se Pragati 💡
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Financial Literacy Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Simple video lessons to safeguard and grow your family savings securely.</p>
        </div>

        {/* Video Card Matrix Grid layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {localizedVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {video.icon}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span> {video.duration}</span>
                    <span>•</span>
                    <span className="text-blue-600">{video.language}</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 text-base leading-snug">{video.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{video.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center">
                <button
                  onClick={() => window.open(video.url, "_blank")}
                  className="w-full bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 group"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-red-500 group-hover:scale-110 transition" />
                  Watch Lesson Video
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}