// Status Indicator
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

function updateStatus(status, message) {
    statusDot.className = 'status-dot';
    
    switch(status) {
        case 'connected':
            statusDot.classList.add('connected');
            statusText.textContent = message || 'Terhubung ke sistem AI';
            break;
        case 'warning':
            statusDot.classList.add('warning');
            statusText.textContent = message || 'Peringatan: Masalah koneksi';
            break;
        case 'error':
            statusDot.classList.add('error');
            statusText.textContent = message || 'Error: Tidak terhubung';
            break;
        default:
            statusText.textContent = message || 'Status tidak diketahui';
    }
    
    logToConsole(`Status sistem diperbarui: ${status} - ${message || ''}`);
}

// Simulate connection status
setTimeout(() => {
    updateStatus('connected', 'Sistem siap digunakan');
}, 1500);