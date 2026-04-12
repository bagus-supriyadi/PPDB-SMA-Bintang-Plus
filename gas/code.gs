const SHEET_NAME = "Data Pendaftar";
const ADMIN_SHEET_NAME = "Admin";
const SETTINGS_SHEET_NAME = "Pengaturan";
const FOLDER_NAME = "PPDB SMA";

const DEFAULT_FORM_FIELDS = [
  { id: "Nama Lengkap", label: "Nama Lengkap", type: "text", required: true },
  { id: "NISN", label: "NISN", type: "text", required: true },
  { id: "Tempat Lahir", label: "Tempat Lahir", type: "text", required: true },
  { id: "Tanggal Lahir", label: "Tanggal Lahir", type: "date", required: true },
  { id: "Jenis Kelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], required: true },
  { id: "Alamat", label: "Alamat Lengkap", type: "textarea", required: true },
  { id: "Asal SMP", label: "Asal Sekolah (SMP/MTs)", type: "text", required: true },
  { id: "Nama Orang Tua", label: "Nama Orang Tua/Wali", type: "text", required: true },
  { id: "No HP", label: "No. WhatsApp Aktif", type: "text", required: true },
  { id: "Pilihan Jurusan", label: "Pilihan Jurusan", type: "select", options: ["IPA", "IPS"], required: true },

  { id: "Foto Siswa", label: "Pas Foto 3x4", type: "file", required: true },
  { id: "Ijazah SMP", label: "Ijazah SMP/MTs", type: "file", required: true },
  { id: "Kartu Keluarga", label: "Kartu Keluarga", type: "file", required: true },
  { id: "Akta Kelahiran", label: "Akta Kelahiran", type: "file", required: true }
];

const DEFAULT_SETTINGS = {
  namaSekolah: "SMA Bintang Plus",
  alamat: "Jalan Pendidikan No.32, Kemiling, Bandar Lampung",
  telepon: "0831-3516-5464 - 0831-5157-2671",
  email: "smabintangplus@gmail.com",
  deskripsi: "SMA Bintang Plus bukan sekadar sekolah, tapi tempat lahirnya siswa berprestasi dan bermental juara.",
  statusPendaftaran: "Buka",
  formFields: JSON.stringify(DEFAULT_FORM_FIELDS)
};

function outputJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return outputJSON({ status: "error", message: "No data received" });
    }

    const data = JSON.parse(e.postData.contents);

    if (data.action === "login") return handleLogin(data.username, data.password);
    if (data.action === "checkStatus") return handleCheckStatus(data.noPendaftaran);

    return handleRegistration(data);

  } catch (error) {
    return outputJSON({ status: "error", message: error.toString() });
  }
}

function doGet() {
  return outputJSON({ status: "success", message: "API SMA Bintang Plus aktif" });
}

function handleRegistration(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const year = new Date().getFullYear();
  const noPendaftaran = `PPDB-${year}-${Date.now()}`;

  const rowData = new Array(headers.length).fill("");

  headers.forEach((header, index) => {
    if (header === "Timestamp") rowData[index] = new Date();
    else if (header === "No Pendaftaran") rowData[index] = noPendaftaran;
    else if (header === "Status") rowData[index] = "Proses";
    else rowData[index] = data[header] || "";
  });

  sheet.appendRow(rowData);

  return outputJSON({
    status: "success",
    message: "Pendaftaran berhasil",
    noPendaftaran
  });
}
