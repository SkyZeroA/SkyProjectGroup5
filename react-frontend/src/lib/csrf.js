import axios from 'axios';

let csrfToken = null;

/**
 * Ensure a CSRF token is available and set it on axios defaults.
 * Caches the token for the session.
 * @param {string} apiUrl - base API URL (e.g. process.env.REACT_APP_API_URL)
 * @returns {Promise<string>} the CSRF token
 */
export async function ensureCsrfToken(apiUrl) {
  if (csrfToken) return csrfToken;
  try {
    const resp = await axios.get(`${apiUrl}/api/csrf-token`, { withCredentials: true });
    csrfToken = resp?.data?.csrf_token;
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
      axios.defaults.headers.common['X-CSRF-Token'] = csrfToken; // alternate header name
    }
    return csrfToken;
  } catch (err) {
    console.error('Failed to fetch CSRF token', err);
    throw err;
  }
}

export function setCsrfToken(token) {
  csrfToken = token;
  if (token) {
    axios.defaults.headers.common['X-CSRFToken'] = token;
    axios.defaults.headers.common['X-CSRF-Token'] = token;
  }
}

export function clearCsrfToken() {
  csrfToken = null;
  delete axios.defaults.headers.common['X-CSRFToken'];
  delete axios.defaults.headers.common['X-CSRF-Token'];
}
