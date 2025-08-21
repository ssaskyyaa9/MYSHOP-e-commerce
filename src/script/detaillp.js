async function fetchDetailProduk() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  console.log("ID produk dari URL:", productId);

  if (!productId) {
    document.getElementById("produk-judul-utama").innerText = "Nama produk";
    document.getElementById("produk-deskripsi-utama").innerText = "Deskripsi produk";
    document.getElementById("produk-rating").innerText = "Rating produk";
    return;
  }

  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) throw new Error("Produk tidak ditemukan");

    const produk = await response.json();
    console.log("Data produk:", produk);

    // Set konten utama
    document.getElementById("produk-judul-utama").innerText = produk.title || "-";
    document.getElementById("produk-deskripsi-utama").innerText = produk.description || "-";

    // Gambar produk
    document.getElementById("produk-gambar").src = produk.thumbnail;
    document.getElementById("produk-gambar").alt = produk.title;

    // Info tambahan
    document.getElementById("produk-keterangan").innerText = produk.brand || "-";
    document.getElementById("produk-jenis").innerText = produk.category || "-";
    document.getElementById("produk-rating").innerText = `Rating: ${produk.rating} / 5`;
    document.getElementById("produk-stok").innerText = `Stok: ${produk.stock}`;
    document.getElementById("produk-brand").innerText = `Brand: ${produk.brand}`;
    document.getElementById("produk-kategori").innerText = `Kategori: ${produk.category}`;
    document.getElementById("total-terjual").innerText = `Total terjual: ${produk.stock || 0}`;

  } catch (error) {
    console.error("Gagal mengambil detail produk:", error);
    document.body.innerHTML = "<p class='text-red-600 text-center mt-10'>Gagal memuat produk.</p>";
  }
}

window.addEventListener("DOMContentLoaded", async function () {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await res.json();

  // Isi halaman
  document.getElementById("produk-gambar").src = data.thumbnail;
  document.getElementById("produk-harga").textContent = `Rp ${(data.price * 16000).toLocaleString("id-ID")}`;
  document.getElementById("produk-judul").textContent = data.title;
  document.getElementById("produk-deskripsi").textContent = data.description;
})

fetchDetailProduk();

  function decreaseQty() {
    const input = document.querySelector('.qty-input');
    let qty = parseInt(input.value);
    if (qty > 1) {
      input.value = qty - 1;
    }
  }

  function increaseQty() {
    const input = document.querySelector('.qty-input');
    let qty = parseInt(input.value);
    input.value = qty + 1;
  }
  

  // ✅ Alert saat klik ikon keranjang jika belum daftar/login
const iconKeranjang = document.getElementById("keranjang-icon");
if (iconKeranjang) {
  iconKeranjang.addEventListener("click", () => {
    const konfirmasi = confirm("Untuk menggunakan fitur keranjang, silakan daftar terlebih dahulu. Apakah Anda ingin pergi ke halaman daftar?");
    if (konfirmasi) {
      window.location.href = "daftar.html";
    }
  });
}

// ✅ Alert saat klik tombol checkout jika belum daftar/login
const tombolCheckout = document.getElementById("checkout-button");
if (tombolCheckout) {
  tombolCheckout.addEventListener("click", () => {
    const konfirmasi = confirm("Anda harus daftar terlebih dahulu untuk checkout. Ingin pergi ke halaman daftar?");
    if (konfirmasi) {
      window.location.href = "daftar.html";
    }
  });
}

  // tombol kirim ulasan
    const tombol = document.getElementById("kirim-btn");

    tombol.addEventListener("click", function() {
      const jawab = confirm("daftar sekarang untuk bisa menambahkan komentar");
      if (jawab) {
        // Redirect jika klik "Oke"
        window.location.href = "daftar.html";
      } else {
        alert("Kamu membatalkan.");
      }
    });

  const namaInput = document.getElementById("nama-input").value.trim() || "Nama";
  const komentarInput = document.getElementById("komentar-input").value.trim() || "Belum ada komentar";
  const ratingInput = document.getElementById("rating-input").value;

  const reviewContainer = document.getElementById("review-container");
  const template = document.getElementById("review-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".nama-review").textContent = maskNama(namaInput);

  const ratingElem = clone.querySelector(".rating-review");
  for (let i = 0; i < ratingInput; i++) {
    const span = document.createElement('span');
    span.innerHTML = '&#9733;';
    span.classList.add("text-black", "text-xl");
    ratingElem.appendChild(span);
  }

  clone.querySelector(".komentar-review").textContent = komentarInput;

  clone.querySelector(".hapus-btn").addEventListener("click", function() {
    this.closest("div").remove();
  });

  reviewContainer.prepend(clone);

  document.getElementById("nama-input").value = "";
  document.getElementById("komentar-input").value = "";
  document.getElementById("rating-input").value = "5";
;
