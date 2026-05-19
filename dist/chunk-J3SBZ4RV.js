import createClient from 'openapi-fetch';

// src/api/client.ts
var RES_API_BASE_URL = "https://res.zeroo.ch";
function createResApiClient(options = {}) {
  const { baseUrl = RES_API_BASE_URL, token, bearerToken, fetch } = options;
  const headers = {
    // Opt in to the corrected error contract — see project_RES openapi.json.
    "X-RES-API-Version": "2"
  };
  if (token) {
    headers.token = token;
  }
  if (bearerToken) {
    headers.Authorization = bearerToken.startsWith("Bearer ") ? bearerToken : `Bearer ${bearerToken}`;
  }
  return createClient({
    baseUrl,
    headers,
    ...fetch ? { fetch } : {}
  });
}

export { RES_API_BASE_URL, createResApiClient };
