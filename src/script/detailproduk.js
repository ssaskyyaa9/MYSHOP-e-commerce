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

    // bagian box produk
    document.getElementById("produk-judul").innerText = produk.title || "-";
    document.getElementById("produk-deskripsi").innerText = produk.description || "-";

    // bagian deskripsi produk
    document.getElementById("produk-judul-utama").innerText = produk.title || "-";
    document.getElementById("produk-deskripsi-utama").innerText = produk.description || "-";

    // bagian deskripsi
    document.getElementById("produk-keterangan").innerText = produk.brand || "-";
    document.getElementById("produk-jenis").innerText = produk.category || "-";
    document.getElementById("produk-rating").innerText = `Rating: ${produk.rating} / 5`;
    document.getElementById("produk-stok").innerText = `Stok: ${produk.stock}`;
    document.getElementById("produk-brand").innerText = `Brand: ${produk.brand}`;
    document.getElementById("produk-kategori").innerText = `Kategori: ${produk.category}`;
    document.getElementById('total-terjual').innerText = `Total terjual: ${produk.stock || 0}`;

    // Gambar & Harga Awal
    document.getElementById("produk-gambar").src = produk.thumbnail;
    document.getElementById("produk-harga").textContent = `Rp ${(produk.price * 16000).toLocaleString("id-ID")}`;

    produkTerpilih = produk;

    // simpan harga asli ke data attribute (supaya mudah hitung total)
    document.querySelector('.qty-input').dataset.harga = produk.price * 16000;

    // saat pertama tampilkan total harga sesuai qty awal (1)
    updateHargaTotal();

  } catch (error) {
    console.error("Gagal mengambil detail produk:", error);
    document.body.innerHTML = "<p class='text-red-600 text-center mt-10'>Gagal memuat produk.</p>";
  }
}
fetchDetailProduk();

//menentukan jumlah produk//
function decreaseQty() {
  const input = document.querySelector('.qty-input');
  let qty = parseInt(input.value);
  if (qty > 1) {
    input.value = qty - 1;
    updateHargaTotal();
  }
}

function increaseQty() {
  const input = document.querySelector('.qty-input');
  let qty = parseInt(input.value);
  input.value = qty + 1;
  updateHargaTotal();
}

function updateHargaTotal() {
  const input = document.querySelector('.qty-input');
  const hargaPerItem = parseInt(input.dataset.harga);
  const qty = parseInt(input.value);
  const totalHarga = hargaPerItem * qty;

  document.getElementById("produk-harga").textContent = `Rp ${totalHarga.toLocaleString("id-ID")}`;
}

//bagian harga di keranjang//
document.getElementById("keranjang-icon").addEventListener("click", function () {
  if (!produkTerpilih) {
    alert("❌ Produk belum dimuat");
    return;
  }

  const input = document.querySelector('.qty-input');
  const qty = parseInt(input.value);
  const hargaPerItem = parseInt(input.dataset.harga);
  const totalHarga = hargaPerItem * qty;

  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.push({
    id: produkTerpilih.id,
    title: produkTerpilih.title,
    price: hargaPerItem, 
    description: produkTerpilih.description,
    thumbnail: produkTerpilih.thumbnail,
    qty: qty,
    total: totalHarga 
  });

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  alert("✅ Berhasil di tambahkan ke keranjang!");
  window.location.href = "keranjang.html";
});

//bagian ulasan//
document.getElementById("kirim-btn").addEventListener("click", function() {
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
});

function maskNama(nama) {
  if (nama.length <= 1) return nama;
  const parts = nama.split(" ");
  return parts.map(part => {
    if (part.length <= 1) return part;
    return part[0] + "*".repeat(part.length - 2) + part.slice(-1);
  }).join(" ");
}

//bagian button checkout//
document.getElementById("checkout-button").addEventListener("click", function () {
  if (!produkTerpilih) {
    alert("❌ Produk belum dimuat");
    return;
  }

  const konfirmasi = confirm("Apakah kamu yakin ingin checkout produk ini?");
  if (!konfirmasi) return;

  const input = document.querySelector('.qty-input');
  const qty = parseInt(input.value);
  const hargaPerItem = parseInt(input.dataset.harga);
  const totalHarga = hargaPerItem * qty;

  const produkDibeli = [{
    id: produkTerpilih.id,
    title: produkTerpilih.title,
    price: hargaPerItem,
    description: produkTerpilih.description,
    thumbnail: produkTerpilih.thumbnail,
    quantity: qty,
    total: totalHarga,
  }];

  localStorage.setItem("produkDibeli", JSON.stringify(produkDibeli));
  window.location.href = "detailpesanan.html";
});

