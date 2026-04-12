import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Home() {
  const { settings } = useSettings();
  const isClosed = settings?.statusPendaftaran === 'Tutup';

  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white">

        {/* BACKGROUND */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${settings?.gambarHeaderBeranda || ''}')` }}
        />

        {/* GLOW EFFECT */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-500/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">

          {/* STATUS BADGE (NEON GLASS) */}
          <div className="inline-block mb-8">
            <div className="px-6 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-sm tracking-wide">
              {isClosed 
                ? `PPDB ${new Date().getFullYear()} TELAH DITUTUP` 
                : `PPDB ${new Date().getFullYear()} DIBUKA`}
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Wujudkan Masa Depan Gemilang <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Bersama {settings?.namaSekolah}
            </span>
          </h1>

          {/* DESC (CENTER RAPI) */}
          <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed mb-10">
            Bergabunglah di SMA Bintang Plus, sekolah unggulan yang membentuk generasi berprestasi, berkarakter, 
            dan siap menembus PTN, sekolah kedinasan, serta dunia profesional.
          </p>

          {/* BUTTON NEON */}
          {isClosed ? (
            <button className="px-10 py-4 rounded-full bg-slate-600 text-white cursor-not-allowed">
              Pendaftaran Ditutup
            </button>
          ) : (
            <Link
              to="/daftar"
              className="relative inline-block px-10 py-4 rounded-full font-semibold text-white 
              bg-gradient-to-r from-cyan-500 to-blue-600 
              shadow-[0_0_20px_rgba(0,200,255,0.6)] 
              hover:scale-105 transition-all duration-300"
            >
              Daftar Sekarang
            </Link>
          )}

        </div>
      </section>

      {/* FITUR */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="text-blue-500" size={32} />,
              title: "Kurikulum Modern",
              desc: "Berbasis kurikulum merdeka dan penguatan akademik menuju PTN."
            },
            {
              icon: <Users className="text-green-500" size={32} />,
              title: "Guru Profesional",
              desc: "Pengajar berpengalaman dan fokus pada pembinaan siswa."
            },
            {
              icon: <Trophy className="text-yellow-500" size={32} />,
              title: "Program Unggulan",
              desc: "Bimbingan intensif masuk PTN dan sekolah kedinasan."
            }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl border backdrop-blur-md bg-white/70 shadow-lg hover:shadow-xl transition">
              {f.icon}
              <h3 className="font-bold text-xl mt-4">{f.title}</h3>
              <p className="text-slate-600 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMBUTAN */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

          {/* FOTO */}
          <div className="relative">
            <img 
              src="https://bagus-supriyadi.biz.id/gambarbebas/20260412-115605_Famella%20in%20front%20of%20SMA%20Bintang%20Plus.png"
              className="rounded-2xl shadow-xl"
            />
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Sambutan Kepala Sekolah</h2>

            <p className="text-slate-600 leading-relaxed mb-4">
              Selamat datang di SMA Bintang Plus.
            </p>

            <p className="text-slate-600 leading-relaxed mb-4">
              Di sini, kami tidak sekadar mendidik siswa untuk lulus sekolah — kami mempersiapkan mereka untuk menang dalam kehidupan.
            </p>

            <p className="text-slate-600 leading-relaxed mb-4">
              Kami percaya, masa depan tidak ditentukan oleh keberuntungan, tetapi oleh lingkungan yang tepat dan pembinaan yang serius sejak sekarang.
            </p>

            <p className="text-slate-600 leading-relaxed mb-6 font-semibold">
              Mari bergabung bersama SMA Bintang Plus. Mulai langkah pasti menuju masa depan gemilang.
            </p>
          </div>

        </div>
      </section>

      {/* VISI MISI */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-3xl font-bold mb-8 text-center">Visi & Misi</h2>

          <div className="p-8 rounded-2xl bg-slate-50 shadow-md mb-8">
            <p className="italic text-center">
              “Menjadi lembaga pendidikan unggulan di Bandar Lampung yang membentuk generasi berkarakter mulia, cerdas, berdaya saing global, serta berjiwa pemimpin.”
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Menyelenggarakan pendidikan berkualitas tinggi berbasis teknologi dan literasi digital.",
              "Menanamkan karakter unggul: jujur, disiplin, tanggung jawab.",
              "Mengembangkan potensi akademik dan non-akademik.",
              "Membangun jiwa kepemimpinan dan kemandirian.",
              "Membangun kemitraan dengan dunia usaha dan perguruan tinggi.",
              "Mengantarkan siswa mencapai cita-cita terbaiknya."
            ].map((m, i) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle2 className="text-green-500 mt-1"/>
                <p>{m}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ALUR */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold">Alur Pendaftaran PPDB SMA</h2>
          <p className="text-slate-400 mt-2">
            Ikuti langkah berikut untuk mendaftar di {settings?.namaSekolah}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          {[
            "Isi Formulir",
            "Upload Berkas",
            "Verifikasi Data",
            "Pengumuman"
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:scale-105 transition">
              <div className="mb-3 text-cyan-400 font-bold">
                Langkah {i + 1}
              </div>
              <h3 className="font-semibold">{t}</h3>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
