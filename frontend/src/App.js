import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardEmploye from "./pages/EMPLOYE/DashboardEmploye";
import DemandeConge from "./pages/EMPLOYE/DemandeConge";
import DashboardRH from "./pages/RH/DashboardRH";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard-employe"
        element={
          <ProtectedRoute roleAutorise="employe">
            <DashboardEmploye />
          </ProtectedRoute>
        }
      />
      <Route
        path="/demande-conge"
        element={
          <ProtectedRoute roleAutorise="employe">
            <DemandeConge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard-rh"
        element={
          <ProtectedRoute roleAutorise="rh">
            <DashboardRH />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;