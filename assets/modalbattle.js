// Aset/modalbattle.js

document.addEventListener("DOMContentLoaded", function() {
    // Ambil elemen-elemen modal
    const battleModal = document.getElementById("battleModal");
    const closeButton = document.querySelector(".close-button");

    // Fungsi untuk menampilkan modal
    function showModal() {
        if (battleModal) {
            battleModal.style.display = "block";
        }
    }

    // Fungsi untuk menyembunyikan modal
    function hideModal() {
        if (battleModal) {
            battleModal.style.display = "none";
        }
    }

    // Tampilkan modal setelah 10 detik
    setTimeout(showModal, 10000);

    // Sembunyikan modal saat tombol close diklik
    if (closeButton) {
        closeButton.addEventListener("click", hideModal);
    }

    // Sembunyikan modal saat mengklik di luar area modal
    window.addEventListener("click", function(event) {
        if (event.target === battleModal) {
            hideModal();
        }
    });
});