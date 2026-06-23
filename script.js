/* =========================
   GLOBAL
========================= */

let chartInstance = null;

/* =========================
   LOCAL STORAGE
========================= */

function getHistory() {

    return JSON.parse(
        localStorage.getItem('hppHistory')
    ) || [];
}

function saveHistory(data) {

    localStorage.setItem(
        'hppHistory',
        JSON.stringify(data)
    );
}

/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(angka) {

    return Number(
        angka || 0
    ).toLocaleString('id-ID');
}

/* =========================
   TAMBAH BAHAN
========================= */

function tambahBahan() {

    const container =
        document.getElementById(
            'bahanContainer'
        );

    const div =
        document.createElement('div');

    div.classList.add(
        'bahan-item'
    );

    div.innerHTML = `
        <input
            type="text"
            class="nama-bahan"
            placeholder="Nama Bahan"
        >

        <input
            type="number"
            class="harga-bahan"
            placeholder="Harga"
        >
    `;

    container.appendChild(div);
}

/* =========================
   TOTAL BAHAN
========================= */

function hitungTotalBahan() {

    let total = 0;

    document
        .querySelectorAll(
            '.harga-bahan'
        )
        .forEach(item => {

            total +=
                Number(item.value) || 0;
        });

    return total;
}

/* =========================
   TAMPILKAN HASIL
========================= */

function tampilkanHasil(
    total,
    hpp,
    jual
) {

    document.getElementById(
        'totalBiaya'
    ).textContent =
        'Rp ' +
        formatRupiah(
            Math.round(total)
        );

    document.getElementById(
        'hppCup'
    ).textContent =
        'Rp ' +
        formatRupiah(
            Math.round(hpp)
        );

    document.getElementById(
        'hargaJual'
    ).textContent =
        'Rp ' +
        formatRupiah(
            Math.round(jual)
        );
}

/* =========================
   SIMPAN RIWAYAT
========================= */

function simpanRiwayat(data) {

    const history =
        getHistory();

    history.unshift(data);

    saveHistory(history);

    tampilkanRiwayat();

    updateDashboard();

    updateSummary();

    updateRanking();
}

/* =========================
   HITUNG HPP
========================= */

function hitungHPP() {

    const namaProduk =
        document
            .getElementById(
                'namaMinuman'
            )
            .value
            .trim() ||
        'Tanpa Nama';

    const jumlahProduksi =
        Number(
            document.getElementById(
                'jumlahCup'
            ).value
        ) || 1;

    const biayaKemasan =
        Number(
            document.getElementById(
                'cup'
            ).value
        ) || 0;

    const biayaTambahan =
        Number(
            document.getElementById(
                'topping'
            ).value
        ) || 0;

    const biayaOperasional =
        Number(
            document.getElementById(
                'operasional'
            ).value
        ) || 0;

    const margin =
        Number(
            document.getElementById(
                'margin'
            ).value
        ) || 0;

    const totalBahan =
        hitungTotalBahan();

    const totalProduksi =
        totalBahan +
        biayaOperasional +
        (
            (
                biayaKemasan +
                biayaTambahan
            ) *
            jumlahProduksi
        );

    const hppPerPcs =
        totalProduksi /
        jumlahProduksi;

    const hargaJual =
        hppPerPcs +
        (
            hppPerPcs *
            margin / 100
        );

    const laba =
        hargaJual -
        hppPerPcs;

    tampilkanHasil(
        totalProduksi,
        hppPerPcs,
        hargaJual
    );

    simpanRiwayat({

        nama:
            namaProduk,

        total:
            Math.round(
                totalProduksi
            ),

        hpp:
            Math.round(
                hppPerPcs
            ),

        jual:
            Math.round(
                hargaJual
            ),

        laba:
            Math.round(
                laba
            ),

        margin:
            margin,

        tanggal:
            new Date()
            .toLocaleString(
                'id-ID'
            )
    });
}

/* =========================
   TAMPILKAN RIWAYAT
========================= */

function tampilkanRiwayat() {

    const list =
        document.getElementById(
            'historyList'
        );

    if (!list) return;

    const history =
        getHistory();

    if (history.length === 0) {

        list.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        color:#94a3b8;
                    "
                >
                    Belum ada riwayat perhitungan
                </td>
            </tr>
        `;

        return;
    }

    list.innerHTML = '';

    history.forEach(
        (item,index) => {

        list.innerHTML += `
            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${item.nama}
                </td>

                <td>
                    Rp ${formatRupiah(
                        item.hpp
                    )}
                </td>

                <td>
                    Rp ${formatRupiah(
                        item.jual
                    )}
                </td>

                <td>
                    Rp ${formatRupiah(
                        item.laba
                    )}
                </td>

                <td>
                    ${item.tanggal}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="
                            hapusItem(
                                ${index}
                            )
                        "
                    >
                        Hapus
                    </button>

                </td>

            </tr>
        `;
    });
}

/* =========================
   HAPUS PRODUK
========================= */

function hapusItem(index) {

    const konfirmasi =
        confirm(
            'Hapus produk ini?'
        );

    if (!konfirmasi) return;

    const history =
        getHistory();

    history.splice(
        index,
        1
    );

    saveHistory(
        history
    );

    tampilkanRiwayat();

    updateDashboard();

    updateSummary();

    updateRanking();
}

/* =========================
   HAPUS SEMUA RIWAYAT
========================= */

function hapusRiwayat() {

    const konfirmasi =
        confirm(
            'Yakin ingin menghapus semua data?'
        );

    if (!konfirmasi) return;

    localStorage.removeItem(
        'hppHistory'
    );

    tampilkanRiwayat();

    updateDashboard();

    updateSummary();

    updateRanking();

    document.getElementById(
        'totalBiaya'
    ).textContent =
        'Rp 0';

    document.getElementById(
        'hppCup'
    ).textContent =
        'Rp 0';

    document.getElementById(
        'hargaJual'
    ).textContent =
        'Rp 0';
}

/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard() {

    const history =
        getHistory();

    const totalProduk =
        document.getElementById(
            'totalProduk'
        );

    const totalProdukDashboard =
        document.getElementById(
            'totalProdukDashboard'
        );

    const avgMargin =
        document.getElementById(
            'avgMargin'
        );

    const avgMarginDashboard =
        document.getElementById(
            'avgMarginDashboard'
        );

    const avgProfit =
        document.getElementById(
            'avgProfit'
        );

    const avgProfitDashboard =
        document.getElementById(
            'avgProfitDashboard'
        );

    if (
        !totalProduk ||
        !avgMargin ||
        !avgProfit
    ) return;

    const jumlahProduk =
        history.length;

    totalProduk.textContent =
        jumlahProduk;

    if (
        totalProdukDashboard
    ) {

        totalProdukDashboard.textContent =
            jumlahProduk;
    }

    if (jumlahProduk === 0) {

        avgMargin.textContent =
            '0%';

        avgProfit.textContent =
            'Rp 0';

        if (
            avgMarginDashboard
        ) {

            avgMarginDashboard.textContent =
                '0%';
        }

        if (
            avgProfitDashboard
        ) {

            avgProfitDashboard.textContent =
                'Rp 0';
        }

        renderChart(
            [],
            []
        );

        return;
    }

    let totalMargin = 0;

    let totalLaba = 0;

    const labels = [];

    const profitData = [];

    history.forEach(item => {

        totalMargin +=
            item.margin || 0;

        totalLaba +=
            item.laba || 0;

        labels.push(
            item.nama
        );

        profitData.push(
            item.laba
        );
    });

    const rataMargin =
        Math.round(
            totalMargin /
            jumlahProduk
        );

    const rataProfit =
        Math.round(
            totalLaba /
            jumlahProduk
        );

    avgMargin.textContent =
        rataMargin + '%';

    avgProfit.textContent =
        'Rp ' +
        formatRupiah(
            rataProfit
        );

    if (
        avgMarginDashboard
    ) {

        avgMarginDashboard.textContent =
            rataMargin + '%';
    }

    if (
        avgProfitDashboard
    ) {

        avgProfitDashboard.textContent =
            'Rp ' +
            formatRupiah(
                rataProfit
            );
    }

    renderChart(
        labels.reverse(),
        profitData.reverse()
    );
}

/* =========================
   CHART LABA
========================= */

function renderChart(
    labels,
    profitData
) {

    const canvas =
        document.getElementById(
            'profitChart'
        );

    if (!canvas) return;

    if (
        chartInstance
    ) {

        chartInstance.destroy();
    }

    chartInstance =
        new Chart(
            canvas,
            {

            type:'bar',

            data:{

                labels,

                datasets:[
                    {
                        label:
                        'Laba Produk',

                        data:
                        profitData,

                        backgroundColor:
                        '#00d4aa',

                        borderRadius:
                        12,

                        borderSkipped:
                        false
                    }
                ]
            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{
                    legend:{
                        display:false
                    }
                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{

                            callback:
                            function(
                                value
                            ){

                                return (
                                    'Rp ' +
                                    formatRupiah(
                                        value
                                    )
                                );
                            }
                        }
                    }
                }
            }
        });
}

/* =========================
   RANKING PRODUK
========================= */

function updateRanking() {

    const rankingList =
        document.getElementById(
            'rankingList'
        );

    if (!rankingList) return;

    const history =
        getHistory();

    rankingList.innerHTML = '';

    if (history.length === 0) {

        rankingList.innerHTML = `
            <li>
                Belum ada data produk
            </li>
        `;

        return;
    }

    const sorted =
        [...history].sort(
            (a,b) =>
            b.laba - a.laba
        );

    sorted
        .slice(0,5)
        .forEach(item => {

        rankingList.innerHTML += `
            <li>

                <strong>
                    ${item.nama}
                </strong>

                <span>
                    Rp ${formatRupiah(
                        item.laba
                    )}
                </span>

            </li>
        `;
    });
}

/* =========================
   SUMMARY DASHBOARD
========================= */

function updateSummary() {

    const history =
        getHistory();

    const totalProfit =
        document.getElementById(
            'totalProfit'
        );

    const totalRevenue =
        document.getElementById(
            'totalRevenue'
        );

    if (
        !totalProfit ||
        !totalRevenue
    ) return;

    let profit = 0;
    let omzet = 0;

    history.forEach(item => {

        profit +=
            item.laba || 0;

        omzet +=
            item.jual || 0;
    });

    totalProfit.textContent =
        'Rp ' +
        formatRupiah(
            Math.round(profit)
        );

    totalRevenue.textContent =
        'Rp ' +
        formatRupiah(
            Math.round(omzet)
        );
}

/* =========================
   SEARCH PRODUK
========================= */

function searchProduk(keyword) {

    const rows =
        document.querySelectorAll(
            '#historyList tr'
        );

    rows.forEach(row => {

        const text =
            row.textContent
                .toLowerCase();

        row.style.display =
            text.includes(
                keyword.toLowerCase()
            )
            ? ''
            : 'none';
    });
}

/* =========================
   DARK MODE
========================= */

function toggleTheme() {

    document.body.classList.toggle(
        'light-mode'
    );

    const mode =
        document.body.classList.contains(
            'light-mode'
        )
        ? 'light'
        : 'dark';

    localStorage.setItem(
        'theme',
        mode
    );
}

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            'theme'
        );

    if (
        savedTheme === 'light'
    ) {

        document.body.classList.add(
            'light-mode'
        );
    }
}

/* =========================
   BACKUP JSON
========================= */

function backupData() {

    const history =
        getHistory();

    const blob =
        new Blob(
            [
                JSON.stringify(
                    history,
                    null,
                    2
                )
            ],
            {
                type:
                'application/json'
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            'a'
        );

    a.href = url;

    a.download =
        'hpp-backup.json';

    a.click();

    URL.revokeObjectURL(
        url
    );
}

/* =========================
   RESTORE JSON
========================= */

function restoreData(file) {

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function(event){

        try{

            const data =
                JSON.parse(
                    event.target.result
                );

            saveHistory(
                data
            );

            tampilkanRiwayat();

            updateDashboard();

            updateSummary();

            updateRanking();

            alert(
                'Data berhasil dipulihkan'
            );

        }catch(error){

            console.error(
                error
            );

            alert(
                'File backup tidak valid'
            );
        }
    };

    reader.readAsText(
        file
    );
}

/* =========================
   RESET FORM
========================= */

function resetForm() {

    document.getElementById(
        'namaMinuman'
    ).value = '';

    document.getElementById(
        'jumlahCup'
    ).value = 10;

    document.getElementById(
        'cup'
    ).value = 500;

    document.getElementById(
        'topping'
    ).value = 0;

    document.getElementById(
        'operasional'
    ).value = 0;

    document.getElementById(
        'margin'
    ).value = 50;

    document.getElementById(
        'bahanContainer'
    ).innerHTML = `
        <div class="bahan-item">

            <input
                type="text"
                class="nama-bahan"
                placeholder="Nama Bahan"
            >

            <input
                type="number"
                class="harga-bahan"
                placeholder="Harga"
            >

        </div>
    `;
}

/* =========================
   EXPORT EXCEL
========================= */

function exportExcel() {

    const history =
        getHistory();

    if (
        history.length === 0
    ) {

        alert(
            'Belum ada data'
        );

        return;
    }

    const data =
        history.map(
            (
                item,
                index
            ) => ({

                No:
                    index + 1,

                Produk:
                    item.nama,

                HPP:
                    item.hpp,

                HargaJual:
                    item.jual,

                Laba:
                    item.laba,

                Margin:
                    item.margin + '%',

                Tanggal:
                    item.tanggal
            })
        );

    const worksheet =
        XLSX.utils.json_to_sheet(
            data
        );

    worksheet['!cols'] = [

        { wch: 6 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 }
    ];

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Riwayat HPP'
    );

    XLSX.writeFile(
        workbook,
        'Laporan-HPP.xlsx'
    );
}

/* =========================
   EXPORT PDF TABEL
========================= */

async function exportPDF() {

    const history =
        getHistory();

    if (
        history.length === 0
    ) {

        alert(
            'Belum ada data'
        );

        return;
    }

    const {
        jsPDF
    } = window.jspdf;

    const pdf =
        new jsPDF(
            'l',
            'mm',
            'a4'
        );

    pdf.setFontSize(18);

    pdf.text(
        'Laporan HPP Produk',
        14,
        15
    );

    pdf.setFontSize(10);

    let startY = 30;

    /* HEADER */

    pdf.rect(10,startY,12,8);
    pdf.rect(22,startY,45,8);
    pdf.rect(67,startY,30,8);
    pdf.rect(97,startY,35,8);
    pdf.rect(132,startY,30,8);
    pdf.rect(162,startY,25,8);
    pdf.rect(187,startY,70,8);

    pdf.text('No',14,startY+5);
    pdf.text('Produk',25,startY+5);
    pdf.text('HPP',70,startY+5);
    pdf.text('Harga Jual',100,startY+5);
    pdf.text('Laba',135,startY+5);
    pdf.text('Margin',165,startY+5);
    pdf.text('Tanggal',190,startY+5);

    let y =
        startY + 8;

    history.forEach(
        (
            item,
            index
        ) => {

        pdf.rect(10,y,12,8);
        pdf.rect(22,y,45,8);
        pdf.rect(67,y,30,8);
        pdf.rect(97,y,35,8);
        pdf.rect(132,y,30,8);
        pdf.rect(162,y,25,8);
        pdf.rect(187,y,70,8);

        pdf.text(
            String(index + 1),
            14,
            y + 5
        );

        pdf.text(
            item.nama,
            25,
            y + 5
        );

        pdf.text(
            formatRupiah(
                item.hpp
            ),
            70,
            y + 5
        );

        pdf.text(
            formatRupiah(
                item.jual
            ),
            100,
            y + 5
        );

        pdf.text(
            formatRupiah(
                item.laba
            ),
            135,
            y + 5
        );

        pdf.text(
            item.margin + '%',
            165,
            y + 5
        );

        pdf.text(
            item.tanggal,
            190,
            y + 5
        );

        y += 8;

        if (
            y > 180
        ) {

            pdf.addPage();

            y = 20;
        }
    });

    pdf.save(
        'Laporan-HPP.pdf'
    );
}

/* =========================
   EVENT LISTENER
========================= */

function initEvents() {

    document
        .getElementById(
            'themeToggle'
        )
        ?.addEventListener(
            'click',
            toggleTheme
        );

    document
        .getElementById(
            'exportExcel'
        )
        ?.addEventListener(
            'click',
            exportExcel
        );

    document
        .getElementById(
            'exportPDF'
        )
        ?.addEventListener(
            'click',
            exportPDF
        );

    document
        .getElementById(
            'backupData'
        )
        ?.addEventListener(
            'click',
            backupData
        );

    document
        .getElementById(
            'restoreData'
        )
        ?.addEventListener(
            'click',
            () => {

                document
                    .getElementById(
                        'restoreFile'
                    )
                    .click();
            }
        );

    document
        .getElementById(
            'restoreFile'
        )
        ?.addEventListener(
            'change',
            e => {

                restoreData(
                    e.target.files[0]
                );
            }
        );

    document
        .getElementById(
            'searchProduct'
        )
        ?.addEventListener(
            'input',
            e => {

                searchProduk(
                    e.target.value
                );
            }
        );
}

/* =========================
   INIT APP
========================= */

function initApp() {

    loadTheme();

    tampilkanRiwayat();

    updateDashboard();

    updateSummary();

    updateRanking();

    initEvents();
}

/* =========================
   DOM READY
========================= */

document.addEventListener(
    'DOMContentLoaded',
    initApp
);