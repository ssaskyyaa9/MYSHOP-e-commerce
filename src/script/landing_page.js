// Fungsi untuk mengambil dan menampilkan produk di halaman utama
async function fetchProduk() {
  // Mengambil data produk dari API (maks 300 produk)
  const response = await fetch('https://dummyjson.com/products?limit=300');
  const data = await response.json(); // Mengubah response menjadi JSON

  // Mengambil elemen container tempat produk akan ditampilkan
  const produkContainer = document.getElementById('produk-container');
  // Mengambil elemen template untuk kartu produk
  const template = document.getElementById('produk-landing');

  // ✅ Daftar kategori produk yang akan ditampilkan di landing page
  const kategoriYangDitampilkan = [
    'beauty',
    'fragrances',
    'womens-dresses',
    'womens-bags',
    'womens-shoes',
    'womens-jewellery',
    'home-decoration',
    'womens-watches'
  ];

  // ✅ Filter produk berdasarkan kategori yang diinginkan
  const filteredProducts = data.products.filter(produk =>
    kategoriYangDitampilkan.includes(produk.category)
  ); 

  // Melakukan loop untuk setiap produk yang sudah difilter
  filteredProducts.forEach(produk => {
    // Mengkloning isi template (duplikat struktur HTML)
    const clone = template.content.cloneNode(true);

    // Menampilkan gambar produk
    const img = clone.querySelector('.produk-img');
    img.src = produk.thumbnail; // Sumber gambar dari API
    img.alt = produk.title;     // Deskripsi alternatif gambar

    // Mengonversi harga ke dalam Rupiah
    const harga = produk.price * 16000;
    // Menampilkan harga yang telah diformat ke dalam IDR
    clone.querySelector('.produk-harga').textContent = `Rp ${harga.toLocaleString('id-ID')}`;
    
    // Menampilkan hanya 3 kata pertama dari judul produk
    const judulProduk = clone.querySelector('.produk-judul');
    judulProduk.textContent = produk.title.split(" ").slice(0, 3).join(" "); // 🔥 Hanya 3 kata

    // Menambahkan event click pada seluruh kartu agar mengarah ke halaman detail
    const card = clone.querySelector("div");
    card.style.cursor = "pointer"; // Menjadikan kursor pointer (tanda bisa diklik)
    card.addEventListener("click", () => {
      // Redirect ke halaman detail dengan parameter id produk
      window.location.href = `detailproduklp.html?id=${produk.id}`;
    });

    // Menambahkan elemen kartu produk ke dalam container di halaman
    produkContainer.appendChild(clone);
  });
}

// Memanggil fungsi fetchProduk agar dijalankan saat halaman dibuka
fetchProduk();


// Fungsi untuk mengisi 3 produk promo di bagian khusus landing page
async function isiProdukLanding() {
  // Mengambil ulang data produk dari API (bisa dioptimalkan agar tidak fetch dua kali)
  const response = await fetch('https://dummyjson.com/products?limit=300');
  const data = await response.json(); // Mengubah response ke JSON

  // Kategori produk yang akan ditampilkan dalam promo
  const kategoriYangDitampilkan = ['womens-bags', 'womens-shoes'];

  // Menyaring dan membatasi hanya 3 produk pertama dari kategori tersebut
  const filteredProducts = data.products.filter(produk =>
    kategoriYangDitampilkan.includes(produk.category)
  ).slice(0, 3); // hanya ambil 3

  // Melakukan loop untuk setiap produk hasil filter
  filteredProducts.forEach((produk, index) => {
    // Mengambil elemen kartu berdasarkan urutan (produk-card-1, produk-card-2, dst.)
    const card = document.getElementById(`produk-card-${index + 1}`);
    if (!card) return; // Jika elemen tidak ditemukan, lewati

    // Mengambil elemen gambar, diskon, dan container harga dari kartu
    const img = card.querySelector(".produk-img");
    const diskon = card.querySelector(".produk-diskon");
    const hargaContainer = card.querySelector(".produk-harga");

    // Cek apakah elemen harga asli sudah ada, jika tidak maka buat
    let hargaAsli = hargaContainer.querySelector(".harga-asli");
    let hargaDiskon = hargaContainer.querySelector(".harga-diskon");

    if (!hargaAsli) {
      // Membuat elemen <del> untuk harga asli yang dicoret
      hargaAsli = document.createElement("del");
      hargaAsli.className = "harga-asli text-sm text-gray-500 mr-2";
      hargaContainer.appendChild(hargaAsli); // Menambahkan ke DOM
    }

    if (!hargaDiskon) {
      // Membuat elemen <span> untuk menampilkan harga setelah diskon
      hargaDiskon = document.createElement("span");
      hargaDiskon.className = "harga-diskon font-bold text-[#4F5575]";
      hargaContainer.appendChild(hargaDiskon); // Menambahkan ke DOM
    }

    // Menampilkan gambar dan alt-nya
    img.src = produk.thumbnail;
    img.alt = produk.title;

    // Menampilkan persentase diskon (dibulatkan ke bawah)
    diskon.textContent = `${produk.discountPercentage.toFixed(0)}%`;

    // Menghitung harga asli dan harga setelah diskon dalam Rupiah
    const hargaIDR = produk.price * 16000;
    const hargaSetelahDiskon = hargaIDR * (1 - produk.discountPercentage / 100);

    // Menampilkan harga asli dan harga diskon yang telah diformat
    hargaAsli.textContent = `Rp ${hargaIDR.toLocaleString('id-ID')}`;
    hargaDiskon.textContent = `Rp ${hargaSetelahDiskon.toLocaleString('id-ID')}`;

    // Menjadikan seluruh kartu produk bisa diklik dan redirect ke halaman detail
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      // Redirect ke halaman detail dengan ID produk
      window.location.href = `detailproduklp.html?id=${produk.id}`;
    });
  });
}

// Memanggil fungsi isiProdukLanding agar langsung dijalankan setelah halaman siap
isiProdukLanding();
