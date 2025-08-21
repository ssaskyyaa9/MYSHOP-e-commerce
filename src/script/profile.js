// Menambahkan event listener=mengikuti perintah pada tombol dengan id "logout-btn" saat diklik
document.getElementById("logout-btn").addEventListener("click", () => {
  
  // Menampilkan konfirmasi kepada pengguna sebelum logout
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    
    // Jika pengguna menekan "OK", arahkan ke halaman landing (index.html)
    window.location.href = "index.html";
  }
});
