import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">Gestion des congés</span>

        <div className="ms-auto d-flex align-items-center gap-3 text-white">
          <span>{role === "rh" ? "RH" : "Employé"}</span>
          <span>{email}</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;