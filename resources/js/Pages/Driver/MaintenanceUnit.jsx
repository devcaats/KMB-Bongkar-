import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const MAINTENANCE_TYPES = [
    { value: "Ganti Oli", label: "Ganti Oli" },
    { value: "Perbaikan Ban", label: "Perbaikan Ban" },
    { value: "Rem / Kaki-kaki", label: "Rem / Kaki-kaki" },
    { value: "Mesin", label: "Masalah Mesin" },
    { value: "Kelistrikan", label: "Kelistrikan" },
    { value: "Lainnya", label: "Lainnya / Servis Rutin" },
];

export default function MaintenanceUnit() {
    const [popupState, setPopupState] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        unit_plate: "",
        type: "",
        description: "",
        priority: "Normal",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("driver.maintenance.store"), {
            preserveState: true,
            onSuccess: () => {
                setPopupState({ type: "success", message: "Laporan perbaikan unit berhasil dikirim ke tim mekanik." });
                reset();
            },
            onError: () => {
                setPopupState({ type: "error", message: "Gagal mengirim laporan. Periksa kembali isian Anda." });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Maintenance Unit" />

            {/* ── Status Popup ── */}
            <Popup
                open={popupState !== null}
                closeOnDocumentClick
                onClose={() => setPopupState(null)}
                modal
                overlayStyle={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
                contentStyle={{ border: "none", background: "transparent", padding: 0, width: "auto" }}
            >
                {popupState && (
                    <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border ${popupState.type === "success" ? "border-success-200 dark:border-success-800" : "border-error-200 dark:border-error-800"}`}>
                        <div className={`h-1.5 w-full ${popupState.type === "success" ? "bg-success-500" : "bg-error-500"}`} />
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${popupState.type === "success" ? "bg-success-100 dark:bg-success-500/20" : "bg-error-100 dark:bg-error-500/20"}`}>
                                    {popupState.type === "success" ? (
                                        <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold ${popupState.type === "success" ? "text-success-700 dark:text-success-400" : "text-error-700 dark:text-error-400"}`}>
                                        {popupState.type === "success" ? "Berhasil!" : "Gagal"}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{popupState.message}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={() => setPopupState(null)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${popupState.type === "success" ? "bg-success-600 hover:bg-success-700" : "bg-error-600 hover:bg-error-700"}`}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">Laporan Maintenance Unit</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Laporkan kerusakan kendaraan, masalah teknis, atau permintaan servis</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white/90">Formulir Laporan Kerusakan / Maintenance</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Plat Nomor */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-750 dark:text-gray-300">
                                    Plat Nomor / Kode Unit <span className="text-error-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.unit_plate}
                                    onChange={(e) => setData("unit_plate", e.target.value)}
                                    placeholder="Contoh: L 9024 AB / Unit Tronton 01"
                                    className="h-11 rounded-xl border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                />
                                {errors.unit_plate && <p className="text-xs text-error-500">{errors.unit_plate}</p>}
                            </div>

                            {/* Jenis Maintenance */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-750 dark:text-gray-300">
                                    Jenis Maintenance / Servis <span className="text-error-500">*</span>
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value)}
                                    className="h-11 rounded-xl border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                >
                                    <option value="" disabled>-- Pilih Kategori --</option>
                                    {MAINTENANCE_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-xs text-error-500">{errors.type}</p>}
                            </div>
                        </div>

                        {/* Prioritas */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-750 dark:text-gray-300">
                                Prioritas Kendala <span className="text-error-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="Normal"
                                        checked={data.priority === "Normal"}
                                        onChange={(e) => setData("priority", e.target.value)}
                                        className="h-4 w-4 text-brand-650 border-gray-300 focus:ring-brand-500/20"
                                    />
                                    <span>Normal (Bisa jalan / servis rutin)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-750 dark:text-gray-305">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="Urgent"
                                        checked={data.priority === "Urgent"}
                                        onChange={(e) => setData("priority", e.target.value)}
                                        className="h-4 w-4 text-error-600 border-gray-300 focus:ring-error-500/20"
                                    />
                                    <span className="text-error-600 dark:text-error-400 font-semibold">Urgent (Mogok / Tidak layak jalan)</span>
                                </label>
                            </div>
                            {errors.priority && <p className="text-xs text-error-500">{errors.priority}</p>}
                        </div>

                        {/* Deskripsi Masalah */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-750 dark:text-gray-300">
                                Deskripsi Masalah / Kerusakan <span className="text-error-500">*</span>
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Jelaskan secara detail bagian mana yang bermasalah, suara aneh yang terdengar, atau komponen yang perlu diganti..."
                                rows={5}
                                className="rounded-xl border border-gray-200 bg-transparent p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white resize-none"
                            />
                            {errors.description && <p className="text-xs text-error-500">{errors.description}</p>}
                        </div>

                        {/* Submit Actions */}
                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05] transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                {processing ? (
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {processing ? "Mengirim..." : "Kirim Laporan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
