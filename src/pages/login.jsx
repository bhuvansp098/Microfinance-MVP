import { useNavigate } from "react-router-dom";
export default function Login() {
const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌾</div>

          <h1 className="text-3xl font-bold text-green-600">
            GraamSeva
          </h1>

          <p className="text-slate-500 mt-2">
            Rural Financial Empowerment
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-xl p-3"
          />

         <button
  onClick={() => navigate("/dashboard")}
  className="w-full bg-green-600 text-white rounded-xl p-3"
>
  Continue
</button>

        </div>

      </div>

    </div>
  );
}