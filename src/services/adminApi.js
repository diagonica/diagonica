const API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.rjrinfinity.com/api";


export async function adminRequest(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("griphill_admin_token");

  const headers = {
    ...(options.body &&
    typeof options.body === "string"
      ? {
          "Content-Type": "application/json",
        }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data =
    await response
      .json()
      .catch(() => ({}));


  /*
   * ADMIN SESSION EXPIRED
   */
  if (response.status === 401) {
    localStorage.removeItem(
      "griphill_admin_token"
    );

    window.location.href =
      "/admin/login";

    throw new Error(
      data?.error ||
      data?.message ||
      "Admin session expired."
    );
  }


  /*
   * OTHER API ERRORS
   *
   * Backend may return either:
   * {
   *   error: "..."
   * }
   *
   * or:
   *
   * {
   *   message: "..."
   * }
   */
  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      "Admin request failed."
    );
  }


  return data;
}