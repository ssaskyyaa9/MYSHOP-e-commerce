// jalankan saat halaman selesai dimuat
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("keranjang-container");
  const template = document.getElementById("template-keranjang");
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // tampilkan semua item dalam keranjang
  keranjang.forEach((item) => {
    const clone = template.content.cloneNode(true);
    const thumbnail = clone.querySelector(".produk-thumbnail");
    const judul = clone.querySelector(".produk-judul");
    const deskripsi = clone.querySelector(".produk-deskripsi");
    const harga = clone.querySelector(".produk-harga");

    // tampilkan data produk
    thumbnail.src = item.thumbnail || "";
    thumbnail.alt = item.title || "-";
    judul.textContent = item.title || "-";
    deskripsi.textContent = item.description || "-";

    const qtyInput = clone.querySelector(".qty-input");
    qtyInput.value = item.qty ?? 1;

    const btnMin = clone.querySelector(".btn-min");
    const btnPlus = clone.querySelector(".btn-plus");

    // update harga berdasarkan jumlah
    function updateHarga() {
      const total = item.price * parseInt(qtyInput.value);
      harga.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    }

    updateHarga(); // inisialisasi harga

    // tombol - (kurangi qty)
    btnMin.addEventListener("click", () => {
      let val = parseInt(qtyInput.value);
      if (val > 1) {
        qtyInput.value = val - 1;
        item.qty = val - 1;
        updateHarga();
        simpanPerubahan();
        hitungTotal();
      }
    });

    // tombol + (tambah qty)
    btnPlus.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
      item.qty = parseInt(qtyInput.value);
      updateHarga();
      simpanPerubahan();
      hitungTotal();
    });

    // tombol hapus produk
    const btnHapus = clone.querySelector(".btn-hapus");
      btnHapus.addEventListener("click", () => {
      const konfirmasi = confirm("Yakin ingin menghapus produk ini?");
      if (konfirmasi) {
        // cari produk yang sama dan hapus
        const indexDiKeranjang = keranjang.findIndex(p => p.title === item.title);
        if (indexDiKeranjang !== -1) {
          keranjang.splice(indexDiKeranjang, 1);
          simpanPerubahan();
          location.reload();
        }
      }
    });

    // tombol checkout per item produk
    const btnCheckoutItem = clone.querySelector(".btn-checkout-item");

    if (btnCheckoutItem) {
  btnCheckoutItem.addEventListener("click", () => {
    const konfirmasi = confirm(`Checkout produk "${item.title}"?`);
    if (konfirmasi) {
      // simpan produk ke detail pesanan
      localStorage.setItem("produkDibeli", JSON.stringify([item]));

      const i = keranjang.findIndex(p => p.title === item.title);
      if (i !== -1) {
        keranjang.splice(i, 1);
        simpanPerubahan();
        alert("Checkout berhasil!");
        window.location.href = "detailpesanan.html";
      } else {
        alert("Produk tidak ditemukan.");
      }
    }
  });
}

    // checkbox per item
    const checkbox = clone.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
      hitungTotal();
      cekSemua();
    });

    container.appendChild(clone);
  });

  // menyimpan perubahan ke localStorage
  function simpanPerubahan() {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
  }

  // parsing harga string ke angka
  function parseHarga(hargaStr) {
    let angka = hargaStr.replace("Rp", "").replaceAll(".", "").replaceAll(",", "").trim();
    return parseInt(angka) || 0;
  }

  // hitung total harga dari item yang dicentang
  function hitungTotal() {
    let total = 0;
    const semuaItem = container.querySelectorAll("section");
    semuaItem.forEach(section => {
      const checkbox = section.querySelector("input[type='checkbox']");
      const hargaText = section.querySelector(".produk-harga").textContent;
      const harga = parseHarga(hargaText);
      if (checkbox.checked) total += harga;
    });
    document.getElementById("total-harga").textContent = `(Rp ${total.toLocaleString("id-ID")})`;
  }

  // tombol centang semua item
  const checkAll = document.getElementById("check-all");
  checkAll.addEventListener("change", () => {
    const semuaItem = container.querySelectorAll("section");
    semuaItem.forEach(section => {
      section.querySelector("input[type='checkbox']").checked = checkAll.checked;
    });
    hitungTotal();
  });

  // cek apakah semua dicentang
  function cekSemua() {
    const semuaItem = container.querySelectorAll("section");
    const semuaChecked = [...semuaItem].every(section => section.querySelector("input[type='checkbox']").checked);
    checkAll.checked = semuaChecked;
  }

  // tombol checkout navbar (checkout semua yang dicentang)
  document.getElementById("btn-checkout").addEventListener("click", () => {
    const semuaItem = container.querySelectorAll("section");
    const produkTercentang = [];

    semuaItem.forEach((section) => {
      const checkbox = section.querySelector("input[type='checkbox']");
      const judul = section.querySelector(".produk-judul").textContent;
      if (checkbox.checked) produkTercentang.push(judul);
    });

    if (produkTercentang.length === 0) {
      alert("Silakan centang minimal satu produk untuk checkout.");
      return;
    }

    const total = document.getElementById("total-harga").textContent;
    const konfirmasi = confirm(`Total belanja: ${total}\nLanjut checkout?`);

    if (konfirmasi) {
      const produkDibeli = keranjang.filter(item => produkTercentang.includes(item.title));
      localStorage.setItem("produkDibeli", JSON.stringify(produkDibeli));
      keranjang = keranjang.filter(item => !produkTercentang.includes(item.title));
      simpanPerubahan();
      alert("Checkout berhasil!");
      window.location.href = "detailpesanan.html";
    }
  });

  // update jumlah item di cart
  function updateCartCount() {
    document.getElementById("cart-count").textContent = `(${keranjang.length})`;
  }

  updateCartCount(); // jalankan saat pertama load
});