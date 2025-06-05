document.addEventListener('DOMContentLoaded', function() {
  // Konfigurasi Coin System
  const COIN_KEY = 'ruangriung_coin_data';
  const INITIAL_COINS = 500;
  const COIN_RESET_HOURS = 24;

  // Elemen DOM
  const coinCount = document.getElementById('coin-count');
  const resetBtn = document.getElementById('coin-reset-btn');
  const generateBtn = document.getElementById('generate-btn');
  const resetTimer = document.getElementById('reset-timer');

  // State
  let coins = INITIAL_COINS;
  let lastResetTime = Date.now();
  let timerInterval;

  // Inisialisasi
  loadCoinData();
  updateUI();
  setupEventListeners();
  startResetTimer();

  // Fungsi Utama
  function loadCoinData() {
    const savedData = localStorage.getItem(COIN_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const now = Date.now();
        const hoursSinceReset = (now - data.lastResetTime) / (1000 * 60 * 60);
        if (hoursSinceReset >= COIN_RESET_HOURS) {
          resetCoins();
        } else {
          coins = data.coins;
          lastResetTime = data.lastResetTime;
        }
      } catch {
        resetCoins();
      }
    } else {
      resetCoins();
    }
  }

  function saveCoinData() {
    localStorage.setItem(COIN_KEY, JSON.stringify({ coins, lastResetTime }));
  }

  function resetCoins() {
    coins = INITIAL_COINS;
    lastResetTime = Date.now();
    saveCoinData();
    updateUI();
    showSweetAlert('Coins Reset!', 'Your coins have been reset to 500!', 'success');
  }

  function spendCoin() {
    if (coins <= 0) {
      showSweetAlert('No Coins Left', 'You have no coins left! Coins will reset in 24 hours.', 'warning');
      return false;
    }
    coins--;
    saveCoinData();
    updateUI();
    return true;
  }

  function startResetTimer() {
    clearInterval(timerInterval);
    updateResetTimerDisplay();
    timerInterval = setInterval(updateResetTimerDisplay, 1000);
  }

  function updateResetTimerDisplay() {
    const now = Date.now();
    const resetTime = lastResetTime + (COIN_RESET_HOURS * 60 * 60 * 1000);
    const timeLeft = resetTime - now;

    if (timeLeft <= 0) {
      resetCoins();
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (resetTimer) {
      resetTimer.textContent = `Reset in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  function updateUI() {
    if (coinCount) coinCount.textContent = coins;
    if (generateBtn) {
      generateBtn.classList.toggle('no-coins', coins <= 0);
      generateBtn.title = coins <= 0 ? 'No coins - wait for 24h reset' : '';
    }
  }

  // Fungsi Validasi Password via API
  async function validateAdminPassword(inputPassword) {
    try {
      const response = await fetch('/api/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Password validation error:', error);
      return false;
    }
  }

  // Event Listener untuk Tombol Reset
  function setupEventListeners() {
    if (resetBtn) {
      resetBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const { value: password } = await Swal.fire({
          title: 'Enter Admin Password',
          input: 'password',
          inputPlaceholder: 'Enter password...',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          background: getComputedStyle(document.body).getPropertyValue('--bg'),
          color: getComputedStyle(document.body).getPropertyValue('--text'),
        });

        if (password) {
          const isValid = await validateAdminPassword(password);
          if (isValid) {
            resetCoins();
            startResetTimer();
          } else {
            showSweetAlert('Wrong Password!', 'The admin password is incorrect.', 'error');
          }
        }
      });
    }
  }

  // Helper: Tampilkan SweetAlert
  function showSweetAlert(title, text, icon = 'success') {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6c5ce7',
      background: getComputedStyle(document.body).getPropertyValue('--bg'),
      color: getComputedStyle(document.body).getPropertyValue('--text'),
    });
  }

  // Public API
  window.getCoins = () => coins;
  window.spendCoin = spendCoin;
  window.canGenerateImage = () => coins > 0;
  window.updateResetTimer = updateResetTimerDisplay;
});
