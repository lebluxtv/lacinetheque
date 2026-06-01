// Configuration publique de la porte d'entrée GitHub Pages.
// Ne mets jamais de mot de passe, token, clé API ou IP locale ici.
window.LA_CINETHEQUE_CONFIG = {
  serviceName: "La Cinéthèque",
  // URL publique future derrière DuckDNS + Caddy.
  // Exemple : "https://lacinetheque-leblux.duckdns.org"
  serverUrl: "https://lacinetheque-leblux.duckdns.org",
  statusEndpoint: "/api/public/status",
  statusTimeoutMs: 5000,
  refreshEveryMs: 30000
};
