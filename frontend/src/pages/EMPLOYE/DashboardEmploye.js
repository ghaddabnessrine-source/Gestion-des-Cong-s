import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SidebarEmploye from "../../components/SidebarEmploye";
import SmallBox from "../../components/SmallBox";
import { getMesConges } from "../../services/congeService";

function normalizeStatut(statut) {
  return String(statut || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function StatutBadge({ statut }) {
  const s = normalizeStatut(statut);
  const badgeClass =
    s === "approuvee" || s === "approuve"
      ? "bg-success"
      : s === "refusee" || s === "refuse"
        ? "bg-danger"
        : s === "annulee" || s === "annule"
          ? "bg-secondary"
          : "bg-warning text-dark"; // en_attente or unknown

  return <span className={`badge ${badgeClass}`}>{statut || "-"}</span>;
}

function DashboardEmploye() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { response, data } = await getMesConges();

        if (!response.ok) {
          setMessage(data.message || "Erreur lors du chargement");
          return;
        }

        setDemandes(Array.isArray(data) ? data : []);
      } catch (error) {
        setMessage("Impossible de charger les congés");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const counts = {
    total: demandes.length,
    approuvees: demandes.filter((d) => {
      const s = normalizeStatut(d.statut);
      return s === "approuvee" || s === "approuve";
    }).length,
    enAttente: demandes.filter((d) => normalizeStatut(d.statut) === "en_attente" || normalizeStatut(d.statut) === "enattente")
      .length,
    refusees: demandes.filter((d) => {
      const s = normalizeStatut(d.statut);
      return s === "refusee" || s === "refuse";
    }).length,
  };

  const total = demandes.length;
  const approuvees = counts.approuvees;
  const enAttente = counts.enAttente;
  const refusees = counts.refusees;

  return (
    <div>
      <Navbar />

      <div className="d-flex">
        <SidebarEmploye />

        <div className="flex-grow-1 p-4 bg-light min-page">
          <h2 className="mb-4">Dashboard Employé</h2>

          <div className="row g-3 mb-4">
            <SmallBox title="Demandes" value={total} className="bg-primary" />
            <SmallBox title="Approuvées" value={approuvees} className="bg-success" />
            <SmallBox title="En attente" value={enAttente} className="bg-warning" />
            <SmallBox title="Refusées" value={refusees} className="bg-danger" />
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Mes congés</h5>
            </div>

            <div className="card-body">
              {loading ? (
                <p>Chargement...</p>
              ) : message ? (
                <p className="text-danger">{message}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Motif</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            Aucune demande trouvée
                          </td>
                        </tr>
                      ) : (
                        demandes.map((item) => (
                          <tr key={item.id}>
                            <td>{item.type_conge || item.type_conge_id || "-"}</td>
                            <td>{item.date_debut}</td>
                            <td>{item.date_fin}</td>
                            <td>{item.motif || "-"}</td>
                            <td>
                              <StatutBadge statut={item.statut} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEmploye;

