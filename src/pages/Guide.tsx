import { motion } from 'motion/react';
import { FileText, CheckCircle2, AlertCircle, ArrowRight, FileImage, FileBadge, FileDigit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const iconMap = {
  FileDigit: FileDigit,
  FileBadge: FileBadge,
  FileImage: FileImage,
  FileText: FileText,
};

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  amber: 'bg-amber-100 text-amber-600',
  slate: 'bg-slate-100 text-slate-600',
};

const colorMap = {
  FileDigit: 'blue',
  FileBadge: 'green',
  FileImage: 'purple',
  FileText: 'amber',
};

export default function Guide() {
  const { settings } = useSettings();

  const judul = settings?.panduanJudul || "Panduan Pendaftaran PPDB SMA";
  const deskripsi = settings?.panduanDeskripsi || "Pastikan Anda telah menyiapkan seluruh dokumen berikut sebelum memulai proses pendaftaran.";
  const peringatan = settings?.panduanPeringatan || "Pastikan semua dokumen di-scan atau difoto dengan jelas dan dapat terbaca. Format file yang disarankan adalah JPG, PNG, atau PDF dengan ukuran maksimal 2MB per file.";

  const dokumen = settings?.panduanDokumen || [
    {
      id: "1",
      icon: "FileDigit",
      title: "Kartu Keluarga (KK)",
      description: "Fotokopi atau scan Kartu Keluarga yang masih berlaku."
    },
    {
      id: "2",
      icon: "FileBadge",
      title: "Akta Kelahiran",
      description: "Digunakan untuk verifikasi identitas dan data diri calon siswa."
    },
    {
      id: "3",
      icon: "FileImage",
      title: "Pas Foto 3x4",
      description: "Pas foto terbaru dengan latar belakang merah atau biru."
    },
    {
      id: "4",
      icon: "FileText",
      title: "Ijazah / SKL SMP/MTs",
      description: "Surat Keterangan Lulus atau Ijazah dari SMP/MTs."
    },
    {
      id: "5",
      icon: "FileText",
      title: "Raport SMP/MTs",
      description: "Raport semester terakhir sebagai bahan pertimbangan seleksi."
    }
  ];

  const alur = settings?.panduanAlur || [
    "Siapkan seluruh dokumen persyaratan dalam bentuk file digital (foto/scan).",
    "Klik tombol 'Mulai Pendaftaran' atau menu 'Daftar'.",
    "Isi formulir dengan data yang valid sesuai dokumen asli.",
    "Tentukan lokasi tempat tinggal melalui peta.",
    "Unggah semua dokumen yang diminta.",
    "Kirim formulir dan simpan nomor pendaftaran untuk cek status."
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">

        <motion.div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          {/* HEADER */}
          <div className="bg-blue-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{judul}</h1>
            <p className="text-blue-100">{deskripsi}</p>
          </div>

          <div className="p-8">

            {/* DOKUMEN */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex gap-2">
                <FileText className="text-blue-600" />
                Dokumen yang Harus Disiapkan
              </h2>

              <div className="bg-blue-50 p-4 rounded-xl mb-6 flex gap-3">
                <AlertCircle className="text-blue-600" />
                <p className="text-sm">{peringatan}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {dokumen.map((doc) => {
                  const Icon = iconMap[doc.icon as keyof typeof iconMap] || FileText;
                  const colorKey = colorMap[doc.icon as keyof typeof colorMap] || 'slate';
                  const colorClass = colorClasses[colorKey as keyof typeof colorClasses];

                  return (
                    <div key={doc.id} className="border p-5 rounded-xl flex gap-4">
                      <div className={`${colorClass} p-3 rounded-lg`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-sm text-slate-600">{doc.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ALUR */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex gap-2">
                <CheckCircle2 className="text-green-600" />
                Alur Pendaftaran
              </h2>

              {alur.map((step, i) => (
                <div key={i} className="flex gap-4 mb-3">
                  <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-full">
                    {i + 1}
                  </div>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="text-center">
              <Link to="/daftar" className="bg-blue-600 text-white px-8 py-4 rounded-full">
                Mulai Pendaftaran
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
