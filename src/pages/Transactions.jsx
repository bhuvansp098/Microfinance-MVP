export default function Transactions() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <h1 className="text-3xl font-bold mb-2">
        Send Money 💸
      </h1>

      <p className="text-slate-500 mb-6">
        Secure transfers within your SHG community
      </p>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Recipient Name"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full border rounded-xl p-3"
          />

          <button className="w-full bg-green-600 text-white rounded-xl p-3">
            Send Money
          </button>

        </div>

      </div>

      <h2 className="font-semibold mb-4">
        Recent Transactions
      </h2>

      <div className="space-y-3">

        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
          <span>Ramu</span>
          <span className="text-red-500">-₹500</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
          <span>SHG Deposit</span>
          <span className="text-green-500">+₹1000</span>
        </div>

      </div>

    </div>
  );
}