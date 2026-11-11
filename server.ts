import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client if valid API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Financial Assistant Endpoint
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { prompt, financialContext, conversationHistory } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Build context summary from real user data
    const contextPrompt = `
Anda adalah "KantongKu Assistant", asisten keuangan cerdas, ramah, bijak, dan suportif khusus untuk pelajar dan mahasiswa di Indonesia.
Slogan KantongKu: "Kelola Uangmu, Atur Masa Depanmu!".
Gaya bahasa: Ramah, santun, memotivasi, praktis, to the point, menggunakan mata uang Rupiah (Rp), dan menggunakan data keuangan pengguna yang nyata.

DATA KEUANGAN PENGGUNA SAAT INI:
- Nama Pengguna: ${financialContext?.userName || 'Pelajar/Mahasiswa'}
- Periode Anggaran: ${financialContext?.budgetPeriod || 'Mingguan'} (${financialContext?.periodRange || '-'})
- Total Uang Saku/Anggaran: Rp ${(financialContext?.totalBudget || 0).toLocaleString('id-ID')}
- Total Pemasukan: Rp ${(financialContext?.totalIncome || 0).toLocaleString('id-ID')}
- Total Pengeluaran: Rp ${(financialContext?.totalExpense || 0).toLocaleString('id-ID')}
- Sisa Uang Saku/Saldo Tersedia: Rp ${(financialContext?.remainingBudget || 0).toLocaleString('id-ID')}
- Persentase Terpakai: ${(financialContext?.usagePercentage || 0).toFixed(1)}%
- Kategori Evaluasi: ${financialContext?.evaluationCategory || 'Belum dievaluasi'} (Hemat <80%, Teratur 80-100%, Melebihi >100%)
- Rekomendasi Batas Pengeluaran Harian: Rp ${(financialContext?.dailyRecommendation || 0).toLocaleString('id-ID')} per hari (sisa waktu: ${financialContext?.daysRemaining || 0} hari)
- Total Tabungan Terkumpul: Rp ${(financialContext?.totalSavings || 0).toLocaleString('id-ID')}
- Target Tabungan: ${JSON.stringify(financialContext?.savingGoals || [])}
- Rincian Pengeluaran per Kategori: ${JSON.stringify(financialContext?.categoryBreakdown || {})}
- Daftar Transaksi Terakhir: ${JSON.stringify(financialContext?.recentTransactions || [])}

ATURAN PENTING:
1. Jawab HANYA berdasarkan data keuangan nyata di atas jika pertanyaan menanyakan status keuangan pengguna.
2. Jika data belum memadai atau belum ada transaksi, jelaskan dengan jujur bahwa data transaksi masih kosong/belum cukup dan berikan langkah awal mencatat transaksi.
3. Berikan saran yang aplikatif untuk kehidupan anak sekolah/kuliah di Indonesia (misal: membawa bekal, memanfaatkan promo transportasi pelajar, membatasi kopi/jajan harian, menyisihkan uang kembalian).
4. Gunakan format yang rapi dan mudah dibaca (bullet points, angka tebal, rekomendasi tindakan konkret).
`;

    if (ai) {
      try {
        const fullPrompt = `${contextPrompt}\n\nRiwayat Percakapan Sebelumnya: ${JSON.stringify(
          conversationHistory || []
        )}\n\nPertanyaan Pengguna: ${prompt}`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), 4000)
        );

        const response = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: fullPrompt,
          }),
          timeoutPromise,
        ]);

        const reply = response.text || 'Maaf, saya tidak dapat menghasilkan respon saat ini.';
        return res.json({ reply, source: 'gemini' });
      } catch (geminiError) {
        console.warn('Gemini API request failed or timed out, falling back to smart local advisor:', geminiError);
        // Fall back to rule-based contextual advisor below
      }
    }

    // Smart Local Financial Advisor fallback (always works and uses exact real user data)
    const reply = generateSmartAdvisorReply(prompt, financialContext);
    return res.json({ reply, source: 'rule-based' });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

function generateSmartAdvisorReply(prompt: string, context: any): string {
  const q = prompt.toLowerCase();
  const name = context?.userName || 'Teman KantongKu';
  const remaining = Number(context?.remainingBudget || 0);
  const total = Number(context?.totalBudget || 0);
  const expense = Number(context?.totalExpense || 0);
  const percent = Number(context?.usagePercentage || 0);
  const dailyRec = Number(context?.dailyRecommendation || 0);
  const days = Number(context?.daysRemaining || 0);
  const savings = Number(context?.totalSavings || 0);
  const catBreakdown = context?.categoryBreakdown || {};

  // Find biggest spending category
  let topCat = '';
  let topAmount = 0;
  for (const [cat, amt] of Object.entries(catBreakdown)) {
    if (Number(amt) > topAmount) {
      topAmount = Number(amt);
      topCat = cat;
    }
  }

  if (q.includes('hemat') || q.includes('menghemat') || q.includes('tips')) {
    return `Halo ${name}! Berdasarkan analisis anggaranmu saat ini:

1. **Jaga Batas Harian**: Rekomendasi aman pengeluaranmu adalah **Rp ${dailyRec.toLocaleString('id-ID')}/hari** untuk ${days} hari tersisa.
${topCat ? `2. **Evaluasi Kategori Terbesar**: Pengeluaran terbesarmu saat ini ada di kategori **${topCat}** sebesar **Rp ${topAmount.toLocaleString('id-ID')}**. Coba kurangi sedikit porsi ini dengan opsi alternatif.` : '2. **Catat Setiap Pengeluaran**: Pastikan setiap jajan atau transportasi tercatat agar tidak ada kebocoran halus.'}
3. **Prinsip 3-Detik Sebelum Beli**: Saat tergoda membeli barang atau jajan di luar rencana, tunggu 3 detik dan tanyakan: "Apakah ini kebutuhan mendesak atau hanya keinginan sesaat?"
4. **Bawa Botol Minum & Bekal Sederhana**: Ini terbukti menghemat Rp 15.000–Rp 30.000 setiap hari di kampus/sekolah!

Kamu sudah menggunakan **${percent.toFixed(1)}%** dari anggaran. Tetap semangat mengelola uang saku! ✨`;
  }

  if (q.includes('meningkat') || q.includes('kenapa') || q.includes('mengapa') || q.includes('bengkak') || q.includes('evaluasi')) {
    if (expense === 0) {
      return `Halo ${name}, saat ini kamu belum memiliki catatan pengeluaran di periode ini. Yuk mulai catat pengeluaran pertamamu di menu Transaksi!`;
    }

    return `Analisis Pengeluaran untuk ${name}:
- **Total Pengeluaran**: Rp ${expense.toLocaleString('id-ID')} (${percent.toFixed(1)}% dari total anggaran Rp ${total.toLocaleString('id-ID')}).
- **Status Evaluasi**: ${percent <= 80 ? '🟢 **HEMAT** (Luar biasa, pengeluaran di bawah 80%!)' : percent <= 100 ? '🟡 **TERATUR** (Masih dalam batas wajar, namun mendekati batas)' : '🔴 **MELEBIHI ANGGARAN** (Sudah melebihi 100%, perlu rem belanja!)'}
${topCat ? `- **Penyumbang Terbesar**: Kategori **${topCat}** menyerap **Rp ${topAmount.toLocaleString('id-ID')}** (${((topAmount / expense) * 100).toFixed(0)}% dari total pengeluaranmu).` : ''}

**Rekomendasi Tindakan**:
Fokus prioritaskan kebutuhan pokok (makan & transportasi kuliah/sekolah) dan tunda pengeluaran hiburan sampai periode anggaran berikutnya.`;
  }

  if (q.includes('jajan') || q.includes('batas') || q.includes('harian') || q.includes('rekomendasi')) {
    return `Halo ${name}! Berdasarkan perhitungan matematis KantongKu:
- Sisa Anggaran: **Rp ${remaining.toLocaleString('id-ID')}**
- Sisa Waktu Periode: **${days} hari**
- 🎯 **Rekomendasi Batas Pengeluaran Harian**: **Rp ${dailyRec.toLocaleString('id-ID')} per hari**.

Tips jajan aman:
- Usahakan alokasi jajan maksimal 20–25% dari batas harianmu (sekitar Rp ${(dailyRec * 0.25).toLocaleString('id-ID')}).
- Jika hari ini kamu menghabiskan kurang dari batas tersebut, simpan sisa kuotanya atau alokasikan langsung ke Tabungan!`;
  }

  if (q.includes('tabung') || q.includes('target') || q.includes('tujuan') || q.includes('laptop')) {
    const goalsCount = context?.savingGoals?.length || 0;
    return `Halo ${name}! 
Saat ini total tabungan terkumpulmu adalah **Rp ${savings.toLocaleString('id-ID')}** tersebar di ${goalsCount} target impian.

**Strategi Mencapai Target Cepat**:
1. **Aturan "Sisa Anggaran"**: Di akhir minggu atau bulan, langsung alokasikan minimal 50% dari sisa saldo uang saku (saat ini tersedia Rp ${remaining.toLocaleString('id-ID')}) ke kantong tabunganmu.
2. **Tabung di Awal, Bukan Sisa**: Setiap kali menerima uang saku dari orang tua, langsung sisihkan 10%–20% ke target impian sebelum mulai dibelanjakan.
3. Gunakan fitur "Tambah Tabungan" di menu Tabungan setiap kali kamu mendapat uang tambahan atau hadiah!`;
  }

  return `Halo ${name}! Saya KantongKu Assistant siap mendampingi pengelolaan keuanganmu.

Saat ini:
• Sisa Uang Saku: **Rp ${remaining.toLocaleString('id-ID')}**
• Pengeluaran: **Rp ${expense.toLocaleString('id-ID')}** (${percent.toFixed(1)}%)
• Kuota Harian Aman: **Rp ${dailyRec.toLocaleString('id-ID')}/hari**
• Tabungan Terkumpul: **Rp ${savings.toLocaleString('id-ID')}**

Kamu bisa bertanya hal-hal seperti:
- *"Bagaimana cara menghemat uang saku minggu ini?"*
- *"Berapa batas jajan harian yang aman?"*
- *"Evaluasi pengeluaran terbesarku"*
- *"Cara cepat mencapai target tabunganku"*

Ada yang ingin kamu diskusikan tentang keuanganmu hari ini? 😊`;
}

// Vite middleware setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KantongKu Server running on http://localhost:${PORT}`);
  });
}

startServer();
