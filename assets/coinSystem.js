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
    showSweetAlert('Success!', 'Coins have been reset to 500!', 'success');
  }

  function spendCoin() {
    if (coins <= 0) {
      showSweetAlert('No Coins Left', 'Coins will reset in 24 hours.', 'warning');
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
      return await response.json();
    } catch (error) {
      console.error('Validation error:', error);
      return { success: false };
    }
  }

  // Event Listener dengan Toggle Password
  function setupEventListeners() {
    if (resetBtn) {
      resetBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const { value: password } = await Swal.fire({
          title: 'Enter Admin Password',
          html: `
            <div style="position: relative; margin: 1em 0">
              <input
                id="swal-password"
                type="password"
                class="swal2-input"
                placeholder="Your password..."
                style="padding-right: 2.5em"
              >
              <button
                id="swal-toggle-password"
                type="button"
                style="
                  position: absolute;
                  right: 15px;
                  top: 50%;
                  transform: translateY(-50%);
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: #666;
                  font-size: 1.2em;
                "
              >
                <i class="fa fa-eye"></i>
              </button>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Verify',
          cancelButtonText: 'Cancel',
          preConfirm: () => {
            return document.getElementById('swal-password').value;
          },
          didOpen: () => {
            const toggleBtn = document.getElementById('swal-toggle-password');
            const passwordInput = document.getElementById('swal-password');
            
            toggleBtn.addEventListener('click', () => {
              const isShowing = passwordInput.type === 'text';
              passwordInput.type = isShowing ? 'password' : 'text';
              toggleBtn.innerHTML = isShowing ? '<i class="fa fa-eye"></i>' : '<i class="fa fa-eye-slash"></i>';
            });
          }
        });

        if (password) {
          const validation = await validateAdminPassword(password);
          if (validation.success) {
            resetCoins();
          } else {
            showSweetAlert('Access Denied', validation.message || 'Invalid password', 'error');
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
