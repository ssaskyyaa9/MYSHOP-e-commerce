// Fungsi async untuk mengambil data produk dari API
async function fetchProduk() {
  // Mengambil data produk dari API dengan limit 200
  const response = await fetch('https://dummyjson.com/products?limit=200');
  const data = await response.json(); // Mengubah response menjadi JSON

  // Menyimpan referensi ke container HTML tempat produk akan ditampilkan
  const produkContainer = document.getElementById('produk-container');
  // Menyimpan referensi ke template HTML yang akan dikloning
  const template = document.getElementById('produk-homepage');

  // Daftar kategori yang ingin ditampilkan di homepage
  const kategoriYangDitampilkan = [
    'beauty',
    'womens-bags',
    'fragrances',
    'womens-dresses',
    'womens-shoes',
    'womens-jewellery',
    'home-decoration',
    'womens-watches',
  ];

  // Memfilter produk berdasarkan kategori, lalu mengambil maksimal 200 produk
  const filteredProducts = data.products.filter(produk =>
    kategoriYangDitampilkan.includes(produk.category)
  ).slice(0, 200);

  // Melakukan iterasi pada setiap produk yang sudah difilter
  filteredProducts.forEach(produk => {
    // Mengkloning template untuk setiap produk
    const clone = template.content.cloneNode(true);

    // Mengisi gambar produk dan menambahkan event klik ke halaman detail
    const img = clone.querySelector('.produk-img');
    img.src = produk.thumbnail;
    img.alt = produk.title;
    img.classList.add('cursor-pointer');
    img.addEventListener('click', () => {
      // Arahkan ke halaman detail produk jika gambar diklik
      window.location.href = `detailproduk.html?id=${produk.id}`;
    });

    // Menghitung harga IDR (dolar ke rupiah) dan menampilkannya
    const harga = produk.price * 16000;
    clone.querySelector('.produk-harga').textContent = `Rp ${harga.toLocaleString('id-ID')}`;

    // Menampilkan judul produk hanya 3 kata pertama
    const judulProduk = clone.querySelector('.produk-judul');
    judulProduk.textContent = produk.title.split(" ").slice(0, 3).join(" "); // 🔥 Hanya 3 kata

    // Menambahkan elemen produk ke dalam container
    produkContainer.appendChild(clone);
  });
}

// Memanggil fungsi untuk menampilkan produk di homepage
fetchProduk();

// Fungsi async untuk menampilkan 3 produk promo di homepage
async function isiProdukHomepage() {
  // Mengambil data produk dari API dengan limit 300
  const response = await fetch('https://dummyjson.com/products?limit=300');
  const data = await response.json(); // Mengubah response menjadi JSON

  // Filter kategori promo tertentu saja
  const kategoriYangDitampilkan = ['womens-bags', 'womens-shoes'];

  // Ambil maksimal 3 produk dari kategori yang difilter
  const filteredProducts = data.products.filter(produk =>
    kategoriYangDitampilkan.includes(produk.category)
  ).slice(0, 3);

  // Iterasi setiap produk promo
  filteredProducts.forEach((produk, index) => {
    // Menargetkan elemen card sesuai indeks
    const card = document.getElementById(`produk-card-${index + 1}`);
    if (!card) return; // Jika tidak ada elemen, lewati

    // Mengisi gambar, diskon, dan harga
    const img = card.querySelector(".produk-img");
    const diskon = card.querySelector(".produk-diskon");
    const hargaContainer = card.querySelector(".produk-harga");

    // Cek apakah elemen harga asli dan diskon sudah ada
    let hargaAsli = hargaContainer.querySelector(".harga-asli");
    let hargaDiskon = hargaContainer.querySelector(".harga-diskon");

    // Jika belum ada, buat elemen harga asli (dicoret)
    if (!hargaAsli) {
      hargaAsli = document.createElement("del");
      hargaAsli.className = "harga-asli text-sm text-gray-500 mr-2";
      hargaContainer.appendChild(hargaAsli);
    }

    // Jika belum ada, buat elemen harga setelah diskon
    if (!hargaDiskon) {
      hargaDiskon = document.createElement("span");
      hargaDiskon.className = "harga-diskon font-bold text-[#4F5575]";
      hargaContainer.appendChild(hargaDiskon);
    }

    // Set gambar dan alt-nya
    img.src = produk.thumbnail;
    img.alt = produk.title;

    // Menampilkan persentase diskon, dibulatkan ke bawah
    diskon.textContent = `${produk.discountPercentage.toFixed(0)}%`;

    // Menghitung harga asli dan setelah diskon (dari USD ke IDR)
    const hargaIDR = produk.price * 16000;
    const hargaSetelahDiskon = hargaIDR * (1 - produk.discountPercentage / 100);

    // Menampilkan harga asli dan harga setelah diskon dalam format IDR
    hargaAsli.textContent = `Rp ${hargaIDR.toLocaleString('id-ID')}`;
    hargaDiskon.textContent = `Rp ${hargaSetelahDiskon.toLocaleString('id-ID')}`;

    // Menambahkan event klik ke seluruh card untuk ke halaman detail produk
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = `detailproduk.html?id=${produk.id}`;
    });
  });
}

// Memanggil fungsi untuk menampilkan produk promo di homepage
isiProdukHomepage();

//menambahkan produk ke keranjang 3 box//
async function aktifkanKeranjangPromo() {
  const response = await fetch('https://dummyjson.com/products?limit=300');
  const data = await response.json();

  const kategoriPromo = ['womens-bags', 'womens-shoes'];
  const produkPromo = data.products.filter(p => kategoriPromo.includes(p.category)).slice(0, 3);

  produkPromo.forEach((produk, index) => {
    const card = document.getElementById(`produk-card-${index + 1}`);
    if (!card) return;

    const keranjangIcon = card.querySelector("img[alt='keranjang']");
    if (!keranjangIcon) return;

    keranjangIcon.classList.add("cursor-pointer");
    keranjangIcon.addEventListener("click", (e) => {
      e.stopPropagation(); // Biar gak trigger ke card.click
      const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

      const sudahAda = keranjang.find(item => item.id === produk.id);
      if (sudahAda) {
        alert("❗Produk sudah ada di keranjang.");
        return;
      }

      const hargaIDR = produk.price * 16000;
      keranjang.push({
        id: produk.id,
        title: produk.title,
        price: hargaIDR,
        description: produk.description,
        thumbnail: produk.thumbnail,
        qty: 1,
        total: hargaIDR
      });

      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      alert("✅ Produk promo berhasil ditambahkan ke keranjang!");
    });
  });
}
// Panggil setelah isiProdukHomepage
isiProdukHomepage().then(aktifkanKeranjangPromo);

//bagian keranjang produk bawah//
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=20");
      const data = await response.json();
      const produkList = data.products;

      const container = document.getElementById("produk-container");
      const template = document.getElementById("produk-homepage");

      produkList.forEach((produk) => {
        const clone = template.content.cloneNode(true);

        // Isi data produk
        clone.querySelector(".produk-img").src = produk.thumbnail;
        clone.querySelector(".produk-img").alt = produk.title;
        clone.querySelector(".produk-judul").innerText = produk.title;
        clone.querySelector(".produk-harga").innerText = `Rp ${Math.round(produk.price * 16000).toLocaleString("id-ID")}`;

        // Event klik keranjang
        const keranjangIcon = clone.querySelector("img[alt='keranjang']");
        keranjangIcon.addEventListener("click", () => {
          const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

          const item = {
          id: produk.id,
          title: produk.title,
          price: Math.round(produk.price * 16000),
          thumbnail: produk.thumbnail,
          description: produk.description
        };

          const sudahAda = keranjang.find(p => p.id === item.id);
          if (!sudahAda) {
            keranjang.push(item);
            localStorage.setItem("keranjang", JSON.stringify(keranjang));
            alert(`${item.nama} berhasil dimasukkan ke keranjang!`);
          } else {
            alert(`${item.nama} sudah ada di keranjang.`);
          }
        });

        container.appendChild(clone);
      });
    } catch (error) {
      console.error("Gagal mengambil produk dari API:", error);
    }
  });