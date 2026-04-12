const API_URL = "http://localhost:3000";

export async function loginUser(formData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
    }),
  });

  const data = await response.json();
  return { response, data };
}

export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
      role: formData.role,
    }),
  });

  const data = await response.json();
  return { response, data };
}

