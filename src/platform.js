(() => {
  'use strict';

  const release = Object.freeze({
    name: 'Sakura Crest: Social Summit',
    version: '1.1.0',
    channel: 'production',
    releasedAt: '2026-07-14'
  });

  try {
    window.SAKURA_RELEASE = release;
    if (document?.documentElement) {
      document.documentElement.dataset.release = release.version;
    }
  } catch {
    // The static VM smoke test intentionally provides a minimal DOM.
  }

  const showFatalStatus = (message, detail) => {
    console.error(`[Sakura Crest ${release.version}] ${message}`, detail || '');
    if (!document?.body || typeof document.createElement !== 'function') return;
    let banner = document.getElementById('runtime-status');
    if (!banner) {
      banner = document.createElement('aside');
      banner.id = 'runtime-status';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-live', 'assertive');
      document.body.appendChild(banner);
    }
    banner.innerHTML = '';
    const title = document.createElement('strong');
    title.textContent = 'Sakura Crest needs attention';
    const copy = document.createElement('span');
    copy.textContent = message;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Reload game';
    retry.addEventListener('click', () => location.reload());
    banner.append(title, copy, retry);
    banner.classList.add('visible');
  };

  window.addEventListener('error', event => {
    if (event?.error || event?.message) {
      showFatalStatus('A runtime error interrupted the game. Your local save remains on this device.', event.error || event.message);
    }
  });

  window.addEventListener('unhandledrejection', event => {
    showFatalStatus('A background task failed. Reload the game to continue safely.', event?.reason);
  });

  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    navigator.storage.persist().catch(() => false);
  }

  if (
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    typeof location !== 'undefined' &&
    location.protocol !== 'file:'
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).then(registration => {
        const activateWaitingWorker = () => {
          if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        };
        activateWaitingWorker();
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) activateWaitingWorker();
          });
        });
      }).catch(error => {
        console.warn('Offline support could not be enabled.', error);
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    window.__sakuraInstallPrompt = event;
    document?.documentElement?.setAttribute('data-installable', 'true');
  });

  window.addEventListener('appinstalled', () => {
    window.__sakuraInstallPrompt = null;
    document?.documentElement?.removeAttribute('data-installable');
  });
})();
