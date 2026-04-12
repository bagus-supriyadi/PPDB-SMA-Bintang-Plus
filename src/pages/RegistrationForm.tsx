// FULL FINAL - ULTRA PREMIUM REGISTRATION FORM

import React, { useState } from 'react';
import { Upload, MapPin, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { submitRegistration } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import jsPDF from 'jspdf';
import MapPicker from '../components/MapPicker';
import { calculateDistance } from '../utils/distance';

export default function RegistrationForm() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [distance, setDistance] = useState<any>(null);
  const [previews, setPreviews] = useState<any>({});

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/20 bg-white/30 backdrop-blur-lg focus:ring-2 focus:ring-blue-400 outline-none text-slate-800";

  const handleChange = (e:any)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const handleFile = (e:any,name:string)=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=()=>{
      setFormData({...formData,[name]:reader.result});
      setPreviews({...previews,[name]:reader.result});
    }
    reader.readAsDataURL(file);
  }

  const handleLocation=(lat:number,lng:number)=>{
    setMapLocation({lat,lng});
    setFormData({...formData,'Koordinat':`${lat},${lng}`});

    if(settings?.koordinatSekolah){
      const [slat,slng]=settings.koordinatSekolah.split(',').map(Number);
      const dist=calculateDistance(lat,lng,slat,slng);
      setDistance(dist);
      setFormData(prev=>({...prev,'Jarak':dist.toFixed(2)}));
    }
  }

  const printPDF=(no:string)=>{
    const doc=new jsPDF();

    // kop sekolah
    doc.addImage('https://bagus-supriyadi.biz.id/uploads/kop sekolah bintang plus.png','PNG',10,5,190,30);

    doc.setFontSize(14);
    doc.text('BUKTI PENDAFTARAN PPDB',105,45,{align:'center'});

    let y=60;

    doc.setFontSize(11);
    doc.text(`No Pendaftaran : ${no}`,20,y);
    y+=10;

    Object.keys(formData).forEach(k=>{
      if(typeof formData[k]==='string' && !formData[k].startsWith('data')){
        doc.text(`${k} : ${formData[k]}`,20,y);
        y+=8;
      }
    })

    y+=10;

    if(mapLocation){
      doc.text(`Koordinat : ${mapLocation.lat}, ${mapLocation.lng}`,20,y);
      y+=8;
    }

    if(distance){
      doc.text(`Jarak ke Sekolah : ${distance.toFixed(2)} km`,20,y);
    }

    // logo stempel
    doc.addImage('https://bagus-supriyadi.biz.id/uploads/logo sma bintang plus bandar lampung.png','PNG',150,240,40,40);

    doc.save(`PPDB_${no}.pdf`);
  }

  const submit=async(e:any)=>{
    e.preventDefault();
    setIsSubmitting(true);

    try{
      const res=await submitRegistration(formData);
      if(res.status==='success'){
        Swal.fire('Berhasil',res.noPendaftaran,'success').then(()=>{
          printPDF(res.noPendaftaran);
        })
      }
    }catch{
      Swal.fire('Error','Gagal','error');
    }

    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10">

      <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-xl p-10 rounded-2xl shadow-xl border">

        {/* LOGO */}
        <img src="https://bagus-supriyadi.biz.id/uploads/logo sma bintang plus bandar lampung.png" className="w-24 mx-auto mb-4" />

        <h2 className="text-3xl font-bold text-center mb-10">FORMULIR PPDB SMA</h2>

        <form onSubmit={submit} className="space-y-8">

          {/* DATA */}
          <div className="grid md:grid-cols-2 gap-6">

            <input name="Nama" placeholder="Nama Lengkap" onChange={handleChange} className={inputClass} />

            <input name="NIK" placeholder="NIK" onChange={handleChange} className={inputClass} />

            <input name="Tempat Lahir" placeholder="Tempat Lahir" onChange={handleChange} className={inputClass} />

            <input type="date" name="Tanggal Lahir" onChange={handleChange} className={inputClass} />

            {/* JENIS KELAMIN */}
            <select name="Jenis Kelamin" onChange={handleChange} className={inputClass}>
              <option value="">Pilih Jenis Kelamin</option>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>

            {/* JURUSAN */}
            <select name="Jurusan" onChange={handleChange} className={inputClass}>
              <option value="">Pilih Jurusan</option>
              <option>IPA</option>
              <option>IPS</option>
            </select>

            <input name="No HP" placeholder="No HP" onChange={handleChange} className={inputClass} />

            <input name="Nama Orang Tua" placeholder="Nama Orang Tua" onChange={handleChange} className={inputClass} />

          </div>

          {/* MAP */}
          <div>
            <label className="flex gap-2 mb-2"><MapPin/> Pilih Lokasi</label>
            <MapPicker onLocationSelect={handleLocation}/>
          </div>

          {/* FILE */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label>Upload Foto</label>
              <input type="file" onChange={(e)=>handleFile(e,'Foto')} />
            </div>

            <div>
              <label>Upload KK</label>
              <input type="file" onChange={(e)=>handleFile(e,'KK')} />
            </div>

          </div>

          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold">
            {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : 'Kirim Pendaftaran'}
          </button>

        </form>

      </div>

    </div>
  )
}
