"use strict";

/**
 * RevoShop — Latihan Array Processing (forEach, map, filter, reduce).
 *
 * Data di bawah ini meniru bentuk response `Order.to_dict()` pada
 * backend/app/models/order.py (id, status, total_amount, shipping_address),
 * diambil dari data seed backend/1_checkpoint_revoshop_sql/seed.sql supaya
 * latihan ini terasa nyambung dengan data RevoShop yang sesungguhnya.
 */

/** @typedef {{ id: number, status: 'waiting'|'paid'|'shipped'|'delivered'|'cancelled', total_amount: number, shipping_address: string }} OrderLike */

/** @type {OrderLike[]} */
const ORDERS = [
  {
    id: 1,
    status: "delivered",
    total_amount: 1048000,
    shipping_address: "Jl. Merdeka No. 10, Medan",
  },
  {
    id: 2,
    status: "shipped",
    total_amount: 699000,
    shipping_address: "Jl. Sudirman No. 45, Jakarta Selatan",
  },
  {
    id: 3,
    status: "paid",
    total_amount: 485000,
    shipping_address: "Jl. Gatot Subroto No. 8, Bandung",
  },
  {
    id: 4,
    status: "waiting",
    total_amount: 120000,
    shipping_address: "Jl. Merdeka No. 10, Medan",
  },
  {
    id: 5,
    status: "cancelled",
    total_amount: 550000,
    shipping_address: "Jl. Diponegoro No. 22, Surabaya",
  },
  {
    id: 6,
    status: "delivered",
    total_amount: 505000,
    shipping_address: "Jl. Ahmad Yani No. 5, Medan",
  },
];

const STATUS_LABELS = {
  waiting: "Menunggu",
  paid: "Dibayar",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

/** @param {number} value */
function formatRupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

// ---------- reduce: ringkasan agregat ----------

function buildStats(orders) {
  return orders.reduce(
    (accumulator, order) => {
      accumulator.totalRevenue += order.total_amount;
      accumulator.orderCount += 1;
      if (order.status !== "cancelled") {
        accumulator.activeRevenue += order.total_amount;
      }
      return accumulator;
    },
    { totalRevenue: 0, activeRevenue: 0, orderCount: 0 },
  );
}

function renderStats() {
  const stats = buildStats(ORDERS);
  const averageOrderValue =
    stats.orderCount > 0 ? stats.totalRevenue / stats.orderCount : 0;

  const cards = [
    { label: "Jumlah Order", value: String(stats.orderCount) },
    { label: "Total Nilai Order", value: formatRupiah(stats.totalRevenue) },
    {
      label: "Nilai Order Aktif (non-cancelled)",
      value: formatRupiah(stats.activeRevenue),
    },
    {
      label: "Rata-rata per Order",
      value: formatRupiah(Math.round(averageOrderValue)),
    },
    {
      label: "Total Order Dibatalkan",
      value: String(ORDERS.filter((o) => o.status === "cancelled").length),
    },
    {
      label: "Total Order Menunggu",
      value: String(ORDERS.filter((o) => o.status === "waiting").length),
    },
    {
      label: "Total Order Selesai",
      value: String(ORDERS.filter((o) => o.status === "delivered").length),
    },
    {
      label: "Total Order Dikirim",
      value: String(ORDERS.filter((o) => o.status === "shipped").length),
    },
  ];

  const gridEl = document.getElementById("stats-grid");
  gridEl.innerHTML = "";

  // forEach: iterasi murni untuk efek samping (menambahkan elemen ke DOM),
  // tanpa membuat array baru.
  cards.forEach((card) => {
    const box = document.createElement("div");
    box.className = "stat-box";

    const label = document.createElement("span");
    label.className = "stat-box__label";
    label.textContent = card.label;

    const value = document.createElement("strong");
    value.className = "stat-box__value";
    value.textContent = card.value;

    box.append(label, value);
    gridEl.appendChild(box);
  });
}

// ---------- filter + map: order bernilai tinggi ----------

function renderHighlightOrders() {
  const HIGH_VALUE_THRESHOLD = 500000;

  const summaries = ORDERS
    // filter: hanya order dengan total >= threshold
    .filter((order) => order.total_amount >= HIGH_VALUE_THRESHOLD)
    // map: ubah setiap order jadi string ringkasan yang siap ditampilkan
    .map(
      (order) =>
        `Order #${order.id} · ${STATUS_LABELS[order.status]} · ${formatRupiah(order.total_amount)}`,
    );

  const listEl = document.getElementById("highlight-list");
  listEl.innerHTML = "";

  if (summaries.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "note-list__item";
    emptyItem.textContent = "Tidak ada order bernilai tinggi saat ini.";
    listEl.appendChild(emptyItem);
    return;
  }

  summaries.forEach((summaryText) => {
    const item = document.createElement("li");
    item.className = "note-list__item";
    item.textContent = summaryText;
    listEl.appendChild(item);
  });
}

// ---------- forEach + filter: tabel dengan filter status ----------

let activeStatusFilter = "all";

function renderOrderTable() {
  const tbody = document.getElementById("order-table-body");
  tbody.innerHTML = "";

  const visibleOrders =
    activeStatusFilter === "all"
      ? ORDERS
      : ORDERS.filter((order) => order.status === activeStatusFilter); // filter: sesuai status terpilih

  // forEach: efek samping murni (isi baris tabel), tidak butuh nilai balik.
  visibleOrders.forEach((order) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = `#${order.id}`;

    const statusCell = document.createElement("td");
    statusCell.textContent = STATUS_LABELS[order.status];

    const totalCell = document.createElement("td");
    totalCell.textContent = formatRupiah(order.total_amount);

    const addressCell = document.createElement("td");
    addressCell.textContent = order.shipping_address;

    row.append(idCell, statusCell, totalCell, addressCell);
    tbody.appendChild(row);
  });

  if (visibleOrders.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.textContent = "Tidak ada order dengan status ini.";
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
  }
}

function renderStatusFilters() {
  // map: bangun daftar status unik dari data order, lalu tambahkan opsi "Semua".
  const uniqueStatuses = ORDERS.map((order) => order.status).filter(
    (status, index, all) => all.indexOf(status) === index,
  );
  const filterOptions = ["all", ...uniqueStatuses];

  const container = document.getElementById("status-filters");
  container.innerHTML = "";

  filterOptions.forEach((statusOption) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn";
    button.classList.toggle("is-active", statusOption === activeStatusFilter);
    button.textContent =
      statusOption === "all" ? "Semua" : STATUS_LABELS[statusOption];

    button.addEventListener("click", () => {
      activeStatusFilter = statusOption;
      renderStatusFilters();
      renderOrderTable();
    });

    container.appendChild(button);
  });
}

function init() {
  renderStats();
  renderHighlightOrders();
  renderStatusFilters();
  renderOrderTable();
}

document.addEventListener("DOMContentLoaded", init);
