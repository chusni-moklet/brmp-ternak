/**
 * data.js - Data Model & Benchmark Standar Peternakan
 * Be-Ternak / Moklet Sistem Manajemen Unggas Terpadu
 * Standard: KUB Pedaging & KUB Petelur
 */

const FARM_DATA = {
  farmInfo: {
    id: "FARM-PAS-001",
    name: "abah suar Farm",
    location: "Moklet, Pasuruan, Jawa Timur",
    totalCapacity: 20000,
    trialDaysLeft: 14,
    operator: {
      name: "chusni",
      role: "Pemilik Kandang",
      status: "Online"
    },
    activeBlock: "Blok A - Kandang KUB Pedaging (10.000 Ekor)",
    blocks: [
      { id: "BLOK-A", name: "Blok A - Kandang KUB Pedaging (10.000 Ekor)", type: "broiler", capacity: 10000 },
      { id: "BLOK-B", name: "Blok B - Baterai KUB Petelur (10.000 Ekor)", type: "layer", capacity: 10000 }
    ]
  },

  // 1. Modul KUB Pedaging
  broiler: {
    strain: "KUB Pedaging",
    chickInDate: "2026-09-14",
    currentAgeDays: 33,
    initialPopulation: 10000,
    currentPopulation: 9888,
    metrics: {
      fcrKumulatif: 1.48,
      fcrTarget: 1.54,
      fcrDiff: -0.06, // Efisien
      feedSavedTon: 1.2,
      rataBobotKg: 2.18,
      bobotTargetKg: 2.10,
      bobotDiffGram: 80,
      adgGramDay: 66,
      sampleEkorToday: 120,
      mortalitasKumulatifPersen: 1.12,
      mortalitasTotalEkor: 224,
      mortalitasBatasToleransi: 3.0,
      indeksPerforma: 418,
      ipCategory: "Istimewa",
      bonusKemitraan: true
    },
    iotSensors: {
      suhuC: 26.8,
      suhuTargetMin: 26.0,
      suhuTargetMax: 28.0,
      kelembabanRH: 62,
      kelembabanTargetMin: 60,
      kelembabanTargetMax: 70,
      kecepatanUdaraMs: 2.1,
      amoniaPpm: 12,
      statusKipas: "Aktif 4/4 Unit Inverter (Ventilasi Optimal)",
      statusLingkungan: "Normal"
    },
    kms: {
      instansi: "BRMP JAWA TIMUR",
      unit: "UNIT PERBIBITAN AYAM KUB",
      title: "KMS - KARTU MENUJU SUKSES",
      motto: "Timbanglah ayam anda (setiap minggu). Ayam sehat bobot bertambah semakin sukses dan menguntungkan",
      imagePath: "assets/kms-kub-pedaging.jpg",
      // Standard target weights (gram) for weeks 1 to 20 from official BRMP chart
      standardWeeks: [
        { week: 1, targetGram: 40 },
        { week: 2, targetGram: 70 },
        { week: 3, targetGram: 175 },
        { week: 4, targetGram: 280 },
        { week: 5, targetGram: 385 },
        { week: 6, targetGram: 490 },
        { week: 7, targetGram: 595 },
        { week: 8, targetGram: 700 },
        { week: 9, targetGram: 805 },
        { week: 10, targetGram: 910 },
        { week: 11, targetGram: 1015 },
        { week: 12, targetGram: 1120 },
        { week: 13, targetGram: 1225 },
        { week: 14, targetGram: 1330 },
        { week: 15, targetGram: 1435 },
        { week: 16, targetGram: 1540 },
        { week: 17, targetGram: 1640 },
        { week: 18, targetGram: 1740 },
        { week: 19, targetGram: 1840 },
        { week: 20, targetGram: 1940 }
      ],
      batches: [
        {
          id: "angkatan-1",
          name: "Angkatan I (Aktif)",
          isActive: true,
          dates: ["14/09", "21/09", "28/09", "05/10", "12/10", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
          weights: [44, 76, 185, 296, 408, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        },
        {
          id: "angkatan-2",
          name: "Angkatan II (Siklus Lalu)",
          isActive: false,
          dates: ["01/04", "08/04", "15/04", "22/04", "29/04", "06/05", "13/05", "20/05", "27/05", "03/06", "10/06", "17/06", "24/06", "01/07", "08/07", "15/07", "22/07", "29/07", "05/08", "12/08"],
          weights: [42, 72, 178, 284, 390, 500, 608, 715, 820, 925, 1030, 1135, 1240, 1345, 1450, 1555, 1650, 1755, 1850, 1955]
        },
        {
          id: "angkatan-3",
          name: "Angkatan III",
          isActive: false,
          dates: ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
          weights: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        },
        {
          id: "angkatan-4",
          name: "Angkatan IV",
          isActive: false,
          dates: ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
          weights: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        }
      ]
    },
    panenProyeksi: {
      siapPanenHari: 2,
      estimasiTonaseTon: 43.16,
      populasiSiapMuat: 19776,
      sisaPakanFinisherSak: 84,
      kecukupanPakanHari: 2.2,
      statusSuratJalan: "Surat Jalan Siap",
      armadaTruk: "Truk Bak 1 & 2 Terjadwal"
    },
    records: [
      {
        tanggal: "2026-10-17",
        label: "Hari Ini",
        umurHari: 33,
        pakanSak: 38,
        pakanKg: 1900,
        mortalitasEkor: 6,
        bobotKg: 2.18,
        fcrKumulatif: 1.48,
        suhuRH: "26.8°C / 62%",
        status: "Optimal"
      },
      {
        tanggal: "2026-10-16",
        label: "Kemarin",
        umurHari: 32,
        pakanSak: 37,
        pakanKg: 1850,
        mortalitasEkor: 7,
        bobotKg: 2.11,
        fcrKumulatif: 1.49,
        suhuRH: "27.0°C / 64%",
        status: "Optimal"
      },
      {
        tanggal: "2026-10-15",
        label: "2 hari lalu",
        umurHari: 31,
        pakanSak: 36,
        pakanKg: 1800,
        mortalitasEkor: 8,
        bobotKg: 2.03,
        fcrKumulatif: 1.50,
        suhuRH: "27.2°C / 65%",
        status: "Optimal"
      },
      {
        tanggal: "2026-10-14",
        label: "3 hari lalu",
        umurHari: 30,
        pakanSak: 35,
        pakanKg: 1750,
        mortalitasEkor: 5,
        bobotKg: 1.95,
        fcrKumulatif: 1.51,
        suhuRH: "26.9°C / 61%",
        status: "Optimal"
      },
      {
        tanggal: "2026-10-13",
        label: "4 hari lalu",
        umurHari: 29,
        pakanSak: 34,
        pakanKg: 1700,
        mortalitasEkor: 6,
        bobotKg: 1.87,
        fcrKumulatif: 1.51,
        suhuRH: "26.7°C / 63%",
        status: "Optimal"
      }
    ]
  },

  // 2. Modul KUB Petelur
  layer: {
    strain: "KUB Petelur",
    currentAgeWeeks: 46,
    initialPopulation: 10000,
    currentPopulation: 9780,
    metrics: {
      hdpPersen: 94.6,
      hdpStatus: "Puncak (Peak)",
      hdpStandardStrain: 92.0,
      hdpDiff: 2.6, // Unggul vs strain
      produksiTelurButir: 18920,
      totalTray: 630.6, // 30 butir per tray
      gradeAPersen: 98.4,
      pakanPerButirGram: 111,
      konsumsiPakanKg: 2100,
      hematPakanGramPerButir: 3,
      proyeksiAfkirMinggu: 78,
      sisaMingguProduktif: 32,
      marginStatus: "Prima"
    },
    klasifikasiTelur: {
      gradeAUtuhButir: 18618,
      gradeAPersen: 98.4,
      retakTipisButir: 220,
      retakPersen: 1.2,
      kotorAbnormalButir: 82,
      kotorPersen: 0.4
    },
    inventaris: {
      statusStok: "Stok Aman > 14 Hari",
      konsentratSak: 142,
      formulasiKonsentratPersen: 35,
      jagungTon: 8.4,
      kadarAirJagungPersen: 13.8,
      dedakTon: 3.2,
      eggTrayPcs: 1850,
      distribusiStatus: "Siap Distribusi Agen"
    },
    records: [
      {
        tanggal: "2026-10-17",
        label: "Hari Ini",
        umurMinggu: "Mgg ke-46",
        totalButir: 18920,
        trayRak: "630.6 Tray",
        gradeA: 18618,
        retakAbnormal: 220,
        pakanKg: 2100,
        hdpPersen: 94.6,
        status: "Optimal"
      },
      {
        tanggal: "2026-10-16",
        label: "Kemarin",
        umurMinggu: "Mgg ke-46",
        totalButir: 18880,
        trayRak: "629.3 Tray",
        gradeA: 18590,
        retakAbnormal: 210,
        pakanKg: 2095,
        hdpPersen: 94.4,
        status: "Optimal"
      },
      {
        tanggal: "2026-10-15",
        label: "2 hari lalu",
        umurMinggu: "Mgg ke-46",
        totalButir: 18840,
        trayRak: "628.0 Tray",
        gradeA: 18540,
        retakAbnormal: 215,
        pakanKg: 2100,
        hdpPersen: 94.2,
        status: "Optimal"
      },
      {
        tanggal: "2026-10-14",
        label: "3 hari lalu",
        umurMinggu: "Mgg ke-45",
        totalButir: 18910,
        trayRak: "630.3 Tray",
        gradeA: 18620,
        retakAbnormal: 205,
        pakanKg: 2090,
        hdpPersen: 94.5,
        status: "Optimal"
      }
    ]
  }
};
