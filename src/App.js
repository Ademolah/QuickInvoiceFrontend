
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Landing from "./pages/Landing";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetails from "./pages/InvoiceDetails";
import NewInvoice from "./pages/NewInvoice";
import Settings from "./pages/Settings";
import Client from "./pages/Client";
import Support from "./pages/Support";
import Receipts from "./pages/Receipts";
import ReceiptDetails from "./pages/ReceiptDetails";
import Billing from "./pages/Billing";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/invoices" element={<ProtectedRoute> <InvoiceList /> </ProtectedRoute>}/>
          <Route path="/invoices/:id" element={<ProtectedRoute> <InvoiceDetails /> </ProtectedRoute>}/>
          <Route path="/invoices/new" element={<ProtectedRoute> <NewInvoice /> </ProtectedRoute>}/>
          <Route path="/settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>}/>
          <Route path="/billing" element={<ProtectedRoute> <Billing /> </ProtectedRoute>}/>
          <Route path="/clients" element={<ProtectedRoute> <Client /> </ProtectedRoute>}/>
          <Route path="/support" element={<ProtectedRoute> <Support /> </ProtectedRoute>}/>
          <Route path="/receipts" element={ <ProtectedRoute> <Receipts /> </ProtectedRoute>} />
          <Route path="/receipts/:invoiceId" element={ <ProtectedRoute> <ReceiptDetails /> </ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


