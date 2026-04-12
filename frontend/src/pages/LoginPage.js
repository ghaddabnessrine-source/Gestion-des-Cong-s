import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
    role: "employe",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { response, data } = await loginUser(formData);

      if (!response.ok) {
        setMessage(data.message || "Erreur de connexion");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", formData.role);

      if (formData.role === "rh") {
        navigate("/dashboard-rh");
      } else {
        navigate("/dashboard-employe");
      }
    } catch (error) {
      setMessage("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card shadow auth-card">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Connexion</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rôle</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="employe">Employé</option>
                <option value="rh">RH</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {message && <p className="text-danger mt-3 mb-0">{message}</p>}

          <p className="text-center mt-3 mb-0">
            Pas de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;