const API_URL = "http://localhost:3000";

function decodeJwtEmail(token) {
  try {
    const payloadPart = token?.split(".")?.[1];
    if (!payloadPart) return null;

    // JWT uses base64url: replace chars and pad for atob
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const json = atob(padded);
    const payload = JSON.parse(json);
    return payload?.email || null;
  } catch {
    return null;
  }
}

async function getUserIdFromToken() {
  const cachedUserId = localStorage.getItem("userId");
  if (cachedUserId) return Number(cachedUserId);

  const token = localStorage.getItem("token");
  const email = decodeJwtEmail(token);
  if (!email) return null;

  // Backend exposes a "get all users" endpoint; we'll filter locally.
  const res = await fetch(`${API_URL}/users/user`);
  if (!res.ok) return null;

  const users = await res.json();
  const found = Array.isArray(users)
    ? users.find((u) => String(u.email).toLowerCase() === String(email).toLowerCase())
    : null;

  if (!found?.id) return null;
  localStorage.setItem("userId", String(found.id));
  return Number(found.id);
}

export async function getMesConges() {
  // Backend doesn't expose a dedicated "/me" endpoint in this project.
  // We fetch all conges, then filter by id_demandeur when we can infer userId.
  const { response, data } = await getToutesLesDemandes();
  if (!response.ok) return { response, data };

  const userId = await getUserIdFromToken();
  if (!userId) return { response, data: [] };

  const filtered = Array.isArray(data) ? data.filter((c) => Number(c.id_demandeur) === userId) : [];
  return { response, data: filtered };
}

export async function getToutesLesDemandes() {
  // Backend exposes GET /conges/conge
  const response = await fetch(`${API_URL}/conges/conge`);
  const data = await response.json();
  return { response, data };
}

export async function getTousLesTypesConges() {
  const response = await fetch(`${API_URL}/type-conges/typeconge`);
  const data = await response.json();
  return { response, data: Array.isArray(data) ? data : [] };
}

function generateCongeIdFromCurrentOnes(existingConges) {
  const maxId = Array.isArray(existingConges)
    ? existingConges.reduce((acc, c) => Math.max(acc, Number(c.id) || 0), 0)
    : 0;
  const randomBump = Math.floor(Math.random() * 1000);
  return maxId + 1 + randomBump;
}

export async function createConge({ type_conge_id, date_debut, date_fin, motif }) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return { response: { ok: false }, data: { message: "Utilisateur introuvable (token non lié à la DB)" } };
  }

  const { data: existingConges } = await getToutesLesDemandes();
  const id = generateCongeIdFromCurrentOnes(existingConges);

  const response = await fetch(`${API_URL}/conges/conge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      id_demandeur: userId,
      type_conge_id,
      date_debut,
      date_fin,
      statut: "en_attente",
    }),
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export async function updateCongeStatut({ id, statut, commentaire_refus }) {
  const response = await fetch(`${API_URL}/conges/conge/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type_conge_id: null,
      date_debut: null,
      date_fin: null,
      statut,
    }),
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export async function createTypeConge({ nom, jours_par_defaut }) {
  const { response: listResp, data: existingTypes } = await getTousLesTypesConges();
  if (!listResp.ok) {
    return { response: listResp, data: { message: "Impossible de charger les types" } };
  }

  const maxId = Array.isArray(existingTypes)
    ? existingTypes.reduce((acc, t) => Math.max(acc, Number(t.id) || 0), 0)
    : 0;
  const id = maxId + 1;

  const response = await fetch(`${API_URL}/type-conges/typeconge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      nom,
      jours_par_defaut: Number(jours_par_defaut) || 0,
    }),
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

