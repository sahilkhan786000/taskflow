const BASE_URL = "http://localhost:8080";

export async function api(path, method = "GET", body = null) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,

    headers: {
      "Content-Type": "application/json",
      Authorization: token
        ? `Bearer ${token}`
        : "",
    },

    body: body
      ? JSON.stringify(body)
      : null,
  });

  if (res.status === 204)
    return null;

  return res.json();
}