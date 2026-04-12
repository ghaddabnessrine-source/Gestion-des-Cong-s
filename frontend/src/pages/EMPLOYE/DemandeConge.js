import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SidebarEmploye from "../../components/SidebarEmploye";
import { createConge, getTousLesTypesConges } from "../../services/congeService";

function DemandeConge() {
  const [typesConges, setTypesConges] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [type_conge_id, setTypeCongeId] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");
  const [motif, setMotif] = useState("");

  useEffect(() => {
    async function fetchTypes() {
      try {
        setTypesLoading(true);
        const { response, data } = await getTousLesTypesConges();
        if (response.ok && Array.isArray(data)) {
          setTypesConges(data);
          if (data[0]?.id && !type_conge_id) setTypeCongeId(String(data[0].id));
        }
      } finally {
        setTypesLoading(false);
      }
    }

    fetchTypes();
  }, []);

  const selectedType = typesConges.find((t) => String(t.id) === String(type_conge_id));
  const today = new Date().toISOString().split("T")[0];

  function getNbJoursInclusifs(start, end) {
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    const diffMs = endDate - startDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormMessage("");
    setFormSuccess("");

    if (!type_conge_id) {
      setFormMessage("Veuillez choisir un type de congé");
      return;
    }
    if (!date_debut || !date_fin) {
      setFormMessage("Veuillez remplir les dates");
      return;
    }
    if (date_debut < today) {
      setFormMessage("La date de début ne peut pas être dans le passé");
      return;
    }
    if (date_fin < date_debut) {
      setFormMessage("La date de fin doit être après la date de début");
      return;
    }

    const nbJours = getNbJoursInclusifs(date_debut, date_fin);
    const joursAutorises = Number(selectedType?.jours_par_defaut ?? 0);
    if (joursAutorises > 0 && nbJours > joursAutorises) {
      setFormMessage(
        `Vous avez demandé ${nbJours} jours, mais ce type autorise ${joursAutorises} jours maximum`
      );
      return;
    }

    setFormLoading(true);
    try {
      const { response, data } = await createConge({
        type_conge_id: Number(type_conge_id),
        date_debut,
        date_fin,
        motif,
      });

      if (!response.ok) {
        setFormMessage(data.message || "Erreur lors de la création");
        return;
      }

      setFormSuccess("Demande envoyée avec succès");
      setMotif("");
      setDateDebut("");
      setDateFin("");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <SidebarEmploye />

        <div className="flex-grow-1 p-4 bg-light min-page">
          <h2 className="mb-4">Nouvelle demande de congé</h2>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Formulaire</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Type de congé</label>
                  <select
                    className="form-select"
                    value={type_conge_id}
                    onChange={(e) => setTypeCongeId(e.target.value)}
                  >
                    {typesLoading ? (
                      <option value="">Chargement...</option>
                    ) : typesConges.length === 0 ? (
                      <option value="" disabled>
                        Aucun type disponible
                      </option>
                    ) : (
                      typesConges.map((t) => (
                        <option key={t.id} value={String(t.id)}>
                          {t.nom} ({t.jours_par_defaut} jours)
                        </option>
                      ))
                    )}
                  </select>
                  {selectedType?.id ? (
                    <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                      Ce type de congé donne <b>{selectedType.jours_par_defaut}</b> jours par défaut.
                    </div>
                  ) : null}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Date début</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date_debut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      min={today}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date fin</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date_fin}
                      onChange={(e) => setDateFin(e.target.value)}
                      min={date_debut || today}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Motif</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    placeholder="Ex: vacances, rendez-vous, ... (optionnel)"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? "Envoi..." : "Envoyer la demande"}
                </button>

                {formMessage && <p className="text-danger mt-2 mb-0">{formMessage}</p>}
                {formSuccess && <p className="text-success mt-2 mb-0">{formSuccess}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemandeConge;

