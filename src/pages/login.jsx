import { useState } from "react";
import { useNavigate } from "react-router-dom";
import farmImage from "../assets/farm-tractor.jpg";

export default function Login() {
  const navigate = useNavigate();

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

  const handleContinue = () => {
    if (!form.phone || !form.name) {
      alert("Please enter your phone number and full name.");
      return;
    }

    const currentUser = {
      phone: form.phone,
      name: form.name,
      savings: Number(form.savings) || 0,
      incomeSource: form.incomeSource,
      farmSize: form.incomeSource === "Farming" ? Number(form.farmSize) || 0 : null,
      district: form.district,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    navigate("/dashboard");
  };

  const showFarmSize = form.incomeSource === "Farming";

  const inputCls =
    "mt-1.5 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition";

  return (
    <div className="min-h-screen bg-[#fafaf7] relative overflow-hidden">
      {/* subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* NAV */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm">
            🌾
          </span>
          <span className="font-bold text-gray-900 tracking-tight">GraamSeva</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a className="hover:text-gray-900">Features</a>
          <a className="hover:text-gray-900">Solutions</a>
          <a className="hover:text-gray-900">Resources</a>
          <a className="hover:text-gray-900">Pricing</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-full transition">
            Open an Account
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — copy */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Rural Banking
          </span>

          <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-bold text-gray-900 tracking-tight">
            Sow Today,<br />
            Harvest <em className="italic font-normal">Tomorrow.</em>
          </h1>

          <p className="mt-6 text-gray-600 text-base max-w-md leading-relaxed">
            Empowering rural India with smarter savings, tools, and
            opportunities. It's free to start — no trial, no contract, no risk.
          </p>

          <div className="mt-10 hidden lg:block">
            <p className="text-xs text-gray-500 mb-4">
              Trusted by thousands of farmers across India
            </p>
            <div className="flex items-center gap-8 text-gray-400 text-sm font-medium">
              <span>NABARD</span>
              <span>•</span>
              <span>Kisan Credit</span>
              <span>•</span>
              <span>RuPay</span>
              <span>•</span>
              <span>UPI</span>
            </div>
          </div>
        </div>

        {/* RIGHT — form card */}
        <div className="relative">
          {/* floating image accent */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl hidden md:block rotate-3">
            <img src={farmImage} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-7 md:p-9 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  Welcome
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Enter your details to access your account
                </p>
              </div>
              <span className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                ✓
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  name="savings"
                  value={form.savings}
                  onChange={handleChange}
                  placeholder="e.g. 25,000"
                  min="0"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Source of Income
                </label>
                <select
                  name="incomeSource"
                  value={form.incomeSource}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select income source</option>
                  <option value="Farming">Farming</option>
                  <option value="Daily Wage Labour">Daily Wage Labour</option>
                  <option value="Dairy / Livestock">Dairy / Livestock</option>
                  <option value="Handicrafts / Textiles">Handicrafts / Textiles</option>
                  <option value="Small Business / Shop">Small Business / Shop</option>
                  <option value="Salaried Job">Salaried Job</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {showFarmSize && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Farm Size (acres)
                  </label>
                  <input
                    type="number"
                    name="farmSize"
                    value={form.farmSize}
                    onChange={handleChange}
                    placeholder="e.g. 2.5"
                    min="0"
                    step="0.1"
                    className={inputCls}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g. Mysuru"
                  className={inputCls}
                />
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full py-3.5 font-semibold shadow-lg shadow-green-500/25"
              >
                Open an Account →
              </button>

              <p className="text-center text-xs text-gray-400 pt-1">
                By continuing you agree to our terms & privacy policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
