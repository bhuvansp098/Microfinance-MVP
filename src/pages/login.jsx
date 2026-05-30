import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Wheat,
  User,
  Wallet,
  Briefcase,
  Tractor,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import farmImage from "../assets/farm-tractor.jpg";

export default function Login() {
  const navigate = useNavigate();

  // Mode state switcher: 'signup' mode shows the full form, 'signin' mode only shows the phone field
  const [authMode, setAuthMode] = useState("signup");

  const [form, setForm] = useState({
    phone: "",
    name: "",
    savings: "",
    incomeSource: "",
    farmSize: "",
    district: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===================== CORE AUTH LAYER PROCESSORS =====================
  
  // ACTION A: SIGN UP HANDLER (Registers a Brand New User Account)
  const handleSignUp = () => {
    if (!form.phone.trim() || !form.name.trim()) {
      alert("Please enter your phone number and full name to create an account.");
      return;
    }

    const newUserProfile = {
      phone: form.phone.trim(),
      name: form.name.trim(),
      savings: Number(form.savings) || 0,
      incomeSource: form.incomeSource,
      farmSize: form.incomeSource === "Farming" ? Number(form.farmSize) || 0 : null,
      district: form.district.trim(),
    };

    // 1. Load existing absolute users directory map or initialize a fresh one
    const existingUsers = JSON.parse(localStorage.getItem("global_users_registry") || "{}");
    
    // 2. Save this user into the master directory mapping registry using their phone number as the unique primary key
    existingUsers[newUserProfile.phone] = newUserProfile;
    localStorage.setItem("global_users_registry", JSON.stringify(existingUsers));

    // 3. Set this user profile token as the current active session state
    localStorage.setItem("userProfile", JSON.stringify(newUserProfile));
    
    navigate("/dashboard");
  };

  // ACTION B: SIGN IN HANDLER (Logs in an Existing Returning User via Phone Match)
  const handleSignIn = () => {
    const inputPhone = form.phone.trim();
    if (!inputPhone) {
      alert("Please enter your registered phone number to sign in.");
      return;
    }

    // 1. Pull up the master global user storage directory mapping table
    const existingUsers = JSON.parse(localStorage.getItem("global_users_registry") || "{}");

    // 2. Scan looking for a matching phone key sequence inside our record set
    if (existingUsers[inputPhone]) {
      const matchedUserProfile = existingUsers[inputPhone];
      
      // 3. Set the matched data block as the active tracking token session
      localStorage.setItem("userProfile", JSON.stringify(matchedUserProfile));
      
      // Mark seen state as true so their old dashboard state arrays hydrate cleanly
      localStorage.setItem(`seenUser_${inputPhone}`, "true");
      
      navigate("/dashboard");
    } else {
      alert("❌ This phone number is not registered yet. Please click 'Create an Account' to sign up first!");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (authMode === "signup") {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  const showFarmSize = authMode === "signup" && form.incomeSource === "Farming";

  const inputCls =
    "w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-700/10 transition";

  return (
    <div className="min-h-screen bg-[#f5f6f8] relative overflow-hidden">
      
      {/* Background Image Layer (80% Opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.8] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${farmImage})` }}
      />

      {/* Grid Pattern overlay layer */}
      <div
        className="absolute inset-0 opacity-[0] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-blue-700/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[380px] h-[380px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Top Nav Row */}
      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Wheat className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            GraamSeva
          </span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-slate-600">
          <a className="hover:text-slate-900 cursor-pointer">Features</a>
          <a className="hover:text-slate-900 cursor-pointer">Solutions</a>
          <a className="hover:text-slate-900 cursor-pointer">Support</a>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setAuthMode("signin")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition ${authMode === 'signin' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setAuthMode("signup")}
            className={`px-4 py-2 text-sm font-semibold rounded-full border transition ${authMode === 'signup' ? 'bg-blue-700 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            Open an Account
          </button>
        </div>
      </nav>

      {/* Main Container Body Segment */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-20 grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Copy Block */}
        <div className="pt-6 lg:col-span-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black text-xs font-medium border border-black/10">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            
          </span>
          <h1 className="mt-5 pl-5 text-4xl sm:text-5xl font-bold text-black leading-[1.1] tracking-tight">
          Financial Tools <br /> to <span className="italic">Grow.</span>
            <br /> 
          </h1>
          
          {/* ULTRA TRANSLUCENT background wrapper panel */}
          <div className="mt-10 p-8 bg-white/15 backdrop-blur-[2px] rounded-2xl border border-white/10 shadow-md max-w-xl animate-fadeIn">
            {/* Description */}
            <p className="text-slate-900 leading-relaxed font-bold">
              Personalized savings, credit, expense tracking & loan options built for you.
            </p>

            {/* Trust & Security Points */}
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-900 font-bold pt-5 border-t border-slate-900/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black" />
                Trusted by 50k+ users
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black" />
                Bank-grade security
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Submission Form Card Block */}
        <div className="relative lg:col-span-6">
          <div className="absolute -inset-2 bg-blue-700/5 rounded-3xl rotate-1" />
          <form
            onSubmit={handleFormSubmit}
            className="relative bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-20px_rgba(29,78,216,0.25)] p-7 animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500">
                  {authMode === "signup" ? "Step 01 / Get Started" : "Welcome Back"}
                </p>
                <h2 className="text-xl font-semibold text-slate-900 mt-1">
                  {authMode === "signup" ? "Create your profile" : "Sign in to your account"}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-700 border border-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Input fields render dynamically depending on current state selector mode toggles */}
            <div className="space-y-4">
              
              {/* Phone Input field (Universal across all access modes) */}
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className={inputCls}
                />
              </div>

              {/* These additional setup components only appear if they are in standard Sign-Up mode */}
              {authMode === "signup" && (
                <>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className={inputCls}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Wallet className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="savings"
                        value={form.savings}
                        onChange={handleChange}
                        placeholder="Initial savings (₹)"
                        className={inputCls}
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        name="incomeSource"
                        value={form.incomeSource}
                        onChange={handleChange}
                        className={inputCls + " appearance-none"}
                      >
                        <option value="">Income source</option>
                        <option value="Farming">Farming</option>
                        <option value="Salary">Salary</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {showFarmSize && (
                    <div className="relative">
                      <Tractor className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="farmSize"
                        value={form.farmSize}
                        onChange={handleChange}
                        placeholder="Farm size (acres)"
                        className={inputCls}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      placeholder="District"
                      className={inputCls}
                    />
                  </div>
                </>
              )}

            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-700 border border-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2 group shadow-md shadow-blue-700/10 active:scale-[0.99]"
            >
              {authMode === "signup" ? "Create Account & Continue" : "Verify Phone & Sign In"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Bottom Form Toggler Utilities */}
            <div className="mt-5 text-center text-xs">
              {authMode === "signup" ? (
                <p className="text-slate-500">
                  Already have an account?{" "}
                  <span onClick={() => setAuthMode("signin")} className="text-blue-700 font-bold hover:underline cursor-pointer">
                    Sign In here
                  </span>
                </p>
              ) : (
                <p className="text-slate-500">
                  New to GraamSeva?{" "}
                  <span onClick={() => setAuthMode("signup")} className="text-blue-700 font-bold hover:underline cursor-pointer">
                    Create an Account
                  </span>
                </p>
              )}
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              By continuing you agree to our terms & privacy policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}