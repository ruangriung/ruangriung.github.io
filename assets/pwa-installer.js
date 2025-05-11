document.addEventListener('DOMContentLoaded', () => {
  let deferredPrompt;
  const installBtn = document.getElementById('pwa-install-btn');
  
  // Check if PWA is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    if (installBtn) installBtn.style.display = 'none';
    return;
  }

  // Show install button when supported
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.innerHTML = '<i class="fas fa-download"></i> Install Aplikasi';
    }
  });

  // Handle install button click
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      installBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      
      const { outcome } = await deferredPrompt.prompt();
      
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      } else {
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install Aplikasi';
      }
      deferredPrompt = null;
    });
  }

  // Hide button after installation
  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
  });
});
