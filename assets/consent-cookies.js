// Cookie Consent Module
const CookieConsent = (function() {
    // Private variables
    const COOKIE_NAME = 'ruangriung_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;
    const banner = document.getElementById('cookieConsentBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');
    const learnMoreLink = document.getElementById('cookieLearnMore');
    
    // Check if cookie consent is needed
    function shouldShowBanner() {
        return !getCookie(COOKIE_NAME);
    }
    
    // Get cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    // Set cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }
    
    // Show banner
    function showBanner() {
        if (shouldShowBanner()) {
            banner.classList.add('show');
        }
    }
    
    // Hide banner
    function hideBanner() {
        banner.classList.remove('show');
    }
    
    // Handle accept
    function handleAccept() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();
        logToConsole('Cookie consent accepted');
        showSweetAlert(
            'Cookie Consent',
            'Terima kasih telah menerima penggunaan cookie kami. Pengaturan ini akan disimpan untuk kunjungan Anda berikutnya.',
            'success'
        );
    }
    
    // Handle decline
    function handleDecline() {
        setCookie(COOKIE_NAME, 'declined', COOKIE_EXPIRY_DAYS);
        hideBanner();
        logToConsole('Cookie consent declined');
        showSweetAlert(
            'Cookie Consent',
            'Anda telah menolak penggunaan cookie. Beberapa fitur mungkin tidak berfungsi optimal.',
            'info'
        );
    }
    
    // Handle learn more
    function handleLearnMore(e) {
        e.preventDefault();
        showSweetAlert(
            'Cookie Policy',
            'Kebijakan Cookie: Kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan analisis lalu lintas. Anda dapat mengelola preferensi cookie Anda melalui pengaturan browser.',
            'info'
        );
    }
    
    // Initialize
    function init() {
        // Only add event listeners if elements exist
        if (acceptBtn) acceptBtn.addEventListener('click', handleAccept);
        if (declineBtn) declineBtn.addEventListener('click', handleDecline);
        if (learnMoreLink) learnMoreLink.addEventListener('click', handleLearnMore);
        
        // Show banner if needed
        showBanner();
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize Cookie Consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CookieConsent.init();
});

// Helper function to log to console
function logToConsole(message) {
    console.log(message);
}

// Add these to your DOM element selections
const expandTextareaBtn = document.getElementById('expand-textarea-btn');
const textareaOverlay = document.getElementById('textarea-overlay');
const doneExpandingBtn = document.getElementById('done-expanding-btn');