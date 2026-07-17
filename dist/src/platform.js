(() => {
  'use strict';

  const release = Object.freeze({
    name: 'Sakura Crest: Social Summit',
    version: '1.8.0',
    channel: 'production',
    releasedAt: '2026-07-15',
    edition: 'Commercial Anime Art & Expanded Academy'
  });

  try {
    window.SAKURA_RELEASE = release;
    if (document?.documentElement) document.documentElement.dataset.release = release.version;
    if (typeof CustomEvent === 'function') window.dispatchEvent(new CustomEvent('sakura:release-ready', { detail: release }));
  } catch {
    // Static validation intentionally provides a minimal browser environment.
  }

  const showFatalStatus = (message, detail) => {
    console.error(`[Sakura Crest ${release.version}] ${message}`, detail || '');
    if (!document?.body || typeof document.createElement !== 'function') return;
    let banner = document.getElementById('runtime-status');
    if (!banner) {
      banner = document.createElement('aside'); banner.id = 'runtime-status'; banner.setAttribute('role', 'alert'); banner.setAttribute('aria-live', 'assertive'); document.body.appendChild(banner);
    }
    banner.innerHTML = '';
    const title = document.createElement('strong'); title.textContent = 'Sakura Crest needs attention';
    const copy = document.createElement('span'); copy.textContent = message;
    const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Reload game'; retry.addEventListener('click', () => location.reload());
    banner.append(title, copy, retry); banner.classList.add('visible');
  };

  window.addEventListener('error', event => { if (event?.error || event?.message) showFatalStatus('A runtime error interrupted the game. Your local save and backup remain on this device.', event.error || event.message); });
  window.addEventListener('unhandledrejection', event => { showFatalStatus('A background task failed. Reload the game to continue from the last validated save.', event?.reason); });

  if (typeof navigator !== 'undefined' && navigator.storage?.persist) navigator.storage.persist().catch(() => false);

  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof location !== 'undefined' && location.protocol !== 'file:') {
    const controlledAtBoot = Boolean(navigator.serviceWorker.controller);
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).then(registration => {
        const activateWaitingWorker = () => { if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' }); };
        activateWaitingWorker();
        registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) activateWaitingWorker(); }); });
      }).catch(error => console.warn('Offline support could not be enabled.', error));
    });
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!controlledAtBoot || refreshing) return; refreshing = true; location.reload(); });
  }

  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); window.__sakuraInstallPrompt = event; document?.documentElement?.setAttribute('data-installable', 'true'); });
  window.addEventListener('appinstalled', () => { window.__sakuraInstallPrompt = null; document?.documentElement?.removeAttribute('data-installable'); });
})();
