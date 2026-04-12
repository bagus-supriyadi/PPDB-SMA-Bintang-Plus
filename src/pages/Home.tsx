import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, ChevronRight, CheckCircle2, Calendar, FileText, CheckSquare, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Home() {
  const { settings } = useSettings();
  const isClosed = settings?.statusPendaftaran === 'Tutup';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32">
        <div 
          className={`absolute inset-0 bg-cover bg-center ${settings?.gambarHeaderBeranda ? 'opacity-30' : 'opacity-5'}`}
          style={{ backgroundImage: `url('${settings?.gambarHeaderBeranda || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop'}')` }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/80 to-green-50/90"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">

          {/* STATUS */}
          <motion.div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 ${isClosed ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {isClosed ? `PPDB ${new Date().getFullYear()} Telah Ditutup` : `PPDB ${new Date().getFullYear()} Dibuka`}
          </motion.div>

          {/* TITLE */}
          <motion.h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Wujudkan Masa Depan Gemilang <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              Bersama {settings?.namaSekolah || 'SMA Bintang Plus'}
            </span>
          </motion.h1>

          {/* DESC */}
          <motion.p className="text-lg text-slate-600 mb-10">
            Bergabunglah di {settings?.namaSekolah || 'SMA Bintang Plus'}, 
            sekolah unggulan yang membentuk generasi berprestasi, berkarakter, 
            dan siap menembus PTN, sekolah kedinasan, serta dunia profesional.
          </motion.p>

          {/* BUTTON */}
          {isClosed ? (
            <button disabled className="bg-slate-400 text-white px-8 py-4 rounded-full">
              Pendaftaran Ditutup
            </button>
          ) : (
            <Link to="/daftar" className="bg-blue-600 text-white px-8 py-4 rounded-full">
              Daftar Sekarang
            </Link>
          )}

        </div>
      </section>

      {/* FITUR */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
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
              icon: <Trophy className="text-amber-500" size={32} />,
              title: "Program Unggulan",
              desc: "Bimbingan intensif masuk PTN, kedinasan, dan pengembangan karakter."
            }
          ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow">
              {f.icon}
              <h3 className="font-bold text-xl mt-4">{f.title}</h3>
              <p className="text-slate-600 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMBUTAN */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">

          <div>
            <h2 className="text-3xl font-bold mb-6">Sambutan Kepala Sekolah</h2>

            {settings?.sambutanKepalaSekolah?.split('\n').map((p, i) => (
              <p key={i} className="mb-4 text-slate-600">{p}</p>
            ))}

            <div className="flex items-center gap-4 mt-6">
              <img src={settings?.fotoKepalaSekolah} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="font-bold">{settings?.namaKepalaSekolah}</h4>
                <p className="text-sm text-slate-500">Kepala Sekolah</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl">
            <h3 className="font-bold text-2xl mb-4">Visi & Misi</h3>

            <p className="italic mb-4">{settings?.visiSekolah}</p>

            <ul className="space-y-2">
              {settings?.misiSekolah?.split('\n').map((m, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={20} className="text-green-500"/>
                  {m}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ALUR */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold">Alur Pendaftaran PPDB SMA</h2>
          <p className="text-slate-400 mt-2">
            Ikuti langkah berikut untuk mendaftar di {settings?.namaSekolah}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {[
            "Isi Formulir",
            "Upload Berkas (Ijazah SMP/MTs, KK, dll)",
            "Verifikasi",
            "Pengumuman"
          ].map((t, i) => (
            <div key={i} className="text-center">
              <div className="bg-slate-800 p-6 rounded-xl mb-4">{i+1}</div>
              <h3 className="font-bold">{t}</h3>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
