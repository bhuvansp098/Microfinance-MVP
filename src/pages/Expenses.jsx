export default function Expenses() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Expense Tracker 📊
        </h1>

        <p className="text-slate-500">
          Monitor your daily spending
        </p>
      </div>

      {/* Add Expense Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">

        <h2 className="font-semibold mb-4">
          Add Expense
        </h2>

        <div className="space-y-3">

          <input
            type="text"
            placeholder="Expense Name"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full border rounded-xl p-3"
          />

          <select className="w-full border rounded-xl p-3">
            <option>Food</option>
            <option>Travel</option>
            <option>Education</option>
            <option>Healthcare</option>
          </select>

          <button className="w-full bg-green-600 text-white rounded-xl p-3">
            Add Expense
          </button>

        </div>

      </div>

      {/* Expense Summary */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">

        <h2 className="font-semibold mb-4">
          Monthly Summary
        </h2>

        <div className="h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
          Expense Chart Placeholder
        </div>

      </div>

      {/* Recent Expenses */}
      <div>

        <h2 className="font-semibold mb-4">
          Recent Expenses
        </h2>

        <div className="space-y-3">

          <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
            <div>
              <p className="font-medium">
                Rice Purchase
              </p>
              <p className="text-sm text-slate-500">
                Food
              </p>
            </div>

            <p className="text-red-500 font-semibold">
              ₹500
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
            <div>
              <p className="font-medium">
                Bus Fare
              </p>
              <p className="text-sm text-slate-500">
                Travel
              </p>
            </div>

            <p className="text-red-500 font-semibold">
              ₹50
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}