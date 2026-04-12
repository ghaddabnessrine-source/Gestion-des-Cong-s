import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SidebarRH from "../../components/SidebarRH";
import SmallBox from "../../components/SmallBox";
import {
  getToutesLesDemandes,
  updateCongeStatut,
} from "../../services/congeService";

function normalizeStatut(statut) {
  return String(statut || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
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
          : "bg-warning text-dark"; 

  return <span className={`badge ${badgeClass}`}>{statut || "-"}</span>;
}

function DashboardRH() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [refusalComments, setRefusalComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const { response, data } = await getToutesLesDemandes();

        if (!response.ok) {
          setMessage(data.message || "Erreur lors du chargement");
          return;
        }

        setDemandes(Array.isArray(data) ? data : []);
      } catch (error) {
        setMessage("Impossible de charger les demandes");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const total = demandes.length;
  const approuvees = demandes.filter((d) => {
    const s = normalizeStatut(d.statut);
    return s === "approuvee" || s === "approuve";
  }).length;
  const enAttente = demandes.filter((d) => {
    const s = normalizeStatut(d.statut);
    return s === "en_attente" || s === "enattente";
  }).length;
  const refusees = demandes.filter((d) => {
    const s = normalizeStatut(d.statut);
    return s === "refusee" || s === "refuse";
  }).length;

  async function reload() {
    const { response, data } = await getToutesLesDemandes();
    if (response.ok) setDemandes(Array.isArray(data) ? data : []);
  }

  async function handleApprove(congeId) {
    setActionLoading((m) => ({ ...m, [congeId]: true }));
    try {
      const { response } = await updateCongeStatut({
        id: congeId,
        statut: "approuvee",
        commentaire_refus: null,
      });
      if (!response.ok) return;
      await reload();
    } finally {
      setActionLoading((m) => ({ ...m, [congeId]: false }));
    }
  }

  async function handleRefuse(congeId) {
    const commentaire = refusalComments[congeId] || "";
    setActionLoading((m) => ({ ...m, [congeId]: true }));
    try {
      const { response } = await updateCongeStatut({
        id: congeId,
        statut: "refusee",
        commentaire_refus: commentaire,
      });
      if (!response.ok) return;
      await reload();
    } finally {
      setActionLoading((m) => ({ ...m, [congeId]: false }));
    }
  }

  return (
    <div>
      <Navbar />

      <div className="d-flex">
        <SidebarRH />

        <div className="flex-grow-1 p-4 bg-light min-page">
          <h2 className="mb-4">Dashboard RH</h2>

          <div className="row g-3 mb-4">
            <SmallBox title="Demandes totales" value={total} className="bg-primary" />
            <SmallBox title="Approuvées" value={approuvees} className="bg-success" />
            <SmallBox title="En attente" value={enAttente} className="bg-warning" />
            <SmallBox title="Refusées" value={refusees} className="bg-danger" />
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Toutes les demandes</h5>
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
                        <th>Employé</th>
                        <th>Type</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandes.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Aucune demande trouvée
                          </td>
                        </tr>
                      ) : (
                        demandes.map((item) => (
                          <tr key={item.id}>
                            <td>{item.employe_nom || item.id_demandeur || "-"}</td>
                            <td>{item.type_conge || item.type_conge_id || "-"}</td>
                            <td>{item.date_debut || "-"}</td>
                            <td>{item.date_fin || "-"}</td>
                            <td>
                              <StatutBadge statut={item.statut} />
                            </td>
                            <td style={{ minWidth: 260 }}>
                              {normalizeStatut(item.statut) === "en_attente" ||
                              normalizeStatut(item.statut) === "enattente" ? (
                                <div className="d-flex flex-column gap-2">
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-success btn-sm flex-grow-1"
                                      disabled={!!actionLoading[item.id]}
                                      onClick={() => handleApprove(item.id)}
                                    >
                                      {actionLoading[item.id] ? "..." : "Approuver"}
                                    </button>
                                  </div>

                                  <input
                                    className="form-control form-control-sm"
                                    placeholder="Commentaire (refus)"
                                    value={refusalComments[item.id] || ""}
                                    onChange={(e) =>
                                      setRefusalComments((m) => ({
                                        ...m,
                                        [item.id]: e.target.value,
                                      }))
                                    }
                                    disabled={!!actionLoading[item.id]}
                                  />

                                  <button
                                    className="btn btn-danger btn-sm"
                                    disabled={!!actionLoading[item.id]}
                                    onClick={() => handleRefuse(item.id)}
                                  >
                                    Refuser
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted">Traité</span>
                              )}
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

export default DashboardRH;

