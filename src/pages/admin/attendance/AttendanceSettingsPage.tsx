import { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Navigation,
  Ruler,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Info,
  RefreshCw,
} from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import api from "../../../services/api";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import {
  emptyForm,
  type FieldError,
  type FormState,
  type LocationRecord,
  type ToastType,
} from "../../../types/attendanceType";

/* ─── Types ─────────────────────────────────── */

function validateForm(form: FormState): FieldError {
  const errs: FieldError = {};
  if (!form.rs_name.trim()) errs.rs_name = "Nama rumah sakit wajib diisi.";

  const lat = parseFloat(form.latitude);
  if (!form.latitude.trim()) errs.latitude = "Latitude wajib diisi.";
  else if (isNaN(lat) || lat < -90 || lat > 90)
    errs.latitude = "Latitude harus antara -90 dan 90.";

  const lng = parseFloat(form.longitude);
  if (!form.longitude.trim()) errs.longitude = "Longitude wajib diisi.";
  else if (isNaN(lng) || lng < -180 || lng > 180)
    errs.longitude = "Longitude harus antara -180 dan 180.";

  const rad = parseInt(form.radius_meters, 10);
  if (!form.radius_meters.trim()) errs.radius_meters = "Radius wajib diisi.";
  else if (isNaN(rad) || rad <= 0)
    errs.radius_meters = "Radius harus berupa angka positif.";

  return errs;
}

/* ─── Sub-components ─────────────────────────── */
function FieldInput({
  id,
  name,
  label,
  required,
  type = "text",
  step,
  min,
  placeholder,
  value,
  onChange,
  error,
  icon,
  suffix,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  step?: string;
  min?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: React.ReactNode;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-blue-dark mb-1.5"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          step={step}
          min={min}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full pl-10 ${suffix ? "pr-16" : "pr-4"} min-h-[44px] border rounded-xl bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-primary/20 focus:border-blue-primary ${
            error ? "border-destructive bg-destructive/5" : "border-slate-200"
          }`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <span className="text-xs font-semibold text-blue-dark/40">
              {suffix}
            </span>
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-blue-dark/40 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function AttendanceSettingsPage() {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Add form
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [addErrors, setAddErrors] = useState<FieldError>({});
  const [isAdding, setIsAdding] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<LocationRecord | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editErrors, setEditErrors] = useState<FieldError>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<LocationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // GPS
  const [isLocating, setIsLocating] = useState(false);
  const [locatingFor, setLocatingFor] = useState<"add" | "edit">("add");

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null,
  );

  /* fetch */
  const fetchLocations = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/attendance-settings");
      const raw =
        res?.data?.data?.datas?.data ??
        res?.data?.data?.datas ??
        res?.data?.data ??
        res?.data ??
        [];
      setLocations(Array.isArray(raw) ? raw : [raw]);
    } catch {
      setLocations([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /* toast helper */
  const showToast = (msg: string, type: ToastType = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* GPS */
  const handleGetLocation = (target: "add" | "edit") => {
    if (!navigator.geolocation) {
      showToast("Browser tidak mendukung geolokasi.", "error");
      return;
    }
    setLocatingFor(target);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const patch = {
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6),
        };
        if (target === "add") {
          setAddForm((p) => ({ ...p, ...patch }));
          setAddErrors((p) => ({
            ...p,
            latitude: undefined,
            longitude: undefined,
          }));
        } else {
          setEditForm((p) => ({ ...p, ...patch }));
          setEditErrors((p) => ({
            ...p,
            latitude: undefined,
            longitude: undefined,
          }));
        }
        setIsLocating(false);
      },
      () => {
        showToast(
          "Gagal mendapatkan lokasi. Izinkan akses lokasi di browser.",
          "error",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  /* ── ADD ── */
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddForm((p) => ({ ...p, [name]: value }));
    if (addErrors[name as keyof FieldError])
      setAddErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(addForm);
    if (Object.keys(errs).length) {
      setAddErrors(errs);
      return;
    }

    setIsAdding(true);
    try {
      await api.post("/attendance-settings", {
        rs_name: addForm.rs_name.trim(),
        latitude: parseFloat(addForm.latitude),
        longitude: parseFloat(addForm.longitude),
        radius_meters: parseInt(addForm.radius_meters, 10),
      });
      showToast("Lokasi kantor berhasil ditambahkan.");
      setAddForm(emptyForm);
      fetchLocations();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "Gagal menyimpan lokasi.",
        "error",
      );
    } finally {
      setIsAdding(false);
    }
  };

  /* ── EDIT ── */
  const openEdit = (loc: LocationRecord) => {
    setEditTarget(loc);
    setEditForm({
      rs_name: loc.rs_name,
      latitude: String(loc.latitude),
      longitude: String(loc.longitude),
      radius_meters: String(loc.radius_meters),
    });
    setEditErrors({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
    if (editErrors[name as keyof FieldError])
      setEditErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const errs = validateForm(editForm);
    if (Object.keys(errs).length) {
      setEditErrors(errs);
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/attendance-settings/${editTarget.id}`, {
        rs_name: editForm.rs_name.trim(),
        latitude: parseFloat(editForm.latitude),
        longitude: parseFloat(editForm.longitude),
        radius_meters: parseInt(editForm.radius_meters, 10),
      });
      showToast("Lokasi kantor berhasil diperbarui.");
      setEditTarget(null);
      fetchLocations();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "Gagal memperbarui lokasi.",
        "error",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  /* ── DELETE ── */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/attendance-settings/${deleteTarget.id}`);
      showToast("Lokasi kantor berhasil dihapus.");
      setDeleteTarget(null);
      fetchLocations();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "Gagal menghapus lokasi.",
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const hasLocations = locations.length > 0;

  /* ─── RENDER ─────────────────────────────────── */
  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <Alert
          className={`fixed bottom-6 right-6 z-9999 w-80 shadow-lg border-none bg-white animate-[slideIn_.5s_ease-in-out] ${
            toast.type === "success" ? "text-success" : "text-destructive"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="text-success" />
          ) : (
            <AlertCircle className="text-destructive" />
          )}
          <AlertTitle>
            {toast.type === "success" ? "Berhasil!" : "Gagal!"}
          </AlertTitle>
          <AlertDescription
            className={`text-xs ${toast.type === "success" ? "text-success/70" : "text-destructive/70"}`}
          >
            {toast.msg}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-2 lg:px-4 text-blue-dark bg-[#F8FAFC] pb-12 animate-[fadeIn_0.3s_ease-out]">
        {/* ── Page Header ── */}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-dark flex items-center gap-2">
              <MapPin size={22} className="text-blue-dark" />
              Lokasi Kantor
            </h1>
            <p className="text-blue-dark/60 mt-1.5 text-sm">
              Kelola lokasi kantor untuk validasi absensi berbasis GPS karyawan.
            </p>
          </div>
          <button
            onClick={fetchLocations}
            className="flex items-center gap-1.5 min-h-[36px] px-3 text-xs font-semibold text-blue-dark/60 border border-slate-200 rounded-xl hover:border-blue-primary/30 hover:text-blue-primary bg-white transition-all"
          >
            <RefreshCw
              size={13}
              className={loadingList ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ── Existing Locations List ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-dark/5 flex items-center justify-center">
                <Building2 size={18} className="text-blue-dark" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-blue-dark">
                  Daftar Lokasi Terdaftar
                </h2>
                <p className="text-xs text-blue-dark/50">
                  {loadingList
                    ? "Memuat data..."
                    : `${locations.length} lokasi aktif`}
                </p>
              </div>
            </div>
          </div>

          {loadingList ? (
            <div className="flex items-center justify-center gap-2 py-16 text-blue-dark/40">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">Memuat lokasi...</span>
            </div>
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <MapPin size={26} className="text-blue-dark/20" />
              </div>
              <p className="font-bold text-blue-dark text-sm">
                Belum Ada Lokasi
              </p>
              <p className="text-xs text-blue-dark/50 mt-1 max-w-xs">
                Tambahkan lokasi kantor pertama Anda menggunakan form di bawah.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-blue-50/20 transition-colors group"
                >
                  {/* Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-primary/10 flex items-center justify-center mt-0.5">
                      <MapPin size={16} className="text-blue-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-blue-dark truncate">
                        {loc.rs_name}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-blue-dark/50 flex items-center gap-1">
                          <Navigation size={11} />
                          {loc.latitude}, {loc.longitude}
                        </span>
                        <span className="text-xs text-blue-dark/50 flex items-center gap-1">
                          <Ruler size={11} />
                          Radius: {loc.radius_meters} m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(loc)}
                      className="flex items-center gap-1.5 min-h-[34px] px-3 text-xs font-semibold border border-slate-200 text-blue-dark rounded-lg hover:border-blue-primary hover:text-blue-primary bg-white transition-all"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(loc)}
                      className="flex items-center gap-1.5 min-h-[34px] px-3 text-xs font-semibold border border-slate-200 text-blue-dark rounded-lg hover:border-destructive hover:text-destructive bg-white transition-all"
                    >
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Add Form ── */}
        {!hasLocations && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Form Card */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-dark/5 flex items-center justify-center">
                  <PlusCircle size={18} className="text-blue-dark" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-blue-dark">
                    Tambah Lokasi Baru
                  </h2>
                  <p className="text-xs text-blue-dark/50">
                    Isi semua kolom yang diperlukan
                  </p>
                </div>
              </div>

              {/* Warning if location already exists */}

              <form
                onSubmit={handleAddSubmit}
                className="p-6 flex flex-col gap-5"
              >
                <FieldInput
                  id="rs_name"
                  name="rs_name"
                  label="Nama Rumah Sakit / Lokasi"
                  required
                  placeholder="Cth: RSUD Dr. Soetomo"
                  value={addForm.rs_name}
                  onChange={handleAddChange}
                  error={addErrors.rs_name}
                  icon={<Building2 size={16} className="text-blue-dark/40" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FieldInput
                    id="latitude"
                    name="latitude"
                    label="Latitude"
                    required
                    type="number"
                    step="any"
                    placeholder="-7.257472"
                    value={addForm.latitude}
                    onChange={handleAddChange}
                    error={addErrors.latitude}
                    icon={
                      <Navigation size={14} className="text-blue-dark/40" />
                    }
                  />
                  <FieldInput
                    id="longitude"
                    name="longitude"
                    label="Longitude"
                    required
                    type="number"
                    step="any"
                    placeholder="112.752088"
                    value={addForm.longitude}
                    onChange={handleAddChange}
                    error={addErrors.longitude}
                    icon={
                      <Navigation
                        size={14}
                        className="text-blue-dark/40 rotate-90"
                      />
                    }
                  />
                </div>

                {/* GPS Button */}
                <button
                  type="button"
                  onClick={() => handleGetLocation("add")}
                  disabled={isLocating && locatingFor === "add"}
                  className="flex items-center justify-center gap-2 w-full min-h-[40px] rounded-xl border border-blue-primary/30 bg-blue-primary/5 text-blue-primary text-sm font-semibold hover:bg-blue-primary/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLocating && locatingFor === "add" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Mendeteksi lokasi...
                    </>
                  ) : (
                    <>
                      <Navigation size={15} />
                      Gunakan Lokasi Saya Saat Ini
                    </>
                  )}
                </button>

                <FieldInput
                  id="radius_meters"
                  name="radius_meters"
                  label="Radius Absensi"
                  required
                  type="number"
                  min="1"
                  step="1"
                  placeholder="100"
                  value={addForm.radius_meters}
                  onChange={handleAddChange}
                  error={addErrors.radius_meters}
                  icon={<Ruler size={15} className="text-blue-dark/40" />}
                  suffix="meter"
                  hint="Karyawan harus berada dalam radius ini untuk melakukan absensi."
                />

                <div className="border-t border-slate-100" />

                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex items-center justify-center gap-2 w-full min-h-[46px] rounded-xl bg-blue-dark text-white text-sm font-bold hover:bg-blue-dark/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-dark/20"
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      Tambah Lokasi Kantor
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Panduan */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-primary/10 flex items-center justify-center">
                    <MapPin size={16} className="text-blue-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-blue-dark">
                    Panduan Koordinat
                  </h3>
                </div>
                <ul className="flex flex-col gap-3 text-xs text-blue-dark/60 leading-relaxed">
                  {[
                    <>
                      Gunakan tombol{" "}
                      <strong className="text-blue-dark/70">
                        "Gunakan Lokasi Saya"
                      </strong>{" "}
                      untuk mengisi koordinat otomatis.
                    </>,
                    <>
                      Atau cari koordinat via{" "}
                      <strong className="text-blue-primary">Google Maps</strong>{" "}
                      → klik kanan pada lokasi.
                    </>,
                    <>
                      Latitude:{" "}
                      <strong className="text-blue-dark/70">-90 s/d 90</strong>{" "}
                      · Longitude:{" "}
                      <strong className="text-blue-dark/70">
                        -180 s/d 180
                      </strong>
                      .
                    </>,
                  ].map((text, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-dark/5 flex items-center justify-center font-bold text-blue-dark/40 text-[10px]">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Radius Guide */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-accent/10 flex items-center justify-center">
                    <Ruler size={16} className="text-blue-accent" />
                  </div>
                  <h3 className="font-bold text-sm text-blue-dark">
                    Rekomendasi Radius
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      label: "Ketat",
                      value: 50,
                      desc: "Cocok untuk gedung tunggal",
                      color: "text-emerald-600 bg-emerald-50",
                    },
                    {
                      label: "Standar",
                      value: 100,
                      desc: "Rekomendasi umum",
                      color: "text-blue-primary bg-blue-light/40",
                    },
                    {
                      label: "Longgar",
                      value: 200,
                      desc: "Untuk area kampus/kompleks",
                      color: "text-orange-500 bg-orange-50",
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setAddForm((p) => ({
                          ...p,
                          radius_meters: String(item.value),
                        }));
                        setAddErrors((p) => ({
                          ...p,
                          radius_meters: undefined,
                        }));
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors text-left w-full"
                    >
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${item.color}`}
                      >
                        {item.value} m
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-blue-dark">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-blue-dark/50">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-blue-dark/40 mt-3">
                  Klik radius untuk langsung mengisinya ke form.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════ EDIT MODAL ═══════════════ */}
      {editTarget && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out] max-h-[calc(100vh-2rem)] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-primary/10 flex items-center justify-center">
                  <Pencil size={16} className="text-blue-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-blue-dark">
                    Edit Lokasi
                  </h2>
                  <p className="text-xs text-blue-dark/50">
                    Perbarui data lokasi kantor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-blue-dark/40 hover:text-blue-dark transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleEditSubmit}
              className="p-6 flex flex-col gap-5"
            >
              <FieldInput
                id="edit_rs_name"
                name="rs_name"
                label="Nama Rumah Sakit / Lokasi"
                required
                placeholder="Cth: RSUD Dr. Soetomo"
                value={editForm.rs_name}
                onChange={handleEditChange}
                error={editErrors.rs_name}
                icon={<Building2 size={16} className="text-blue-dark/40" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <FieldInput
                  id="edit_latitude"
                  name="latitude"
                  label="Latitude"
                  required
                  type="number"
                  step="any"
                  placeholder="-7.257472"
                  value={editForm.latitude}
                  onChange={handleEditChange}
                  error={editErrors.latitude}
                  icon={<Navigation size={14} className="text-blue-dark/40" />}
                />
                <FieldInput
                  id="edit_longitude"
                  name="longitude"
                  label="Longitude"
                  required
                  type="number"
                  step="any"
                  placeholder="112.752088"
                  value={editForm.longitude}
                  onChange={handleEditChange}
                  error={editErrors.longitude}
                  icon={
                    <Navigation
                      size={14}
                      className="text-blue-dark/40 rotate-90"
                    />
                  }
                />
              </div>

              {/* GPS button for edit */}
              <button
                type="button"
                onClick={() => handleGetLocation("edit")}
                disabled={isLocating && locatingFor === "edit"}
                className="flex items-center justify-center gap-2 w-full min-h-[40px] rounded-xl border border-blue-primary/30 bg-blue-primary/5 text-blue-primary text-sm font-semibold hover:bg-blue-primary/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLocating && locatingFor === "edit" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Mendeteksi lokasi...
                  </>
                ) : (
                  <>
                    <Navigation size={15} />
                    Gunakan Lokasi Saya Saat Ini
                  </>
                )}
              </button>

              <FieldInput
                id="edit_radius"
                name="radius_meters"
                label="Radius Absensi"
                required
                type="number"
                min="1"
                step="1"
                placeholder="100"
                value={editForm.radius_meters}
                onChange={handleEditChange}
                error={editErrors.radius_meters}
                icon={<Ruler size={15} className="text-blue-dark/40" />}
                suffix="meter"
              />

              <div className="border-t border-slate-100" />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 min-h-[44px] rounded-xl border border-slate-200 text-sm font-semibold text-blue-dark hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-blue-dark text-white text-sm font-bold hover:bg-blue-dark/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ DELETE MODAL ═══════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 size={24} className="text-destructive" />
              </div>
              <div>
                <h2 className="font-bold text-base text-blue-dark">
                  Hapus Lokasi Ini?
                </h2>
                <p className="text-sm text-blue-dark/60 mt-1.5 leading-relaxed">
                  Lokasi{" "}
                  <strong className="text-blue-dark">
                    {deleteTarget.rs_name}
                  </strong>{" "}
                  akan dihapus permanen dan tidak bisa dikembalikan.
                </p>
              </div>

              {/* Detail chip */}
              <div className="w-full bg-slate-50 rounded-xl p-3 text-left border border-slate-100">
                <p className="text-xs text-blue-dark/50 flex items-center gap-1.5 mb-1">
                  <Navigation size={11} />
                  {deleteTarget.latitude}, {deleteTarget.longitude}
                </p>
                <p className="text-xs text-blue-dark/50 flex items-center gap-1.5">
                  <Ruler size={11} />
                  Radius: {deleteTarget.radius_meters} meter
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 min-h-[44px] rounded-xl border border-slate-200 text-sm font-semibold text-blue-dark hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-destructive text-white text-sm font-bold hover:bg-destructive/80 transition-all disabled:opacity-60"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Ya, Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
