import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Expenses from "./pages/Expenses";
import Transactions from "./pages/Transactions";
import IncomeIdeas from "./pages/IncomeIdeas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/income-ideas" element={<IncomeIdeas />} />
    </Routes>
  );
}

export default App;