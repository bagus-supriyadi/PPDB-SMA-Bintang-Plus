import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { submitRegistration, RegistrationData } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import jsPDF from 'jspdf';
import MapPicker from '../components/MapPicker';
import { calculateDistance } from '../utils/distance';

export default function RegistrationForm() {
  const { settings } = useSettings();
  const isClosed = settings?.statusPendaftaran === 'Tutup';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any, field: string) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'Maksimal file 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, [field]: reader.result });
      setPreviews({ ...previews, [field]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setMapLocation({ lat, lng });
    setFormData({ ...formData, "Koordinat Lokasi": `${lat},${lng}` });

    if (settings?.koordinatSekolah) {
      const [slat, slng] = settings.koordinatSekolah.split(',').map(Number);
      const dist = calculateDistance(lat, lng, slat, slng);
      setDistance(dist);
      setFormData(prev => ({ ...prev, "Jarak ke Sekolah (km)": dist.toFixed(2) }));
    }
  };

  // ✅ PDF PREMIUM
  const printProof = (no: string) => {
    const doc = new jsPDF();

    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("BUKTI PENDAFTARAN PPDB", 105, 12, { align: "center" });

    doc.setFontSize(12);
    doc.text(settings?.namaSekolah || "", 105, 20, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    let y = 40;

    doc.text(`No Pendaftaran : ${no}`, 20, y);
    y += 10;

    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] !== 'string' || formData[key].startsWith('data:')) return;

      const text = `${key} : ${formData[key]}`;
      const split = doc.splitTextToSize(text, 170);
      doc.text(split, 20, y);
      y += split.length * 7;
    });

    // tanda tangan
    y += 20;

    doc.text("Orang Tua/Wali", 20, y);
    doc.text("Calon Siswa", 140, y);

    y += 25;

    doc.text("(__________________)", 20, y);
    doc.text("(__________________)", 140, y);

    doc.save(`PPDB_${no}.pdf`);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isAgreed) {
      Swal.fire('Perhatian', 'Centang persetujuan', 'warning');
      return;
    }

    if (!mapLocation) {
      Swal.fire('Perhatian', 'Pilih lokasi map', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitRegistration(formData);

      if (res.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          html: `<b>${res.noPendaftaran}</b>`,
          confirmButtonText: 'Download Bukti'
        }).then(() => {
          printProof(res.noPendaftaran);
          window.location.href = "/";
        });
      }
    } catch {
      Swal.fire('Error', 'Gagal kirim data', 'error');
    }

    setIsSubmitting(false);
  };

  if (isClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Pendaftaran Ditutup</h1>
      </div>
    );
  }

  const textFields = settings?.formFields.filter(f => f.type !== 'file') || [];
  const fileFields = settings?.formFields.filter(f => f.type === 'file') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">

      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl border">

        <h2 className="text-3xl font-bold text-center mb-10">
          Formulir Pendaftaran PPDB
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* DATA DIRI */}
          <div>
            <h3 className="font-bold text-xl mb-6">Data Diri</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {textFields.map(field => (
                <div key={field.id}>
                  <label className="text-sm font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.label}
                    value={formData[field.label] || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* MAP */}
          <div>
            <h3 className="font-bold text-xl mb-4">Lokasi Rumah</h3>
            <MapPicker onLocationSelect={handleLocationSelect} />
            {distance && (
              <p className="mt-2 text-blue-600 font-medium">
                Jarak ke sekolah: {distance.toFixed(2)} km
              </p>
            )}
          </div>

          {/* FILE */}
          <div>
            <h3 className="font-bold text-xl mb-6">Upload Berkas</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {fileFields.map(field => (
                <div key={field.id}>
                  <label className="text-sm">{field.label}</label>

                  <div className="border-2 border-dashed p-4 rounded-xl text-center cursor-pointer">
                    <Upload className="mx-auto mb-2" />
                    <input type="file" onChange={(e) => handleFileChange(e, field.label)} />
                  </div>

                  {previews[field.label] && (
                    <img src={previews[field.label]} className="mt-2 h-24 object-cover rounded" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AGREEMENT */}
          <div className="flex items-center gap-2">
            <input type="checkbox" onChange={(e) => setIsAgreed(e.target.checked)} />
            <span>Saya menyatakan data benar</span>
          </div>

          {/* BUTTON */}
          <button
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl text-white font-bold text-lg 
            bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all shadow-lg"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Kirim Pendaftaran"}
          </button>

        </form>
      </div>
    </div>
  );
}
