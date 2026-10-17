/**
 * app.js - Controller Logika Interaktif Grati-Ternak
 * Mendukung 2 Menu Utama: Broiler (Pedaging) & Layer (Petelur)
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

  // =========================================================================
  // 1. Inisialisasi Aplikasi
  // =========================================================================
  function init() {
    renderBroilerTable();
    renderLayerTable();
    setupEventListeners();
    setupLiveCalculations();
    startIoTSimulation();

    // Check URL Hash for deep link
    const hash = window.location.hash.toLowerCase();
    if (hash === '#layer' || hash === '#petelur') {
      switchModule('layer');
    } else {
      switchModule('broiler');
    }
  }

  // =========================================================================
  // 2. Perpindahan 2 Menu Utama (Broiler vs Petelur)
  // =========================================================================
  function switchModule(moduleName) {
    currentModule = moduleName;

    if (moduleName === 'broiler') {
      tabBtnBroiler.classList.add('active');
      tabBtnBroiler.setAttribute('aria-selected', 'true');
      tabBtnLayer.classList.remove('active');
      tabBtnLayer.setAttribute('aria-selected', 'false');

      panelBroiler.classList.add('active');
      panelLayer.classList.remove('active');

      pageHeading.textContent = `Dashboard Operasional: ${FARM_DATA.farmInfo.name} — Broiler`;
      pageSubHeading.textContent = 'Kelola data pakan, sampling berat, deplesi, dan kesehatan unggas dengan akurasi tinggi.';
      blockSelect.value = 'BLOK-A';

      if (mbarBtnBroiler && mbarBtnLayer) {
        mbarBtnBroiler.classList.add('active');
        mbarBtnLayer.classList.remove('active');
      }

      window.history.replaceState(null, '', '#broiler');
    } else {
      tabBtnLayer.classList.add('active');
      tabBtnLayer.setAttribute('aria-selected', 'true');
      tabBtnBroiler.classList.remove('active');
      tabBtnBroiler.setAttribute('aria-selected', 'false');

      panelLayer.classList.add('active');
      panelBroiler.classList.remove('active');

      pageHeading.textContent = `Dashboard Operasional: ${FARM_DATA.farmInfo.name} — Petelur`;
      pageSubHeading.textContent = 'Monitoring produksi telur harian, mutu kerabang, rasio pakan, dan proyeksi afkir.';
      blockSelect.value = 'BLOK-B';

      if (mbarBtnBroiler && mbarBtnLayer) {
        mbarBtnLayer.classList.add('active');
        mbarBtnBroiler.classList.remove('active');
      }

      window.history.replaceState(null, '', '#layer');
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
      modalTitle.textContent = 'Input Harian Kandang — Modul Broiler';
      modalSubTitle.textContent = 'Catat pakan, sampling bobot (BW), dan deplesi mortalitas hari ini.';
      formBroilerFields.style.display = 'grid';
      formLayerFields.style.display = 'none';
      if (modalTabBroiler) modalTabBroiler.classList.add('active');
      if (modalTabLayer) modalTabLayer.classList.remove('active');
      updateBroilerCalc();
    } else {
      modalTitle.textContent = 'Input Panen Harian — Modul Petelur (Layer)';
      modalSubTitle.textContent = 'Catat hasil panen telur utuh, retak, kotor, dan pakan harian.';
      formBroilerFields.style.display = 'none';
      formLayerFields.style.display = 'grid';
      if (modalTabLayer) modalTabLayer.classList.add('active');
      if (modalTabBroiler) modalTabBroiler.classList.remove('active');
      updateLayerCalc();
    }
  }

  function openRecordingModal(targetModule) {
    const mod = targetModule || currentModule;
    setModalModule(mod);

    try {
      if (typeof inputModal.showModal === 'function') {
        if (!inputModal.open) {
          inputModal.showModal();
        }
      } else {
        inputModal.setAttribute('open', '');
        inputModal.style.display = 'flex';
      }
    } catch (err) {
      inputModal.setAttribute('open', '');
      inputModal.style.display = 'flex';
    }
  }

  function closeModal() {
    try {
      if (typeof inputModal.close === 'function') {
        if (inputModal.open) {
          inputModal.close();
        }
      }
    } catch (err) {}
    inputModal.removeAttribute('open');
    inputModal.style.display = '';
  }

  // Live Calculations saat mengetik di form modal
  function setupLiveCalculations() {
    inpBroilerWeight.addEventListener('input', updateBroilerCalc);
    [inpLayerEggGradeA, inpLayerEggRetak, inpLayerEggKotor].forEach(el => {
      el.addEventListener('input', updateLayerCalc);
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

      showToast(`Data harian Broiler hari ke-${age} berhasil disimpan!`);
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
    link.setAttribute("download", `GratiTernak_${currentModule}_${new Date().toISOString().slice(0, 10)}.csv`);
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
  // 8. Event Listeners Setup
  // =========================================================================
  function setupEventListeners() {
    // Menu Switcher Clicks
    tabBtnBroiler.addEventListener('click', () => switchModule('broiler'));
    tabBtnLayer.addEventListener('click', () => switchModule('layer'));

    // Hero Simulator Tab Switcher
    const simTabBroiler = document.getElementById('simTabBroiler');
    const simTabLayer = document.getElementById('simTabLayer');

    function updateHeroSim(moduleName) {
      if (!simTabBroiler || !simTabLayer) return;
      if (moduleName === 'broiler') {
        simTabBroiler.classList.add('active');
        simTabLayer.classList.remove('active');
        document.getElementById('simLbl1').textContent = 'FCR Kumulatif';
        document.getElementById('simVal1').textContent = '1.48';
        document.getElementById('simDiff1').textContent = '-0.06 pt Efisien';

        document.getElementById('simLbl2').textContent = 'Bobot Sampling (BW)';
        document.getElementById('simVal2').textContent = '2.18 kg';
        document.getElementById('simDiff2').textContent = '+80g vs target';

        document.getElementById('simLbl3').textContent = 'Mortalitas';
        document.getElementById('simVal3').textContent = '1.12%';
        document.getElementById('simDiff3').textContent = 'Batas < 3.0%';

        document.getElementById('simLbl4').textContent = 'Indeks Performa (IP)';
        document.getElementById('simVal4').textContent = '418';
        document.getElementById('simDiff4').textContent = 'Grade Istimewa';
      } else {
        simTabLayer.classList.add('active');
        simTabBroiler.classList.remove('active');
        document.getElementById('simLbl1').textContent = 'Hen-Day (HDP)';
        document.getElementById('simVal1').textContent = '94.6%';
        document.getElementById('simDiff1').textContent = 'Puncak (Peak)';

        document.getElementById('simLbl2').textContent = 'Produksi Harian';
        document.getElementById('simVal2').textContent = '18.920 btr';
        document.getElementById('simDiff2').textContent = '630.6 Tray';

        document.getElementById('simLbl3').textContent = 'Pakan per Butir';
        document.getElementById('simVal3').textContent = '111 gram';
        document.getElementById('simDiff3').textContent = 'Hemat 3 gr';

        document.getElementById('simLbl4').textContent = 'Proyeksi Afkir';
        document.getElementById('simVal4').textContent = 'Mgg 78';
        document.getElementById('simDiff4').textContent = 'Sisa 32 Mgg';
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

    // Open Modal Triggers
    btnQuickRecord.addEventListener('click', openRecordingModal);
    btnInputHeader.addEventListener('click', openRecordingModal);
    btnRecordBroilerBottom.addEventListener('click', openRecordingModal);
    btnRecordLayerBottom.addEventListener('click', openRecordingModal);

    // Close Modal Triggers
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    formRecording.addEventListener('submit', handleFormSubmit);

    // Light dismiss for dialog (click on backdrop)
    inputModal.addEventListener('click', (e) => {
      if (e.target === inputModal) {
        closeModal();
      }
    });

    // Exports
    btnExportExcel.addEventListener('click', exportCSV);
    btnExportPDF.addEventListener('click', exportPDF);

    // Block dropdown change
    blockSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'BLOK-A') {
        switchModule('broiler');
        showToast('Beralih ke Blok A: Closed House Broiler');
      } else if (val === 'BLOK-B') {
        switchModule('layer');
        showToast('Beralih ke Blok B: Baterai Semi-Modern Petelur');
      } else {
        showToast('Menampilkan seluruh populasi kandang abah suar Farm');
      }
    });

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

    // Keyboard Shortcuts (1: Broiler, 2: Layer, N: New Input, Esc: Close)
    window.addEventListener('keydown', (e) => {
      if (inputModal.open) {
        if (e.key === 'Escape') closeModal();
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

  window.appSwitchModule = function (mod) {
    switchModule(mod);
    const dash = document.getElementById('dashboard');
    if (dash) {
      const navHeight = 65;
      const y = dash.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Run app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
