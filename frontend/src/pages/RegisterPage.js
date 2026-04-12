import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
    role: "employe",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (formData.mot_de_passe !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const { response, data } = await registerUser(formData);

      if (!response.ok) {
        setMessage(data.message || "Erreur d'inscription");
        return;
      }

      setSuccess("Inscription réussie");
      setTimeout(() => {
        navigate("/");
      }, 1000);
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
          <h2 className="text-center mb-4">Inscription</h2>

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
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
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

            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          {message && <p className="text-danger mt-3 mb-0">{message}</p>}
          {success && <p className="text-success mt-3 mb-0">{success}</p>}

          <p className="text-center mt-3 mb-0">
            Déjà un compte ? <Link to="/">Connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;