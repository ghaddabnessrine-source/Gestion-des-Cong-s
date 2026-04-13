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
  const [errors, setErrors] = useState({});

  function validateForm() {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = "Mot de passe est requis";
    } else if (formData.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = "Mot de passe doit contenir au moins 6 caractères";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmation du mot de passe est requise";
    } else if (formData.mot_de_passe !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

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
    setErrors({});

    if (!validateForm()) {
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
              {errors.email && <div className="text-danger">{errors.email}</div>}
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
              {errors.mot_de_passe && <div className="text-danger">{errors.mot_de_passe}</div>}
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
              {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
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