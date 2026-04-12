import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle, XCircle, Clock, Loader2, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkStatus } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSettings } from '../context/SettingsContext';

export default function CheckStatus() {
  const { settings } = useSettings();

  const [noPendaftaran, setNoPendaftaran] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!noPendaftaran.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await checkStatus(noPendaftaran);

      if (response.status === 'success') {
        setResult(response.data);
      } else {
        setError(response.message || 'Data tidak ditemukan');
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // PRINT PDF KELULUSAN
  // =========================
  const printBuktiLulus = (data: any) => {
    if (!data) return;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BUKTI KELULUSAN PPDB SMA', 105, y, { align: 'center' });

    y += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(settings?.namaSekolah || 'SMA Bintang Plus', 105, y, { align: 'center' });

    y += 10;

    doc.line(20, y, 190, y);
    y += 10;

    doc.text('Dengan ini menyatakan bahwa:', 20, y);
    y += 10;

    doc.text(`No. Pendaftaran : ${data.noPendaftaran}`, 20, y);
    y += 8;

    doc.text(`Nama Lengkap   : ${data.namaLengkap}`, 20, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 128, 0);
    doc.text('STATUS : LULUS', 20, y);

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    y += 15;

    const syarat = settings?.persyaratanDaftarUlang ||
      '1. Cetak bukti ini\n2. Membawa dokumen asli\n3. Melakukan daftar ulang';

    const split = doc.splitTextToSize(syarat, 170);
    doc.text(split, 20, y);

    y += split.length * 6 + 20;

    doc.text(`Kepala Sekolah`, 140, y);
    y += 25;

    doc.setFont('helvetica', 'bold');
    doc.text(settings?.namaKepalaSekolah || 'Kepala Sekolah', 140, y);

    doc.save(`Bukti_Kelulusan_${data.noPendaftaran}.pdf`);
  };

  // =========================
  // STATUS DISPLAY
  // =========================
  const getStatusDisplay = (status: string, data: any) => {

    // kontrol tanggal pengumuman
    let finalStatus = status;

    if (settings?.tanggalPengumuman) {
      const now = new Date();
      const pengumuman = new Date(settings.tanggalPengumuman);
      pengumuman.setHours(0, 0, 0, 0);

      if (now < pengumuman) {
        finalStatus = 'Proses';
      }
    }

    switch (finalStatus) {

      case 'Lulus':
        return (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
            <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
            <h3 className="font-bold text-xl text-green-700 mb-2">SELAMAT ANDA LULUS</h3>

            <button
              onClick={() => printBuktiLulus(data)}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
            >
              <Printer size={18} className="inline mr-1" />
              Cetak Bukti
            </button>
          </div>
        );

      case 'Tidak Lulus':
        return (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
            <XCircle className="mx-auto text-red-600 mb-3" size={40} />
            <h3 className="font-bold text-xl text-red-700">TIDAK LULUS</h3>
          </div>
        );

      default:
        return (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center">
            <Clock className="mx-auto text-amber-600 mb-3" size={40} />
            <h3 className="font-bold text-xl text-amber-700">MASIH DIPROSES</h3>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">

      <div className="w-full max-w-md">

        <Link to="/" className="text-sm text-blue-600 mb-4 inline-block">
          ← Kembali
        </Link>

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4 text-center">
            Cek Kelulusan PPDB SMA
          </h2>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              value={noPendaftaran}
              onChange={(e) => setNoPendaftaran(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="No Pendaftaran"
            />
            <button className="bg-blue-600 text-white px-4 rounded">
              {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {result && (
            <div className="mt-4 space-y-4">
              <div className="text-sm">
                <p><b>No:</b> {result.noPendaftaran}</p>
                <p><b>Nama:</b> {result.namaLengkap}</p>
              </div>

              {getStatusDisplay(result.status, result)}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
