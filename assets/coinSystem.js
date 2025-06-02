document.addEventListener('DOMContentLoaded', function() {
    // ====================== KONFIGURASI ======================
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;
    const API_URL = 'https://ariftirtana.com/admin-api/';
    const API_KEY = 'hryhfjfh776(';

    // ====================== FUNGSI API ======================
    async function fetchAdminPassword() {
        try {
            const response = await fetch(API_URL, {
                headers: { 
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.password;
        } catch (error) {
            console.error('Failed to fetch admin password:', error);
            showAlert('Connection Error', 'Cannot connect to admin server', 'error');
            return null;
        }
    }

    // ====================== FUNGSI UTAMA ======================
    async function handleResetRequest() {
        const { value: inputPassword } = await Swal.fire({
            title: 'Admin Authentication',
            input: 'password',
            inputPlaceholder: 'Enter admin password',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',
            cancelButtonColor: '#d63031',
            backdrop: `
                rgba(0,0,0,0.7)
                url("/images/admin-lock.png")
                center top
                no-repeat
            `
        });

        if (inputPassword) {
            const adminPassword = await fetchAdminPassword();
            
            if (adminPassword && inputPassword === adminPassword) {
                resetCoins();
                showAlert('Success', 'Coins have been reset', 'success');
            } else {
                showAlert('Error', 'Invalid admin password', 'error');
            }
        }
    }

    // ====================== INTEGRASI ======================
    const resetBtn = document.getElementById('coin-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleResetRequest();
        });
    }

    // Fungsi-fungsi lainnya (loadCoinData, resetCoins, dll) tetap sama
    // ... [kode yang sudah ada sebelumnya]
});

// Fungsi bantuan
function showAlert(title, text, icon) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#6c5ce7',
        background: '#2d3436',
        color: '#fff'
    });
}
