import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, AlertCircle, FileText, Loader2, MapPin } from 'lucide-react';
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
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar',
        text: 'Ukuran maksimal file adalah 2MB',
        confirmButtonColor: '#3b82f6'
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, [fieldId]: base64String }));
      setPreviews(prev => ({ ...prev, [fieldId]: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setMapLocation({ lat, lng });
    setFormData(prev => ({ ...prev, 'Koordinat Lokasi': `${lat}, ${lng}` }));

    if (settings?.koordinatSekolah) {
      const [schoolLat, schoolLng] = settings.koordinatSekolah.split(',').map(s => parseFloat(s.trim()));
      if (!isNaN(schoolLat) && !isNaN(schoolLng)) {
        const dist = calculateDistance(lat, lng, schoolLat, schoolLng);
        setDistance(dist);
        setFormData(prev => ({ ...prev, 'Jarak ke Sekolah (km)': dist.toFixed(2) }));
      }
    }
  };

  const printProof = (noPendaftaran: string) => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("BUKTI PENDAFTARAN PPDB SMA", 105, 20, { align: "center" });

    doc.setFontSize(13);
    doc.text(settings?.namaSekolah || "SMA Bintang Plus", 105, 30, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    let y = 55;

    doc.text(`No Pendaftaran : ${noPendaftaran}`, 20, y);
    y += 10;

    settings?.formFields?.forEach(field => {
      if (field.type !== 'file') {
        const value = formData[field.label] || '-';
        const splitText = doc.splitTextToSize(`${field.label} : ${value}`, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 8;
      }
    });

    doc.setFontSize(9);
    doc.text("Simpan bukti ini untuk cek kelulusan.", 105, 280, { align: "center" });

    doc.save(`Bukti_PPDB_${noPendaftaran}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      Swal.fire({
        icon: 'warning',
        title: 'Wajib Disetujui',
        text: 'Centang pernyataan terlebih dahulu',
      });
      return;
    }

    if (!mapLocation) {
      Swal.fire({
        icon: 'warning',
        title: 'Lokasi Belum Dipilih',
        text: 'Silakan tandai lokasi di peta',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitRegistration(formData);

      if (response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          html: `No Pendaftaran:<br><b>${response.noPendaftaran}</b>`,
          confirmButtonText: 'Download Bukti',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            printProof(response.noPendaftaran);
          }
          window.location.href = '/';
        });
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat mengirim data',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold">Pendaftaran Ditutup</h2>
          <Link to="/" className="text-blue-600">Kembali</Link>
        </div>
      </div>
    );
  }

  const textFields = settings?.formFields?.filter(f => f.type !== 'file') || [];
  const fileFields = settings?.formFields?.filter(f => f.type === 'file') || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Formulir PPDB SMA
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {textFields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.label}
                  value={formData[field.label] || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

            <div>
              <label className="flex items-center gap-2 mb-2">
                <MapPin size={16} /> Lokasi Rumah
              </label>
              <MapPicker onLocationSelect={handleLocationSelect} />
            </div>

            {fileFields.map(field => (
              <div key={field.id}>
                <label className="block text-sm mb-1">{field.label}</label>
                <input type="file" onChange={(e) => handleFileChange(e, field.label)} />
              </div>
            ))}

            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={(e) => setIsAgreed(e.target.checked)} />
              Saya menyatakan data benar
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded"
            >
              {isSubmitting ? 'Memproses...' : 'Kirim'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
