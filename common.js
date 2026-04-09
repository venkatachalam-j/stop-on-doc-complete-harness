(function () {
  const startedAt = performance.now();

  function formatMs(ms) {
    return ms.toFixed(1).padStart(7, " ");
  }

  function timelineNode() {
    return document.getElementById("timeline");
  }

  function writeLine(message) {
    const node = timelineNode();
    if (!node) {
      return;
    }

    const elapsed = performance.now() - startedAt;
    node.textContent += `[+${formatMs(elapsed)} ms] ${message}\n`;
  }

  function bindLifecycleLogs() {
    document.addEventListener("DOMContentLoaded", function () {
      writeLine("DOMContentLoaded fired");
    });

    window.addEventListener("load", function () {
      writeLine("window.load fired");
    });

    window.addEventListener("beforeunload", function () {
      writeLine("beforeunload fired");
    });

    document.addEventListener("visibilitychange", function () {
      writeLine(`visibilitychange -> ${document.visibilityState}`);
    });
  }

  async function timedFetch(label, url) {
    writeLine(`fetch start: ${label} -> ${url}`);
    const started = performance.now();

    try {
      const response = await fetch(url, { cache: "no-store" });
      await response.text();
      const duration = performance.now() - started;
      writeLine(`fetch done: ${label} status=${response.status} duration=${duration.toFixed(1)} ms`);
      return response;
    } catch (error) {
      const duration = performance.now() - started;
      writeLine(`fetch failed: ${label} duration=${duration.toFixed(1)} ms error=${String(error)}`);
      throw error;
    }
  }

  function cacheBusted(path, label) {
    return `${path}?label=${encodeURIComponent(label)}&ts=${Date.now()}`;
  }

  window.harness = {
    bindLifecycleLogs,
    cacheBusted,
    timedFetch,
    writeLine,
  };
})();
