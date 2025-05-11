// PWA Installation Handler
document.addEventListener('DOMContentLoaded', () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('pwa-install-btn').style.display = 'flex';
  });

  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    const { outcome } = await deferredPrompt.prompt();
    if (outcome === 'accepted') {
      document.getElementById('pwa-install-btn').style.display = 'none';
    }
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    document.getElementById('pwa-install-btn').style.display = 'none';
  });
});


