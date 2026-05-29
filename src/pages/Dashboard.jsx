import { useNavigate } from "react-router-dom";
export default function Dashboard() {
     const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Hello Ashwin 👋
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
          ₹12,500
        </h1>

        <p className="text-green-100 mt-2">
          SHG Member • Rural Savings Group
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">
            Savings
          </p>

          <h2 className="text-2xl font-bold text-green-600">
            ₹8,000
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">
            Loan Due
          </p>

          <h2 className="text-2xl font-bold text-red-500">
            ₹2,000
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">
            Expenses
          </p>

          <h2 className="text-2xl font-bold text-orange-500">
            ₹1,200
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-slate-500 text-sm">
            Transactions
          </p>

          <h2 className="text-2xl font-bold text-blue-500">
            24
          </h2>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mb-6">

        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-3 gap-3">

<button
        onClick={() => navigate("/transactions")}
        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
>
               💸
   <p className="text-sm mt-2">
    Send
  </p>
</button>



<button
        onClick={() => navigate("/expenses")}
        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
>
            📊
<p className="text-sm mt-2">
             Expenses
</p> 
</button>



<button
            onClick={() => navigate("/assistant")}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
>
            🤖
  <p className="text-sm mt-2">
            AI Help
  </p>
</button>

        </div>

      </div>

      {/* Recent Activity */}
      <div>

        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        <div className="space-y-3">

          <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
            <div>
              <p className="font-medium">
                Sent to Ramu
              </p>
              <p className="text-sm text-slate-500">
                Today
              </p>
            </div>

            <p className="text-red-500 font-semibold">
              -₹500
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
            <div>
              <p className="font-medium">
                Savings Deposit
              </p>
              <p className="text-sm text-slate-500">
                Yesterday
              </p>
            </div>

            <p className="text-green-500 font-semibold">
              +₹1,000
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}