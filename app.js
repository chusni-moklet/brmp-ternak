/**
 * app.js - Controller Logika Interaktif Be-Ternak (Moklet)
 * Mendukung 2 Menu Utama: KUB Pedaging & KUB Petelur
 * Sesuai Dokumen Spesifikasi Desain & Standar Anti-Slop
 */

(function () {
  'use strict';

  // State Aplikasi
  let currentModule = 'broiler'; // 'broiler' | 'layer'
  let broilerRecords = [...FARM_DATA.broiler.records];
  let layerRecords = [...FARM_DATA.layer.records];

  // DOM Elements
  const tabBtnBroiler = document.getElementById('tabBtnBroiler');
  const tabBtnLayer = document.getElementById('tabBtnLayer');
  const panelBroiler = document.getElementById('panelBroiler');
  const panelLayer = document.getElementById('panelLayer');

  const pageHeading = document.getElementById('pageHeading');
  const pageSubHeading = document.getElementById('pageSubHeading');
  const blockSelect = document.getElementById('blockSelect');

  const btnQuickRecord = document.getElementById('btnQuickRecord');
  const btnInputHeader = document.getElementById('btnInputHeader');
  const btnRecordBroilerBottom = document.getElementById('btnRecordBroilerBottom');
  const btnRecordLayerBottom = document.getElementById('btnRecordLayerBottom');

  const btnExportExcel = document.getElementById('btnExportExcel');
  const btnExportPDF = document.getElementById('btnExportPDF');

  const inputModal = document.getElementById('inputModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const formRecording = document.getElementById('formRecording');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubTitle = document.getElementById('modalSubTitle');

  const formBroilerFields = document.getElementById('formBroilerFields');
  const formLayerFields = document.getElementById('formLayerFields');

  const tbodyBroiler = document.getElementById('tbodyBroiler');
  const tbodyLayer = document.getElementById('tbodyLayer');
  const toastContainer = document.getElementById('toastContainer');

  // Mobile Navigation & Quick Action Bar Elements
  const btnMobileNavToggle = document.getElementById('btnMobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const btnMobileQuickRecord = document.getElementById('btnMobileQuickRecord');
  const mbarBtnBroiler = document.getElementById('mbarBtnBroiler');
  const mbarBtnLayer = document.getElementById('mbarBtnLayer');
  const mbarBtnRecord = document.getElementById('mbarBtnRecord');

  // Modal Segment Switcher Tabs
  const modalTabBroiler = document.getElementById('modalTabBroiler');
  const modalTabLayer = document.getElementById('modalTabLayer');

  // Input Elements for Live Calculation
  const inpBroilerWeight = document.getElementById('inpBroilerWeight');
  const calcAdgVal = document.getElementById('calcAdgVal');

  const inpLayerEggGradeA = document.getElementById('inpLayerEggGradeA');
  const inpLayerEggRetak = document.getElementById('inpLayerEggRetak');
  const inpLayerEggKotor = document.getElementById('inpLayerEggKotor');
  const calcHdpVal = document.getElementById('calcHdpVal');

  // KMS (Kartu Menuju Sukses) State & Elements
  let currentKmsBatch = 'angkatan-1';
  let kmsBatches = (FARM_DATA.broiler && FARM_DATA.broiler.kms && Array.isArray(FARM_DATA.broiler.kms.batches))
    ? JSON.parse(JSON.stringify(FARM_DATA.broiler.kms.batches))
    : [];

  const kmsChartContainer = document.getElementById('kmsChartContainer');
  const tableKmsMatrix = document.getElementById('tableKmsMatrix');
  const kmsBatchSummary = document.getElementById('kmsBatchSummary');
  const kmsImageModal = document.getElementById('kmsImageModal');
  const kmsInputModal = document.getElementById('kmsInputModal');
  const formKmsInput = document.getElementById('formKmsInput');
  const kmsInputBatch = document.getElementById('kmsInputBatch');
  const kmsInputWeek = document.getElementById('kmsInputWeek');
  const kmsInputDate = document.getElementById('kmsInputDate');
  const kmsInputWeight = document.getElementById('kmsInputWeight');
  const kmsLiveTargetComparison = document.getElementById('kmsLiveTargetComparison');

  // =========================================================================
  // 1. Inisialisasi Aplikasi
  // =========================================================================
  function init() {
    renderBroilerTable();
    renderLayerTable();
    renderKmsModule();
    setupEventListeners();
    setupLiveCalculations();
    startIoTSimulation();

    // Check URL Hash for deep link
    const hash = (window.location && window.location.hash) ? window.location.hash.toLowerCase() : '';
    if (hash === '#layer' || hash === '#petelur') {
      switchModule('layer');
    } else {
      switchModule('broiler');
    }
  }

  // =========================================================================
  // 2. Perpindahan 2 Menu Utama (KUB Pedaging vs KUB Petelur)
  // =========================================================================
  function switchModule(moduleName) {
    currentModule = moduleName;

    if (moduleName === 'broiler') {
      if (tabBtnBroiler) {
        tabBtnBroiler.classList.add('active');
        tabBtnBroiler.setAttribute('aria-selected', 'true');
      }
      if (tabBtnLayer) {
        tabBtnLayer.classList.remove('active');
        tabBtnLayer.setAttribute('aria-selected', 'false');
      }

      if (panelBroiler) panelBroiler.classList.add('active');
      if (panelLayer) panelLayer.classList.remove('active');

      if (pageHeading) pageHeading.textContent = `Dashboard Operasional: ${FARM_DATA.farmInfo.name} — KUB Pedaging`;
      if (pageSubHeading) pageSubHeading.textContent = 'Kelola data pakan, sampling berat, deplesi, dan kesehatan unggas dengan akurasi tinggi.';
      if (blockSelect) blockSelect.value = 'BLOK-A';

      if (mbarBtnBroiler && mbarBtnLayer) {
        mbarBtnBroiler.classList.add('active');
        mbarBtnLayer.classList.remove('active');
      }

      try {
        if (window.history && typeof window.history.replaceState === 'function') {
          window.history.replaceState(null, '', '#broiler');
        }
      } catch (e) {}
    } else {
      if (tabBtnLayer) {
        tabBtnLayer.classList.add('active');
        tabBtnLayer.setAttribute('aria-selected', 'true');
      }
      if (tabBtnBroiler) {
        tabBtnBroiler.classList.remove('active');
        tabBtnBroiler.setAttribute('aria-selected', 'false');
      }

      if (panelLayer) panelLayer.classList.add('active');
      if (panelBroiler) panelBroiler.classList.remove('active');

      if (pageHeading) pageHeading.textContent = `Dashboard Operasional: ${FARM_DATA.farmInfo.name} — KUB Petelur`;
      if (pageSubHeading) pageSubHeading.textContent = 'Monitoring produksi telur harian, mutu kerabang, rasio pakan, dan proyeksi afkir.';
      if (blockSelect) blockSelect.value = 'BLOK-B';

      if (mbarBtnBroiler && mbarBtnLayer) {
        mbarBtnLayer.classList.add('active');
        mbarBtnBroiler.classList.remove('active');
      }

      try {
        if (window.history && typeof window.history.replaceState === 'function') {
          window.history.replaceState(null, '', '#layer');
        }
      } catch (e) {}
    }
  }

  // =========================================================================
  // 3. Render Tabel Data Rekaman
  // =========================================================================
  function renderBroilerTable() {
    tbodyBroiler.innerHTML = '';
    broilerRecords.forEach((item, index) => {
      const tr = document.createElement('tr');
      if (index === 0) {
        tr.style.backgroundColor = 'rgba(237, 247, 241, 0.4)';
      }
      tr.innerHTML = `
        <td>
          <span class="cell-date">${item.label}</span>
          <span class="cell-date-sub">${item.tanggal}</span>
        </td>
        <td>Hari ke-${item.umurHari}</td>
        <td>${item.pakanSak} sak <span style="color: #64748B;">(${item.pakanKg} kg)</span></td>
        <td class="cell-mono" style="color: ${item.mortalitasEkor > 10 ? '#B91C1C' : 'inherit'};">${item.mortalitasEkor} ekor</td>
        <td class="cell-mono">${item.bobotKg.toFixed(2)} kg</td>
        <td class="cell-mono">${item.fcrKumulatif.toFixed(2)}</td>
        <td>${item.suhuRH}</td>
        <td><span class="metric-badge badge-optimal">${item.status}</span></td>
      `;
      tbodyBroiler.appendChild(tr);
    });
  }

  function renderLayerTable() {
    tbodyLayer.innerHTML = '';
    layerRecords.forEach((item, index) => {
      const tr = document.createElement('tr');
      if (index === 0) {
        tr.style.backgroundColor = 'rgba(237, 247, 241, 0.4)';
      }
      tr.innerHTML = `
        <td>
          <span class="cell-date">${item.label}</span>
          <span class="cell-date-sub">${item.tanggal}</span>
        </td>
        <td>${item.umurMinggu}</td>
        <td class="cell-mono">${item.totalButir.toLocaleString('id-ID')} Butir</td>
        <td>${item.trayRak}</td>
        <td class="cell-mono">${item.gradeA.toLocaleString('id-ID')}</td>
        <td style="color: #B45309;">${item.retakAbnormal}</td>
        <td>${item.pakanKg} kg</td>
        <td class="cell-mono" style="color: #047857;">${item.hdpPersen.toFixed(1)}%</td>
        <td><span class="metric-badge badge-optimal">${item.status}</span></td>
      `;
      tbodyLayer.appendChild(tr);
    });
  }

  // =========================================================================
  // 4. Modal Dialog Pencatatan Harian
  // =========================================================================
  function setModalModule(mod) {
    if (mod === 'broiler') {
      modalTitle.textContent = 'Input Harian Kandang — Modul KUB Pedaging';
      modalSubTitle.textContent = 'Catat pakan, sampling bobot (BW), dan deplesi mortalitas hari ini.';
      formBroilerFields.style.display = 'grid';
      formLayerFields.style.display = 'none';
      if (modalTabBroiler) modalTabBroiler.classList.add('active');
      if (modalTabLayer) modalTabLayer.classList.remove('active');
      updateBroilerCalc();
    } else {
      modalTitle.textContent = 'Input Panen Harian — Modul KUB Petelur';
      modalSubTitle.textContent = 'Catat hasil panen telur utuh, retak, kotor, dan pakan harian.';
      formBroilerFields.style.display = 'none';
      formLayerFields.style.display = 'grid';
      if (modalTabLayer) modalTabLayer.classList.add('active');
      if (modalTabBroiler) modalTabBroiler.classList.remove('active');
      updateLayerCalc();
    }
  }

  function openRecordingModal(targetModule) {
    const mod = (typeof targetModule === 'string' && (targetModule === 'broiler' || targetModule === 'layer'))
      ? targetModule
      : currentModule;
    setModalModule(mod);

    if (!inputModal) return;

    try {
      if (typeof inputModal.showModal === 'function') {
        if (!inputModal.open) {
          inputModal.showModal();
        }
      } else {
        inputModal.setAttribute('open', '');
      }
    } catch (err) {
      inputModal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (!inputModal) return;
    try {
      if (typeof inputModal.close === 'function') {
        if (inputModal.open) {
          inputModal.close();
        }
      }
    } catch (err) {}
    inputModal.removeAttribute('open');
  }

  // Live Calculations saat mengetik di form modal
  function setupLiveCalculations() {
    if (inpBroilerWeight) inpBroilerWeight.addEventListener('input', updateBroilerCalc);
    [inpLayerEggGradeA, inpLayerEggRetak, inpLayerEggKotor].forEach(el => {
      if (el) el.addEventListener('input', updateLayerCalc);
    });
  }

  function updateBroilerCalc() {
    const val = parseFloat(inpBroilerWeight.value) || 2.18;
    const diffGr = Math.round((val - 2.18) * 1000);
    const adg = 66 + Math.max(-10, Math.min(20, Math.round(diffGr / 2)));
    calcAdgVal.textContent = `+${adg} gr/hari (Est. ADG)`;
  }

  function updateLayerCalc() {
    const gradeA = parseInt(inpLayerEggGradeA.value, 10) || 0;
    const retak = parseInt(inpLayerEggRetak.value, 10) || 0;
    const kotor = parseInt(inpLayerEggKotor.value, 10) || 0;
    const total = gradeA + retak + kotor;
    const tray = (total / 30).toFixed(1);
    const population = FARM_DATA.layer.currentPopulation || 9780;
    const hdp = ((total / population) * 100).toFixed(1);

    calcHdpVal.textContent = `${hdp}% (${tray} Tray)`;
  }

  // Handle Form Submission
  function handleFormSubmit(e) {
    e.preventDefault();

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const isBroilerActive = formBroilerFields.style.display !== 'none';

    if (isBroilerActive) {
      const age = parseInt(document.getElementById('inpBroilerAge').value, 10) || 34;
      const feedSak = parseFloat(document.getElementById('inpBroilerFeedSak').value) || 38;
      const mortality = parseInt(document.getElementById('inpBroilerMortality').value, 10) || 5;
      const weight = parseFloat(document.getElementById('inpBroilerWeight').value) || 2.25;
      const tempRh = document.getElementById('inpBroilerTempRh').value || '26.8°C / 62%';

      const newRecord = {
        tanggal: dateStr,
        label: "Catatan Baru",
        umurHari: age,
        pakanSak: feedSak,
        pakanKg: Math.round(feedSak * 50),
        mortalitasEkor: mortality,
        bobotKg: weight,
        fcrKumulatif: 1.47,
        suhuRH: tempRh,
        status: "Optimal"
      };

      broilerRecords.unshift(newRecord);
      renderBroilerTable();

      // Update KPI Top Card live
      const bwEl = document.getElementById('broilerBwVal');
      const fcrEl = document.getElementById('broilerFcrVal');
      if (bwEl) bwEl.textContent = weight.toFixed(2);
      if (fcrEl) fcrEl.textContent = '1.47';

      showToast(`Data harian KUB Pedaging hari ke-${age} berhasil disimpan!`);
    } else {
      const ageWeek = document.getElementById('inpLayerAgeWeek').value || 'Mgg ke-46';
      const feedKg = parseFloat(document.getElementById('inpLayerFeedKg').value) || 2100;
      const gradeA = parseInt(inpLayerEggGradeA.value, 10) || 18650;
      const retak = parseInt(inpLayerEggRetak.value, 10) || 215;
      const kotor = parseInt(inpLayerEggKotor.value, 10) || 75;
      const total = gradeA + retak + kotor;
      const tray = (total / 30).toFixed(1);
      const hdp = ((total / 9780) * 100).toFixed(1);

      const newRecord = {
        tanggal: dateStr,
        label: "Panen Baru",
        umurMinggu: ageWeek,
        totalButir: total,
        trayRak: `${tray} Tray`,
        gradeA: gradeA,
        retakAbnormal: retak + kotor,
        pakanKg: feedKg,
        hdpPersen: parseFloat(hdp),
        status: "Optimal"
      };

      layerRecords.unshift(newRecord);
      renderLayerTable();

      // Update KPI Top Card live
      document.getElementById('layerHdpVal').textContent = `${hdp}%`;
      document.getElementById('layerEggVal').textContent = total.toLocaleString('id-ID');

      // Update quality counters
      document.getElementById('countGradeA').textContent = gradeA.toLocaleString('id-ID');
      document.getElementById('countRetak').textContent = retak.toLocaleString('id-ID');
      document.getElementById('countKotor').textContent = kotor.toLocaleString('id-ID');

      showToast('Data panen telur Layer berhasil disimpan!');
    }

    closeModal();
  }

  // =========================================================================
  // 5. Ekspor Data CSV & Print PDF
  // =========================================================================
  function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (currentModule === 'broiler') {
      csvContent += "Tanggal,Label,Umur_Hari,Pakan_Sak,Pakan_Kg,Mortalitas_Ekor,Bobot_BW_Kg,FCR_Kumulatif,Suhu_RH,Status\r\n";
      broilerRecords.forEach(r => {
        csvContent += `"${r.tanggal}","${r.label}",${r.umurHari},${r.pakanSak},${r.pakanKg},${r.mortalitasEkor},${r.bobotKg},${r.fcrKumulatif},"${r.suhuRH}","${r.status}"\r\n`;
      });
    } else {
      csvContent += "Tanggal,Label,Umur_Minggu,Total_Butir,Tray_Rak,Grade_A,Retak_Abnormal,Pakan_Kg,HDP_Persen,Status\r\n";
      layerRecords.forEach(r => {
        csvContent += `"${r.tanggal}","${r.label}","${r.umurMinggu}",${r.totalButir},"${r.trayRak}",${r.gradeA},${r.retakAbnormal},${r.pakanKg},${r.hdpPersen},"${r.status}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BeTernak_${currentModule}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`File CSV untuk modul ${currentModule.toUpperCase()} berhasil diunduh!`);
  }

  function exportPDF() {
    window.print();
  }

  // =========================================================================
  // 6. Toast Notification UI Helper
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // =========================================================================
  // 7. IoT Micro Simulation (Real-time Feel)
  // =========================================================================
  function startIoTSimulation() {
    setInterval(() => {
      const tempEl = document.getElementById('sensorTemp');
      const humEl = document.getElementById('sensorHumidity');
      const windEl = document.getElementById('sensorWind');

      if (tempEl && humEl) {
        const randTemp = (26.7 + (Math.random() * 0.3)).toFixed(1);
        const randHum = Math.round(61 + (Math.random() * 2));
        const randWind = (2.0 + (Math.random() * 0.2)).toFixed(1);

        tempEl.textContent = `${randTemp}°C`;
        humEl.textContent = `${randHum}%`;
        if (windEl) windEl.textContent = `${randWind} m/s`;
      }
    }, 6000);
  }

  // =========================================================================
  // 7b. KMS (Kartu Menuju Sukses) Controller Logics — Standar BRMP Jawa Timur
  // =========================================================================
  function renderKmsModule() {
    setupKmsInputWeekOptions();
    renderKmsChart();
    renderKmsTable();
    updateKmsSummary();
  }

  function setupKmsInputWeekOptions() {
    if (!kmsInputWeek || kmsInputWeek.options.length > 0) return;
    const std = (FARM_DATA.broiler && FARM_DATA.broiler.kms && FARM_DATA.broiler.kms.standardWeeks) || [];
    std.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.week;
      opt.textContent = `Minggu ke-${s.week} (Standar BRMP: ${s.targetGram.toLocaleString('id-ID')} gr)`;
      kmsInputWeek.appendChild(opt);
    });
  }

  function renderKmsChart() {
    if (!kmsChartContainer) return;

    const stdWeeks = (FARM_DATA.broiler && FARM_DATA.broiler.kms && FARM_DATA.broiler.kms.standardWeeks) || [];
    const activeBatchObj = kmsBatches.find(b => b.id === currentKmsBatch) || kmsBatches[0];

    const width = 940;
    const height = 370;
    const padL = 60;
    const padR = 35;
    const padT = 25;
    const padB = 40;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const maxWeight = 2000;

    const getX = (weekNum) => padL + ((weekNum - 1) / 19) * chartW;
    const getY = (weightGr) => padT + chartH - (weightGr / maxWeight) * chartH;

    // Grid lines & Y Labels (0 to 2000)
    let gridLinesHtml = '';
    for (let w = 0; w <= maxWeight; w += 200) {
      const y = getY(w);
      gridLinesHtml += `
        <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3,3" />
        <text x="${padL - 10}" y="${y + 4}" fill="#64748B" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">${w.toLocaleString('id-ID')}</text>
      `;
    }

    // X Labels (Weeks 1 to 20)
    let xLabelsHtml = '';
    for (let wk = 1; wk <= 20; wk++) {
      const x = getX(wk);
      gridLinesHtml += `
        <line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + chartH}" stroke="#F8FAFC" stroke-width="1" />
      `;
      xLabelsHtml += `
        <text x="${x}" y="${padT + chartH + 20}" fill="#475569" font-size="11" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle">M${wk}</text>
      `;
    }

    // Standard curve (Navy Blue BRMP)
    const stdPoints = stdWeeks.map(sw => ({
      x: getX(sw.week),
      y: getY(sw.targetGram),
      week: sw.week,
      target: sw.targetGram
    }));

    const stdPathD = stdPoints.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const stdAreaD = `${stdPathD} L ${getX(20)} ${padT + chartH} L ${getX(1)} ${padT + chartH} Z`;

    let stdCirclesHtml = '';
    stdPoints.forEach(pt => {
      stdCirclesHtml += `
        <circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="#1E40AF" stroke="#FFFFFF" stroke-width="1.5">
          <title>Standar BRMP Minggu ${pt.week}: ${pt.target.toLocaleString('id-ID')} gr</title>
        </circle>
      `;
    });

    // Actual batch curve (Emerald Green)
    let actualPoints = [];
    if (activeBatchObj && Array.isArray(activeBatchObj.weights)) {
      activeBatchObj.weights.forEach((wt, idx) => {
        if (typeof wt === 'number' && !isNaN(wt)) {
          const wk = idx + 1;
          const std = stdWeeks[idx] ? stdWeeks[idx].targetGram : 0;
          actualPoints.push({
            x: getX(wk),
            y: getY(wt),
            week: wk,
            weight: wt,
            std: std,
            diff: wt - std
          });
        }
      });
    }

    let actualPathHtml = '';
    let actualCirclesHtml = '';
    let latestCalloutHtml = '';

    if (actualPoints.length > 0) {
      const actualPathD = actualPoints.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '');

      actualPathHtml = `
        <path d="${actualPathD}" fill="none" stroke="#059669" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      `;

      actualPoints.forEach((pt, i) => {
        const isLatest = (i === actualPoints.length - 1);
        const radius = isLatest ? 7 : 5;
        const color = pt.diff >= 0 ? '#10B981' : '#EF4444';
        actualCirclesHtml += `
          <circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); cursor: pointer;">
            <title>Minggu ${pt.week}: ${pt.weight} gr (Standar BRMP: ${pt.std} gr • ${pt.diff >= 0 ? '+' : ''}${pt.diff} gr)</title>
          </circle>
        `;

        if (isLatest) {
          latestCalloutHtml = `
            <g transform="translate(${pt.x}, ${pt.y - 14})">
              <rect x="-48" y="-22" width="96" height="20" rx="4" fill="#062516" />
              <text x="0" y="-8" fill="#FDE047" font-size="10.5" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle">Mgg ${pt.week}: ${pt.weight}g</text>
            </g>
          `;
        }
      });
    }

    const svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grafik KMS Pertumbuhan Ayam KUB">
        <defs>
          <linearGradient id="kmsStdGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E40AF" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#1E40AF" stop-opacity="0.01" />
          </linearGradient>
        </defs>

        <!-- Background grid -->
        ${gridLinesHtml}
        ${xLabelsHtml}

        <!-- Axes base lines -->
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="#CBD5E1" stroke-width="1.5" />
        <line x1="${padL}" y1="${padT + chartH}" x2="${width - padR}" y2="${padT + chartH}" stroke="#CBD5E1" stroke-width="1.5" />

        <!-- Standard Target Area & Path -->
        <path d="${stdAreaD}" fill="url(#kmsStdGrad)" />
        <path d="${stdPathD}" fill="none" stroke="#1E40AF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        ${stdCirclesHtml}

        <!-- Actual Batch Path & Dots -->
        ${actualPathHtml}
        ${actualCirclesHtml}
        ${latestCalloutHtml}

        <!-- Axis labels -->
        <text x="${padL}" y="${padT - 10}" fill="#0F172A" font-size="11" font-weight="700">Bobot (Gram)</text>
        <text x="${width - padR}" y="${padT + chartH + 34}" fill="#0F172A" font-size="11" font-weight="700" text-anchor="end">Umur (Minggu)</text>
      </svg>
    `;

    kmsChartContainer.innerHTML = svgHtml;
  }

  function renderKmsTable() {
    if (!tableKmsMatrix) return;

    const stdWeeks = (FARM_DATA.broiler && FARM_DATA.broiler.kms && FARM_DATA.broiler.kms.standardWeeks) || [];
    const activeBatchObj = kmsBatches.find(b => b.id === currentKmsBatch) || kmsBatches[0];

    let theadHtml = `
      <thead>
        <!-- Row 1: Umur (minggu) 1 to 20 -->
        <tr class="kms-row-week-header">
          <th scope="col" class="col-label">Umur (minggu)</th>
          ${stdWeeks.map(sw => `<th scope="col">${sw.week}</th>`).join('')}
        </tr>
        <!-- Row 2: Bobot baik (gr) -->
        <tr class="kms-row-standard">
          <th scope="row" class="col-label">Bobot baik (gr)</th>
          ${stdWeeks.map(sw => `<td>${sw.targetGram.toLocaleString('id-ID')}</td>`).join('')}
        </tr>
      </thead>
    `;

    // Row 3: Tanggal Penimbangan for current batch
    const activeDates = (activeBatchObj && Array.isArray(activeBatchObj.dates)) ? activeBatchObj.dates : [];
    let datesCells = '';
    for (let i = 0; i < 20; i++) {
      datesCells += `<td>${activeDates[i] || '-'}</td>`;
    }

    let tbodyHtml = `
      <tbody>
        <tr class="kms-row-dates">
          <th scope="row" class="col-label">Tanggal Penimbangan</th>
          ${datesCells}
        </tr>
    `;

    // Batch Rows: Angkatan I s/d IV
    kmsBatches.forEach(batch => {
      const isSelected = batch.id === currentKmsBatch;
      const rowClass = `kms-row-batch ${isSelected ? 'active-batch-row' : ''}`;

      let weightCells = '';
      for (let i = 0; i < 20; i++) {
        const wt = (batch.weights && batch.weights[i] !== undefined) ? batch.weights[i] : null;
        const target = stdWeeks[i] ? stdWeeks[i].targetGram : 0;

        if (typeof wt === 'number' && !isNaN(wt)) {
          const diff = wt - target;
          const isOptimal = diff >= 0;
          const badgeClass = isOptimal ? 'kms-cell-optimal' : 'kms-cell-alert';
          const sign = diff >= 0 ? '+' : '';
          weightCells += `
            <td>
              <span class="kms-cell-pill ${badgeClass}">
                <strong>${wt}</strong> <span style="font-size: 0.68rem; opacity: 0.85;">(${sign}${diff})</span>
              </span>
            </td>
          `;
        } else {
          weightCells += `<td style="color: #94A3B8;">-</td>`;
        }
      }

      tbodyHtml += `
        <tr class="${rowClass}">
          <th scope="row" class="col-label">
            ${isSelected ? '👉 ' : ''}${batch.name}
          </th>
          ${weightCells}
        </tr>
      `;
    });

    tbodyHtml += `</tbody>`;
    tableKmsMatrix.innerHTML = theadHtml + tbodyHtml;
  }

  function updateKmsSummary() {
    if (!kmsBatchSummary) return;

    const stdWeeks = (FARM_DATA.broiler && FARM_DATA.broiler.kms && FARM_DATA.broiler.kms.standardWeeks) || [];
    const activeBatchObj = kmsBatches.find(b => b.id === currentKmsBatch) || kmsBatches[0];

    if (!activeBatchObj || !Array.isArray(activeBatchObj.weights)) {
      kmsBatchSummary.innerHTML = `<span class="metric-badge">Pilih Angkatan</span>`;
      return;
    }

    let latestIdx = -1;
    for (let i = activeBatchObj.weights.length - 1; i >= 0; i--) {
      if (typeof activeBatchObj.weights[i] === 'number') {
        latestIdx = i;
        break;
      }
    }

    if (latestIdx === -1) {
      kmsBatchSummary.innerHTML = `<span class="metric-badge">Belum ada catatan timbangan</span>`;
      return;
    }

    const weekNum = latestIdx + 1;
    const actualWt = activeBatchObj.weights[latestIdx];
    const stdWt = stdWeeks[latestIdx] ? stdWeeks[latestIdx].targetGram : 0;
    const diff = actualWt - stdWt;
    const sign = diff >= 0 ? '+' : '';
    const badgeType = diff >= 0 ? 'badge-optimal' : 'badge-danger';
    const statusText = diff >= 0 ? 'Sesuai / Di Atas Standar' : 'Perlu Peningkatan';

    kmsBatchSummary.innerHTML = `
      <span class="metric-badge ${badgeType}">
        Mgg ke-${weekNum}: <strong>${actualWt} gr</strong> (Target BRMP: ${stdWt} gr &bull; ${sign}${diff} gr) &bull; ${statusText}
      </span>
    `;
  }

  function selectKmsBatch(batchId) {
    currentKmsBatch = batchId;

    const tabs = document.querySelectorAll('.kms-tab-btn');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-batch') === batchId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const activeBatch = kmsBatches.find(b => b.id === batchId);
    renderKmsChart();
    renderKmsTable();
    updateKmsSummary();

    if (activeBatch) {
      showToast(`Menampilkan data KMS: ${activeBatch.name}`);
    }
  }

  function openKmsImageModal() {
    if (!kmsImageModal) return;
    try {
      if (typeof kmsImageModal.showModal === 'function') {
        if (!kmsImageModal.open) kmsImageModal.showModal();
      } else {
        kmsImageModal.setAttribute('open', '');
      }
    } catch (e) {
      kmsImageModal.setAttribute('open', '');
    }
  }

  function closeKmsImageModal() {
    if (!kmsImageModal) return;
    try {
      if (typeof kmsImageModal.close === 'function') {
        if (kmsImageModal.open) kmsImageModal.close();
      }
    } catch (e) {}
    kmsImageModal.removeAttribute('open');
  }

  function openKmsInputModal() {
    if (!kmsInputModal) return;

    if (kmsInputBatch) kmsInputBatch.value = currentKmsBatch;

    // Default date to today
    if (kmsInputDate) {
      const today = new Date().toISOString().slice(0, 10);
      kmsInputDate.value = today;
    }

    // Default next unrecorded week
    const activeBatchObj = kmsBatches.find(b => b.id === currentKmsBatch) || kmsBatches[0];
    let nextWeek = 1;
    if (activeBatchObj && Array.isArray(activeBatchObj.weights)) {
      for (let i = 0; i < 20; i++) {
        if (activeBatchObj.weights[i] === null || activeBatchObj.weights[i] === undefined) {
          nextWeek = i + 1;
          break;
        }
      }
    }

    if (kmsInputWeek) kmsInputWeek.value = nextWeek;
    if (kmsInputWeight) kmsInputWeight.value = '';

    updateKmsLiveComparison();

    try {
      if (typeof kmsInputModal.showModal === 'function') {
        if (!kmsInputModal.open) kmsInputModal.showModal();
      } else {
        kmsInputModal.setAttribute('open', '');
      }
    } catch (e) {
      kmsInputModal.setAttribute('open', '');
    }
  }

  function closeKmsInputModal() {
    if (!kmsInputModal) return;
    try {
      if (typeof kmsInputModal.close === 'function') {
        if (kmsInputModal.open) kmsInputModal.close();
      }
    } catch (e) {}
    kmsInputModal.removeAttribute('open');
  }

  function updateKmsLiveComparison() {
    if (!kmsLiveTargetComparison || !kmsInputWeek) return;

    const wk = parseInt(kmsInputWeek.value, 10) || 1;
    const stdWeeks = (FARM_DATA.broiler && FARM_DATA.broiler.kms && FARM_DATA.broiler.kms.standardWeeks) || [];
    const stdObj = stdWeeks.find(s => s.week === wk);
    const targetGr = stdObj ? stdObj.targetGram : 0;

    const inputWt = parseFloat(kmsInputWeight ? kmsInputWeight.value : 0);

    if (!inputWt || isNaN(inputWt)) {
      kmsLiveTargetComparison.textContent = `Target Standar BRMP Minggu ${wk}: ${targetGr.toLocaleString('id-ID')} gr`;
      kmsLiveTargetComparison.style.color = '#B45309';
      return;
    }

    const diff = Math.round(inputWt - targetGr);
    const sign = diff >= 0 ? '+' : '';
    if (diff >= 0) {
      kmsLiveTargetComparison.textContent = `Target: ${targetGr} gr • Input: ${inputWt} gr (${sign}${diff} gr di atas standar / Sangat Baik)`;
      kmsLiveTargetComparison.style.color = '#047857';
    } else {
      kmsLiveTargetComparison.textContent = `Target: ${targetGr} gr • Input: ${inputWt} gr (${diff} gr di bawah standar / Evaluasi Pakan)`;
      kmsLiveTargetComparison.style.color = '#B91C1C';
    }
  }

  function handleKmsInputSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const batchId = kmsInputBatch ? kmsInputBatch.value : currentKmsBatch;
    const wk = parseInt(kmsInputWeek.value, 10);
    const wt = parseFloat(kmsInputWeight.value);
    const dateVal = kmsInputDate.value;

    if (!wk || isNaN(wt) || wt <= 0) {
      showToast('Harap masukkan angka bobot yang valid');
      return;
    }

    const targetBatch = kmsBatches.find(b => b.id === batchId);
    if (!targetBatch) return;

    const idx = wk - 1;
    if (idx >= 0 && idx < 20) {
      targetBatch.weights[idx] = wt;

      // format date to DD/MM
      if (dateVal) {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
          targetBatch.dates[idx] = `${parts[2]}/${parts[1]}`;
        }
      }

      currentKmsBatch = batchId;
      renderKmsChart();
      renderKmsTable();
      updateKmsSummary();

      closeKmsInputModal();
      showToast(`Data timbangan Minggu ke-${wk} (${wt} gr) berhasil dicatat untuk ${targetBatch.name}!`);
    }
  }

  // =========================================================================
  // 8. Event Listeners Setup
  // =========================================================================
  function setupEventListeners() {
    // Menu Switcher Clicks
    if (tabBtnBroiler) tabBtnBroiler.addEventListener('click', () => switchModule('broiler'));
    if (tabBtnLayer) tabBtnLayer.addEventListener('click', () => switchModule('layer'));

    // Hero Simulator Tab Switcher
    const simTabBroiler = document.getElementById('simTabBroiler');
    const simTabLayer = document.getElementById('simTabLayer');

    function updateHeroSim(moduleName) {
      if (!simTabBroiler || !simTabLayer) return;
      if (moduleName === 'broiler') {
        simTabBroiler.classList.add('active');
        simTabLayer.classList.remove('active');
        const s1 = document.getElementById('simLbl1'); if (s1) s1.textContent = 'FCR Kumulatif';
        const v1 = document.getElementById('simVal1'); if (v1) v1.textContent = '1.48';
        const d1 = document.getElementById('simDiff1'); if (d1) d1.textContent = '-0.06 pt Efisien';

        const s2 = document.getElementById('simLbl2'); if (s2) s2.textContent = 'Bobot Sampling (BW)';
        const v2 = document.getElementById('simVal2'); if (v2) v2.textContent = '2.18 kg';
        const d2 = document.getElementById('simDiff2'); if (d2) d2.textContent = '+80g vs target';

        const s3 = document.getElementById('simLbl3'); if (s3) s3.textContent = 'Mortalitas';
        const v3 = document.getElementById('simVal3'); if (v3) v3.textContent = '1.12%';
        const d3 = document.getElementById('simDiff3'); if (d3) d3.textContent = 'Batas < 3.0%';

        const s4 = document.getElementById('simLbl4'); if (s4) s4.textContent = 'Indeks Performa (IP)';
        const v4 = document.getElementById('simVal4'); if (v4) v4.textContent = '418';
        const d4 = document.getElementById('simDiff4'); if (d4) d4.textContent = 'Grade Istimewa';
      } else {
        simTabLayer.classList.add('active');
        simTabBroiler.classList.remove('active');
        const s1 = document.getElementById('simLbl1'); if (s1) s1.textContent = 'Hen-Day (HDP)';
        const v1 = document.getElementById('simVal1'); if (v1) v1.textContent = '94.6%';
        const d1 = document.getElementById('simDiff1'); if (d1) d1.textContent = 'Puncak (Peak)';

        const s2 = document.getElementById('simLbl2'); if (s2) s2.textContent = 'Produksi Harian';
        const v2 = document.getElementById('simVal2'); if (v2) v2.textContent = '18.920 btr';
        const d2 = document.getElementById('simDiff2'); if (d2) d2.textContent = '630.6 Tray';

        const s3 = document.getElementById('simLbl3'); if (s3) s3.textContent = 'Pakan per Butir';
        const v3 = document.getElementById('simVal3'); if (v3) v3.textContent = '111 gram';
        const d3 = document.getElementById('simDiff3'); if (d3) d3.textContent = 'Hemat 3 gr';

        const s4 = document.getElementById('simLbl4'); if (s4) s4.textContent = 'Proyeksi Afkir';
        const v4 = document.getElementById('simVal4'); if (v4) v4.textContent = 'Mgg 78';
        const d4 = document.getElementById('simDiff4'); if (d4) d4.textContent = 'Sisa 32 Mgg';
      }
    }

    if (simTabBroiler && simTabLayer) {
      simTabBroiler.addEventListener('click', () => updateHeroSim('broiler'));
      simTabLayer.addEventListener('click', () => updateHeroSim('layer'));
    }

    // Split feature CTA buttons that navigate to dashboard and set module
    const btnGoToBroiler = document.getElementById('btnGoToBroiler');
    if (btnGoToBroiler) {
      btnGoToBroiler.addEventListener('click', () => {
        switchModule('broiler');
      });
    }

    const btnGoToLayer = document.getElementById('btnGoToLayer');
    if (btnGoToLayer) {
      btnGoToLayer.addEventListener('click', () => {
        switchModule('layer');
      });
    }

    // Open Modal Triggers (with null-checks & explicit module arguments)
    if (btnQuickRecord) {
      btnQuickRecord.addEventListener('click', () => openRecordingModal());
    }
    if (btnInputHeader) {
      btnInputHeader.addEventListener('click', () => openRecordingModal());
    }
    if (btnRecordBroilerBottom) {
      btnRecordBroilerBottom.addEventListener('click', () => openRecordingModal('broiler'));
    }
    if (btnRecordLayerBottom) {
      btnRecordLayerBottom.addEventListener('click', () => openRecordingModal('layer'));
    }

    // Close Modal Triggers
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    if (formRecording) formRecording.addEventListener('submit', handleFormSubmit);

    // Light dismiss for dialog (click on backdrop)
    if (inputModal) {
      inputModal.addEventListener('click', (e) => {
        if (e.target === inputModal) {
          closeModal();
        }
      });
    }

    // Exports
    if (btnExportExcel) btnExportExcel.addEventListener('click', exportCSV);
    if (btnExportPDF) btnExportPDF.addEventListener('click', exportPDF);

    // Block dropdown change
    if (blockSelect) {
      blockSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'BLOK-A') {
          switchModule('broiler');
          showToast('Beralih ke Blok A: Kandang KUB Pedaging');
        } else if (val === 'BLOK-B') {
          switchModule('layer');
          showToast('Beralih ke Blok B: Baterai KUB Petelur');
        } else {
          showToast('Menampilkan seluruh populasi kandang abah suar Farm');
        }
      });
    }

    // Mobile Navigation Drawer Toggle & Links
    if (btnMobileNavToggle && mobileNavDrawer) {
      const iconHamburger = btnMobileNavToggle.querySelector('.icon-hamburger');
      const iconClose = btnMobileNavToggle.querySelector('.icon-close');

      function toggleMobileMenu(forceClose = false) {
        const isOpen = forceClose ? false : !mobileNavDrawer.classList.contains('open');
        if (isOpen) {
          mobileNavDrawer.classList.add('open');
          mobileNavDrawer.setAttribute('aria-hidden', 'false');
          btnMobileNavToggle.setAttribute('aria-expanded', 'true');
          if (iconHamburger) iconHamburger.style.display = 'none';
          if (iconClose) iconClose.style.display = 'block';
          document.body.style.overflow = 'hidden';
        } else {
          mobileNavDrawer.classList.remove('open');
          mobileNavDrawer.setAttribute('aria-hidden', 'true');
          btnMobileNavToggle.setAttribute('aria-expanded', 'false');
          if (iconHamburger) iconHamburger.style.display = 'block';
          if (iconClose) iconClose.style.display = 'none';
          document.body.style.overflow = '';
        }
      }

      btnMobileNavToggle.addEventListener('click', () => toggleMobileMenu());

      // Close drawer on any link click
      const mobileNavLinks = mobileNavDrawer.querySelectorAll('.mobile-nav-link');
      mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => toggleMobileMenu(true));
      });

      // Quick Record button in mobile drawer
      if (btnMobileQuickRecord) {
        btnMobileQuickRecord.addEventListener('click', () => {
          toggleMobileMenu(true);
          openRecordingModal();
        });
      }
    }

    // Modal Switcher Tabs
    if (modalTabBroiler) {
      modalTabBroiler.addEventListener('click', () => setModalModule('broiler'));
    }
    if (modalTabLayer) {
      modalTabLayer.addEventListener('click', () => setModalModule('layer'));
    }

    // Mobile Bottom Quick Bar Actions
    if (mbarBtnBroiler) {
      mbarBtnBroiler.addEventListener('click', () => {
        window.appSwitchModule('broiler');
      });
    }

    if (mbarBtnLayer) {
      mbarBtnLayer.addEventListener('click', () => {
        window.appSwitchModule('layer');
      });
    }

    if (mbarBtnRecord) {
      mbarBtnRecord.addEventListener('click', () => {
        window.appOpenRecordingModal();
      });
    }

    // KMS Image Modal Triggers
    const btnOpenKmsModal = document.getElementById('btnOpenKmsModal');
    if (btnOpenKmsModal) {
      btnOpenKmsModal.addEventListener('click', openKmsImageModal);
    }
    const kmsModalCloseBtn = document.getElementById('kmsModalCloseBtn');
    if (kmsModalCloseBtn) {
      kmsModalCloseBtn.addEventListener('click', closeKmsImageModal);
    }
    if (kmsImageModal) {
      kmsImageModal.addEventListener('click', (e) => {
        if (e.target === kmsImageModal) closeKmsImageModal();
      });
    }

    // KMS Input Modal Triggers
    const btnInputKmsWeekly = document.getElementById('btnInputKmsWeekly');
    if (btnInputKmsWeekly) {
      btnInputKmsWeekly.addEventListener('click', openKmsInputModal);
    }
    if (formKmsInput) {
      formKmsInput.addEventListener('submit', handleKmsInputSubmit);
    }
    if (kmsInputModal) {
      kmsInputModal.addEventListener('click', (e) => {
        if (e.target === kmsInputModal) closeKmsInputModal();
      });
    }
    if (kmsInputWeek) {
      kmsInputWeek.addEventListener('change', updateKmsLiveComparison);
    }
    if (kmsInputWeight) {
      kmsInputWeight.addEventListener('input', updateKmsLiveComparison);
    }

    // Keyboard Shortcuts (1: Broiler, 2: Layer, N: New Input, Esc: Close)
    window.addEventListener('keydown', (e) => {
      if ((inputModal && inputModal.open) || (kmsImageModal && kmsImageModal.open) || (kmsInputModal && kmsInputModal.open)) {
        if (e.key === 'Escape') {
          closeModal();
          closeKmsImageModal();
          closeKmsInputModal();
        }
        return;
      }

      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === '1') {
        switchModule('broiler');
      } else if (e.key === '2') {
        switchModule('layer');
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openRecordingModal();
      }
    });
  }

  // Expose Global Helper Functions for Instant Mobile & Inline Access
  window.appOpenRecordingModal = function (mod) {
    openRecordingModal(mod);
  };

  window.appCloseModal = function () {
    closeModal();
  };

  window.appSetModalModule = function (mod) {
    setModalModule(mod);
  };

  window.appSelectKmsBatch = function (batchId) {
    selectKmsBatch(batchId);
  };

  window.appOpenKmsImageModal = function () {
    openKmsImageModal();
  };

  window.appCloseKmsImageModal = function () {
    closeKmsImageModal();
  };

  window.appOpenKmsInputModal = function () {
    openKmsInputModal();
  };

  window.appCloseKmsInputModal = function () {
    closeKmsInputModal();
  };

  window.appSwitchModule = function (mod) {
    switchModule(mod);
    const dash = document.getElementById('dashboard');
    if (dash && typeof dash.getBoundingClientRect === 'function') {
      const navHeight = 65;
      const pageY = window.pageYOffset || window.scrollY || 0;
      const y = dash.getBoundingClientRect().top + pageY - navHeight;
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  // Run app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
