document.addEventListener("DOMContentLoaded", () => {
  const produkList = document.getElementById("produk-list");
  const subtotalEl = document.getElementById("subtotal");
  const totalRingkasanEl = document.getElementById("total-ringkasan");
  const ongkir = 20000;

  let subtotal = 0;
  let keranjang = JSON.parse(localStorage.getItem("produkDibeli")) || [];

// Normalize key names
keranjang = keranjang.map(item => ({
  ...item,
  image: item.image || item.thumbnail || "",
  quantity: item.quantity || item.qty || 1,
}));


  keranjang.forEach(item => {
    const totalHarga = item.price * item.quantity;
    subtotal += totalHarga;

    const itemContainer = document.createElement("div");
    itemContainer.className = "flex justify-between items-start gap-4 py-3 border-b";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.className = "w-25 h-25 object-cover rounded";

    const info = document.createElement("div");
    info.className = "flex-1";
    info.innerHTML = `
      <div class="font-semibold text-lg">${item.title}</div>
      <div class="text-lg text-gray-500 mt-4">${item.quantity} item</div>
    `;

    const priceEl = document.createElement("div");
    priceEl.className = "font-semibold text-lg";
    priceEl.textContent = formatRupiah(totalHarga);

    itemContainer.appendChild(img);
    itemContainer.appendChild(info);
    itemContainer.appendChild(priceEl);

    produkList.appendChild(itemContainer);
  });

  const total = subtotal + ongkir;
  subtotalEl.textContent = formatRupiah(subtotal);
  totalRingkasanEl.textContent = formatRupiah(total);

  function formatRupiah(angka) {
    return angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    });
  }

  // Tombol download invoice sebagai PNG
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const invoice = document.getElementById("invoice");
      if (!invoice) return;

      html2canvas(invoice).then(canvas => {
        const link = document.createElement("a");
        link.download = "bukti-pembayaran.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });
  }
});