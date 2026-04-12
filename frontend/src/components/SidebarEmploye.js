import { Link } from "react-router-dom";

function SidebarEmploye() {
  return (
    <div className="bg-white border-end p-3 sidebar-box">
      <h5 className="mb-4">Menu Employé</h5>

      <div className="d-grid gap-2">
        <Link to="/dashboard-employe" className="btn btn-outline-primary">
          Dashboard
        </Link>
        <Link to="/demande-conge" className="btn btn-outline-primary">
          Demande de congé
        </Link>
      </div>
    </div>
  );
}

export default SidebarEmploye;

