// assets/infoweb.js - Versi Final (Selalu Muncul)

document.addEventListener("DOMContentLoaded", () => {
    const infoPopup = document.getElementById("infoPopup");
    const battleModal = document.getElementById("battleModal");
    const closeInfoPopupButton = document.getElementById("closeInfoPopup");

    // Fungsi untuk menampilkan popup
    const showInfoPopup = () => {
        // Periksa apakah modal battle sedang aktif. Jika iya, tunda.
        if (battleModal && battleModal.style.display === "block") {
            // Coba lagi setelah 10 detik
            setTimeout(showInfoPopup, 10000); 
            return;
        }
        
        if (infoPopup) {
            infoPopup.classList.add("show");
        }
    };

    // Fungsi untuk menyembunyikan popup
    const hideInfoPopup = () => {
        if (infoPopup) {
            infoPopup.classList.remove("show");
        }
    };

    // Tampilkan popup setelah 30 detik (30000 milidetik)
    setTimeout(showInfoPopup, 30000);

    // Event listener untuk tombol close
    if (closeInfoPopupButton) {
        closeInfoPopupButton.addEventListener("click", hideInfoPopup);
    }
});