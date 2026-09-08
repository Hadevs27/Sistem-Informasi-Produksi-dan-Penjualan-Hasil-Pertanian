import { getOverallMetrics } from "@/lib/analytics";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const query = (lastMessage?.content || "").toLowerCase();

  const metrics = await getOverallMetrics();
  
  let responseText = "";

  // DETERMINISTIC INTENT ENGINE
  if (query.includes("untung") || query.includes("profit") || query.includes("laba")) {
    responseText = `Bulan ini, total keuntungan bersih mencapai Rp ${metrics.profit.toLocaleString("id-ID")}. Margin keuntungan berada pada level ${metrics.margin.toFixed(2)}% dari total pendapatan Rp ${metrics.revenue.toLocaleString("id-ID")}.`;
  } 
  else if (query.includes("turun") || query.includes("penurunan") || query.includes("decline") || query.includes("drop")) {
    if (metrics.margin < 20) {
      responseText = `Terdapat indikasi penurunan margin di bawah target 20% (Saat ini: ${metrics.margin.toFixed(2)}%). Sebaiknya Anda meninjau kembali biaya produksi (HPP) yang saat ini mencapai Rp ${metrics.totalCost.toLocaleString("id-ID")}.`;
    } else {
      responseText = `Berdasarkan data agregat, performa margin perusahaan masih sehat di angka ${metrics.margin.toFixed(2)}%. Anda dapat melihat rincian laporan penjualan untuk produk spesifik.`;
    }
  }
  else if (query.includes("performa") || query.includes("ringkas") || query.includes("performance") || query.includes("summary")) {
    responseText = `Ringkasan Performa:
- Total Pendapatan: Rp ${metrics.revenue.toLocaleString("id-ID")}
- Total Biaya: Rp ${metrics.totalCost.toLocaleString("id-ID")}
- Keuntungan Kotor: Rp ${metrics.profit.toLocaleString("id-ID")}
- Volume Produksi: ${metrics.productionVolume} unit
- Volume Penjualan: ${metrics.salesVolume} unit`;
  }
  else if (query.includes("habis") || query.includes("stok") || query.includes("stockout") || query.includes("risk")) {
    responseText = `Secara agregat, kami memantau pergerakan pada ${metrics.products} produk aktif. Silakan cek modul "Pusat Peringatan" (Smart Alerts) untuk melihat daftar produk spesifik yang saat ini memiliki stok kritis (di bawah 50 unit) atau berisiko kehabisan (stockout risk).`;
  }
  else if (query.includes("produksi") || query.includes("production")) {
    responseText = `Hingga saat ini, total volume produksi tercatat sebanyak ${metrics.productionVolume} unit dari semua lini produksi yang berjalan.`;
  }
  else {
    responseText = `Maaf, saya belum memiliki informasi yang cukup untuk menjawab pertanyaan tersebut secara spesifik. 
    
Topik yang dapat saya jawab meliputi:
- Ringkasan performa & pendapatan
- Analisis profit dan margin
- Risiko stok & produksi
- Peringatan anomali bisnis`;
  }

  // To keep compatibility with stream parsing on the client, we just return JSON and update the client
  return new Response(JSON.stringify({ text: responseText }), {
    headers: { "Content-Type": "application/json" }
  });
}
