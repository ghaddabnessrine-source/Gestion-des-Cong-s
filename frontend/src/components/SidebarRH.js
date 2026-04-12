import { Link } from "react-router-dom";

function SidebarRH() {
  return (
    <div className="bg-white border-end p-3 sidebar-box">
      <h5 className="mb-4">Menu RH</h5>

      <div className="d-grid gap-2">
        <Link to="/dashboard-rh" className="btn btn-outline-primary">
          Dashboard RH
        </Link>
      </div>
    </div>
  );
}

export default SidebarRH;

