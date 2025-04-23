// Data gejala
const gejala = [
    "Buang air besar (lebih dari 2 kali)",
    "Berak encer",
    "Berak berdarah",
    "Lesu dan tidak bergairah",
    "Tidak selera makan",
    "Merasa mual dan sering muntah",
    "Merasa sakit di bagian perut",
    "Tekanan darah rendah",
    "Pusing",
    "Pingsan",
    "Suhu badan tinggi",
    "Luka di bagian tertentu",
    "Tidak dapat menggerakkan anggota badan tertentu",
    "Pernah memakan sesuatu",
    "Memakan daging",
    "Memakan jamur",
    "Memakan makanan kaleng",
    "Membeli susu",
    "Meminum susu"
  ];
  
  // Data penyakit
  const penyakit = {
    33: "Keracunan Staphylococcus aureus",
    34: "Keracunan jamur beracun",
    35: "Keracunan Salmonellae",
    36: "Keracunan Clostridium botulinum",
    37: "Keracunan Campylobacter"
  };
  
  // Aturan IF-THEN
  const rules = {
    Rule1: { IF: [1, 2], THEN: 20 },
    Rule2: { IF: [6, 7], THEN: 21 },
    Rule3: { IF: [7], THEN: 22 },
    Rule4: { IF: [8], THEN: 23 },
    Rule5: { IF: [9, 10], THEN: 24 },
    Rule6: { IF: [11], THEN: 25 },
    Rule7: { IF: [12], THEN: 26 },
    Rule8: { IF: [13], THEN: 27 },
    Rule9: { IF: [3, 1, 2], THEN: 28 },
    Rule10: { IF: [15], THEN: 29 },
    Rule11: { IF: [16], THEN: 30 },
    Rule12: { IF: [17], THEN: 31 },
    Rule13: { IF: [19], THEN: 32 }
  };
  
  // Basis pengetahuan: penyakit dan fakta prasyarat
  const basisPengetahuan = {
    33: [20, 21, 22, 23, 29],
    34: [20, 21, 22, 24, 30],
    35: [20, 21, 22, 25, 26, 29],
    36: [21, 27, 31],
    37: [28, 22, 25, 32]
  };
  
  // Keterangan fakta
  const faktaKeterangan = {
    20: "Buang air besar lebih dari 2 kali",
    21: "Berak encer",
    22: "Merasa sakit di bagian perut",
    23: "Tekanan darah rendah",
    24: "Pusing dan pingsan",
    25: "Suhu badan tinggi",
    26: "Luka di bagian tertentu",
    27: "Tidak dapat menggerakkan anggota badan tertentu",
    28: "Mencret berdarah",
    29: "Memakan daging",
    30: "Memakan jamur",
    31: "Memakan makanan kaleng",
    32: "Minum susu"
  };
  
  // Bobot gejala untuk metode bobot
  const bobotGejala = {
    20: [1, 2, 4, 5],
    21: [6, 7],
    22: [7],
    23: [8],
    24: [9, 10],
    25: [11],
    26: [12],
    27: [13],
    28: [3, 1, 2],
    29: [15],
    30: [16],
    31: [17],
    32: [19]
  };
  
  // Inisialisasi tampilan checkbox gejala
  window.onload = () => {
    const container = document.getElementById("pertanyaanContainer");
    gejala.forEach((text, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" name="g${index + 1}" value="y" />
          ${index + 1}. ${text}
        </label>
      `;
      container.appendChild(div);
    });
  
    document.getElementById("gejalaForm").addEventListener("submit", function(e) {
      e.preventDefault();
      diagnosa();
    });
  };
  
  // Fungsi diagnosa utama
  function diagnosa() {
    // Ambil fakta (gejala) yang dipilih
    const input = document.querySelectorAll("#gejalaForm input[type=checkbox]");
    const fakta = [];
    input.forEach((inp, i) => {
      if (inp.checked) fakta.push(i + 1);
    });
  
    let hasil = `<h2>Hasil Diagnosa</h2>`;
  
    // 1. Metode Aturan (Rule1)
    hasil += `<p><b>Metode Aturan:</b> `;
    const mencret = rules.Rule1.IF.every(g => fakta.includes(g));
    hasil += mencret ? "Terindikasi mencret." : "Tidak terindikasi mencret.";
    hasil += `</p>`;
  
    // 2. Forward Chaining
    let faktaBaru = [...fakta];
    let found;
    do {
      found = false;
      for (let key in rules) {
        const rule = rules[key];
        if (!faktaBaru.includes(rule.THEN)) {
          if (rule.IF.every(f => faktaBaru.includes(f))) {
            faktaBaru.push(rule.THEN);
            found = true;
          }
        }
      }
    } while (found);
  
    hasil += `<p><b>Forward Chaining:</b> `;
    if (faktaBaru.length > fakta.length) {
      const faktaBaruOnly = faktaBaru.slice(fakta.length);
      const keteranganFaktaBaru = faktaBaruOnly.map(kode => faktaKeterangan[kode] || `Kode ${kode}`);
      hasil += keteranganFaktaBaru.join(", ");
    } else {
      hasil += "Tidak ditemukan fakta baru.";
    }
    hasil += `</p>`;
  
    // 3. Backward Chaining
    hasil += `<p><b>Backward Chaining:</b> `;
    const targetPenyakit = Object.keys(penyakit);
    let hasilBC = [];
    targetPenyakit.forEach(t => {
      const prasyarat = basisPengetahuan[t];
      if (prasyarat.every(p => faktaBaru.includes(p))) {
        hasilBC.push(penyakit[t]);
      }
    });
    hasil += hasilBC.length ? hasilBC.join(", ") : "Tidak terbukti.";
    hasil += `</p>`;
  
    // 4. Metode Bobot
    hasil += `<p><b>Metode Bobot:</b><br>`;
    let skor = {};
    for (let p in basisPengetahuan) {
      let skorTemp = 0;
      basisPengetahuan[p].forEach(r => {
        if (bobotGejala[r]) {
          bobotGejala[r].forEach(g => {
            if (fakta.includes(g)) skorTemp += 1 / bobotGejala[r].length;
          });
        }
      });
      skor[p] = skorTemp;
    }
  
    const max = Math.max(...Object.values(skor));
    const hasilAkhir = Object.keys(skor).filter(k => skor[k] === max && max > 0);
  
    hasilAkhir.forEach(k => {
      hasil += `Kemungkinan ${penyakit[k]} dengan bobot ${skor[k].toFixed(2)}<br>`;
    });
  
    if (hasilAkhir.length === 0) hasil += "Tidak ada indikasi keracunan.";
  
    hasil += `</p>`;
  
    // Tampilkan hasil diagnosa
    document.getElementById("hasil").innerHTML = hasil;
  }  