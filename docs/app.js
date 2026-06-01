(function () {
  const config = window.LA_CINETHEQUE_CONFIG || {};
  const serverUrl = normalizeBaseUrl(config.serverUrl || "");
  const statusEndpoint = config.statusEndpoint || "/api/public/status";
  const timeoutMs = Number(config.statusTimeoutMs || 5000);
  const refreshEveryMs = Number(config.refreshEveryMs || 30000);

  const statusBox = document.getElementById("statusBox");
  const statusTitle = document.getElementById("statusTitle");
  const statusText = document.getElementById("statusText");
  const accessButton = document.getElementById("accessButton");
  const refreshButton = document.getElementById("refreshButton");

  function normalizeBaseUrl(value) {
    return String(value || "").replace(/\/+$/, "");
  }

  function setState(state, title, text) {
    statusBox.className = `status-box status-${state}`;
    statusTitle.textContent = title;
    statusText.textContent = text;
  }

  function setAccessEnabled(enabled) {
    if (!accessButton) return;
    if (enabled && serverUrl) {
      accessButton.href = serverUrl;
      accessButton.classList.remove("disabled");
      accessButton.setAttribute("aria-disabled", "false");
    } else {
      accessButton.href = "#";
      accessButton.classList.add("disabled");
      accessButton.setAttribute("aria-disabled", "true");
    }
  }

  async function checkStatus() {
    if (!serverUrl) {
      setAccessEnabled(false);
      setState("offline", "Configuration manquante", "L’URL publique du serveur n’est pas encore configurée.");
      return;
    }

    setAccessEnabled(false);
    setState("checking", "Vérification en cours…", "On vérifie si le serveur personnel est disponible.");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${serverUrl}${statusEndpoint}`, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });

      if (!response.ok) throw new Error("status-not-ok");
      const data = await response.json().catch(() => ({}));
      if (data.online !== true) throw new Error("offline");

      setAccessEnabled(true);
      setState("online", "La Cinéthèque est en ligne", "Tu peux accéder au catalogue privé.");
    } catch {
      setAccessEnabled(false);
      setState("offline", "La Cinéthèque est hors ligne", "Le serveur personnel est probablement éteint ou en maintenance. Réessaie plus tard.");
    } finally {
      clearTimeout(timer);
    }
  }

  accessButton?.addEventListener("click", event => {
    if (accessButton.classList.contains("disabled")) event.preventDefault();
  });

  refreshButton?.addEventListener("click", checkStatus);
  checkStatus();
  if (refreshEveryMs > 0) window.setInterval(checkStatus, refreshEveryMs);
})();
