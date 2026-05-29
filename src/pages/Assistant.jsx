export default function Assistant() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <h1 className="text-3xl font-bold mb-2">
        AI Financial Assistant 🤖
      </h1>

      <p className="text-slate-500 mb-6">
        Ask questions in English, Hindi, Kannada or Tamil
      </p>

      <div className="space-y-4">

        <div className="bg-green-100 p-4 rounded-2xl ml-10">
          EMI kya hota hai?
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mr-10">
          EMI means Equated Monthly Installment. It is the fixed amount you pay every month to repay a loan.
        </div>

      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-3 flex gap-3">
          <input
            type="text"
            placeholder="Ask your question..."
            className="flex-1 outline-none"
          />

          <button className="bg-green-600 text-white px-5 py-2 rounded-xl">
            Send
          </button>
        </div>
      </div>

    </div>
  );
}