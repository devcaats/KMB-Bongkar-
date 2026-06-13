import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function LaporanMuat({ deliveryOrders = [], loadReports = [] }) {
    const [popupState, setPopupState] = useState(null);
    const [viewingPhoto, setViewingPhoto] = useState(null);
    const [editingReport, setEditingReport] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            do_id: "",
            load_date: new Date().toISOString().split("T")[0], // default to today
            bruto: "",
            tara: "",
            photo_required: null,
            photo_optional: null,
            notes: "",
        });

    // Automatically resolve nomor_unit based on selected do_id or editing report
    const selectedDo = useMemo(() => {
        return deliveryOrders.find((d) => String(d.id) === String(data.do_id));
    }, [data.do_id, deliveryOrders]);

    const nomorUnit = useMemo(() => {
        if (editingReport) {
            return editingReport.delivery_order?.nomor_unit || "";
        }
        return selectedDo ? selectedDo.nomor_unit : "";
    }, [selectedDo, editingReport]);

    // Automatically calculate netto
    const netto = useMemo(() => {
        const brutoVal = parseFloat(data.bruto) || 0;
        const taraVal = parseFloat(data.tara) || 0;
        const result = brutoVal - taraVal;
        return result > 0 ? result : 0;
    }, [data.bruto, data.tara]);

    const startEdit = (report) => {
        clearErrors();
        setEditingReport(report);
        setData({
            do_id: report.delivery_order_id,
            load_date: report.load_date,
            bruto: String(report.bruto),
            tara: String(report.tara),
            photo_required: null,
            photo_optional: null,
            notes: report.notes || "",
        });
    };

    const cancelEdit = () => {
        setEditingReport(null);
        reset();
        clearErrors();
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route("driver.muat.destroy", deleteTarget.id), {
            preserveState: true,
            onSuccess: () => {
                setPopupState({
                    type: "success",
                    message: "Laporan muat berhasil dihapus.",
                });
                setDeleteTarget(null);
            },
            onError: () => {
                setPopupState({
                    type: "error",
                    message: "Gagal menghapus laporan muat.",
                });
                setDeleteTarget(null);
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        const url = editingReport
            ? route("driver.muat.update", editingReport.id)
            : route("driver.muat.store");

        // Inertia useForm post helper handles files automatically using FormData
        post(url, {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
                const msg = editingReport
                    ? "Laporan muat berhasil diperbarui!"
                    : "Laporan muat berhasil dikirim ke sistem.";
                setPopupState({ type: "success", message: msg });
                reset();
                setEditingReport(null);
            },
            onError: () => {
                setPopupState({
                    type: "error",
                    message:
                        "Gagal menyimpan laporan. Periksa kembali isian Anda.",
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Laporan Muat" />

            {/* ── Status Popup ── */}
            <Popup
                open={popupState !== null}
                closeOnDocumentClick
                onClose={() => setPopupState(null)}
                modal
                overlayStyle={{
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(2px)",
                }}
                contentStyle={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    width: "auto",
                }}
            >
                {popupState && (
                    <div
                        className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border ${popupState.type === "success" ? "border-success-200 dark:border-success-800" : "border-error-200 dark:border-error-800"}`}
                    >
                        <div
                            className={`h-1.5 w-full ${popupState.type === "success" ? "bg-success-500" : "bg-error-500"}`}
                        />
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${popupState.type === "success" ? "bg-success-100 dark:bg-success-500/20" : "bg-error-100 dark:bg-error-500/20"}`}
                                >
                                    {popupState.type === "success" ? (
                                        <svg
                                            className="w-6 h-6 text-success-600 dark:text-success-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-6 h-6 text-error-600 dark:text-error-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className={`text-lg font-bold ${popupState.type === "success" ? "text-success-700 dark:text-success-400" : "text-error-700 dark:text-error-400"}`}
                                    >
                                        {popupState.type === "success"
                                            ? "Berhasil!"
                                            : "Gagal"}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {popupState.message}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setPopupState(null)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${popupState.type === "success" ? "bg-success-600 hover:bg-success-700" : "bg-error-600 hover:bg-error-700"}`}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            {/* ── Photo Lightbox Popup ── */}
            <Popup
                open={viewingPhoto !== null}
                onClose={() => setViewingPhoto(null)}
                modal
                overlayStyle={{
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(4px)",
                }}
                contentStyle={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    width: "auto",
                }}
            >
                {viewingPhoto && (
                    <div className="relative max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl overflow-hidden p-3 shadow-2xl">
                        <button
                            onClick={() => setViewingPhoto(null)}
                            className="absolute top-4 right-4 z-10 h-8.5 w-8.5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <img
                            src={viewingPhoto}
                            alt="Pratinjau Bukti Muat"
                            className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain mx-auto"
                        />
                    </div>
                )}
            </Popup>

            {/* ── Confirm Delete Popup ── */}
            <Popup
                open={deleteTarget !== null}
                closeOnDocumentClick
                onClose={() => setDeleteTarget(null)}
                modal
                overlayStyle={{
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(2px)",
                }}
                contentStyle={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    width: "auto",
                }}
            >
                {deleteTarget && (
                    <div className="relative w-full max-w-sm mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-error-200 dark:border-error-800">
                        <div className="h-1.5 w-full bg-error-500" />
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-error-100 dark:bg-error-500/20">
                                    <svg
                                        className="w-6 h-6 text-error-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-error-700 dark:text-error-400">
                                        Hapus Laporan?
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Laporan muat untuk DO{" "}
                                        <strong>
                                            {
                                                deleteTarget.delivery_order
                                                    ?.nomor_do
                                            }
                                        </strong>{" "}
                                        akan dihapus secara permanen beserta
                                        lampirannya.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-xl bg-error-600 text-sm font-semibold text-white hover:bg-error-700"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                            {editingReport
                                ? "Edit Laporan Muat"
                                : "Laporan Muat Barang"}
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {editingReport
                                ? `Mengubah data laporan untuk DO #${editingReport.delivery_order?.nomor_do}`
                                : "Kirim data pemuatan muatan sebelum jalan"}
                        </p>
                    </div>
                </div>

                {/* If no DOs are assigned to this driver AND we are NOT in edit mode */}
                {deliveryOrders.length === 0 && !editingReport ? (
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-10 text-center space-y-4 shadow-sm">
                        <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-850 dark:text-white/90">
                                Tidak Ada Data DO
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                                Saat ini tidak ada Delivery Order aktif yang
                                ditujukan kepada Anda. Hubungi Admin atau
                                Finance untuk penugasan DO baru.
                            </p>
                        </div>
                        <div className="pt-2 flex gap-3 justify-center">
                            <Link
                                href="/dashboard"
                                className="inline-flex px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition-colors"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Form Card */
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white/90">
                                {editingReport
                                    ? "Formulir Edit Laporan"
                                    : "Formulir Laporan Muat"}
                            </h3>
                            {editingReport && (
                                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                                    Mode Edit
                                </span>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Pilih Nomor DO */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                    Nomor DO{" "}
                                    <span className="text-error-500">*</span>
                                </label>
                                <select
                                    disabled={editingReport !== null}
                                    value={data.do_id}
                                    onChange={(e) =>
                                        setData("do_id", e.target.value)
                                    }
                                    className="h-11 rounded-xl border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-850 disabled:text-gray-400 dark:disabled:text-gray-500"
                                >
                                    {editingReport && (
                                        <option
                                            value={
                                                editingReport.delivery_order_id
                                            }
                                        >
                                            {
                                                editingReport.delivery_order
                                                    ?.nomor_do
                                            }
                                        </option>
                                    )}
                                    <option value="">
                                        -- Pilih DO Aktif Anda --
                                    </option>
                                    {deliveryOrders.map((doObj) => (
                                        <option key={doObj.id} value={doObj.id}>
                                            {doObj.nomor_do}
                                        </option>
                                    ))}
                                </select>
                                {errors.do_id && (
                                    <p className="text-xs text-error-500">
                                        {errors.do_id}
                                    </p>
                                )}
                            </div>

                            {/* Nomor Unit (Read-only, Auto-populated) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                    Nomor Unit / Plat Nomor
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={
                                        nomorUnit ||
                                        "- Otomatis terisi setelah memilih DO -"
                                    }
                                    className="h-11 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-900/50 px-4 text-sm text-gray-550 dark:border-gray-700 dark:text-gray-400 focus:outline-none"
                                />
                            </div>

                            {/* Tanggal Muat */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                    Tanggal Muat{" "}
                                    <span className="text-error-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.load_date}
                                    onChange={(e) =>
                                        setData("load_date", e.target.value)
                                    }
                                    className="h-11 rounded-xl border border-gray-200 bg-transparent px-4 text-sm text-gray-855 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                />
                                {errors.load_date && (
                                    <p className="text-xs text-error-500">
                                        {errors.load_date}
                                    </p>
                                )}
                            </div>

                            {/* Bruto & Tara (In 1 Row) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Bruto */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                        Timbangan Bruto (Kg){" "}
                                        <span className="text-error-500">
                                            *
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={data.bruto}
                                            onChange={(e) =>
                                                setData("bruto", e.target.value)
                                            }
                                            placeholder="Contoh: 12500"
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-transparent px-4 pr-12 text-sm text-gray-855 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        />
                                        <span className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-gray-400 pointer-events-none">
                                            kg
                                        </span>
                                    </div>
                                    {errors.bruto && (
                                        <p className="text-xs text-error-500">
                                            {errors.bruto}
                                        </p>
                                    )}
                                </div>

                                {/* Tara */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                        Timbangan Tara (Kg){" "}
                                        <span className="text-error-500">
                                            *
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={data.tara}
                                            onChange={(e) =>
                                                setData("tara", e.target.value)
                                            }
                                            placeholder="Contoh: 4000"
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-transparent px-4 pr-12 text-sm text-gray-855 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        />
                                        <span className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-gray-400 pointer-events-none">
                                            kg
                                        </span>
                                    </div>
                                    {errors.tara && (
                                        <p className="text-xs text-error-500">
                                            {errors.tara}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Netto (Read-only, Auto-calculated) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                    Hasil Berat Netto (Kg)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        readOnly
                                        value={
                                            netto > 0 ? `${netto} kg` : "0 kg"
                                        }
                                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-900/50 px-4 text-sm font-bold text-brand-600 dark:text-brand-400 focus:outline-none dark:border-gray-700"
                                    />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-xs text-gray-400 pointer-events-none">
                                        (Bruto - Tara)
                                    </span>
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Upload 1: Wajib */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                        Foto Bukti Muat / Surat Jalan{" "}
                                        {!editingReport && (
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        )}
                                    </label>
                                    <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData(
                                                    "photo_required",
                                                    e.target.files[0],
                                                )
                                            }
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {data.photo_required ? (
                                            <div className="text-center p-3">
                                                <svg
                                                    className="mx-auto h-8 w-8 text-success-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <p className="mt-1 text-xs font-semibold text-success-600 dark:text-success-400 truncate max-w-[200px]">
                                                    {data.photo_required.name}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    {(
                                                        data.photo_required
                                                            .size / 1024
                                                    ).toFixed(1)}{" "}
                                                    KB
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center p-3">
                                                <svg
                                                    className="mx-auto h-7 w-7 text-gray-400 group-hover:text-gray-600 transition-colors"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    {editingReport
                                                        ? "Pilih Foto Baru (Opsional)"
                                                        : "Pilih Foto Bukti Muat"}
                                                </p>
                                                <p className="text-[10px] text-gray-455">
                                                    Maks. 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {editingReport &&
                                        editingReport.photo_required_path &&
                                        !data.photo_required && (
                                            <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-150 dark:border-gray-800 w-max">
                                                <span className="text-[10px] text-gray-450 dark:text-gray-400 font-medium">
                                                    Foto Tersimpan:
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setViewingPhoto(
                                                            `/storage/${editingReport.photo_required_path}`,
                                                        )
                                                    }
                                                    className="text-[10px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350"
                                                >
                                                    [ Lihat Foto ]
                                                </button>
                                            </div>
                                        )}
                                    {errors.photo_required && (
                                        <p className="text-xs text-error-500">
                                            {errors.photo_required}
                                        </p>
                                    )}
                                </div>

                                {/* Upload 2: Opsional */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                        Foto Tambahan (Opsional)
                                    </label>
                                    <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData(
                                                    "photo_optional",
                                                    e.target.files[0],
                                                )
                                            }
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {data.photo_optional ? (
                                            <div className="text-center p-3">
                                                <svg
                                                    className="mx-auto h-8 w-8 text-brand-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <p className="mt-1 text-xs font-semibold text-brand-600 dark:text-brand-400 truncate max-w-[200px]">
                                                    {data.photo_optional.name}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    {(
                                                        data.photo_optional
                                                            .size / 1024
                                                    ).toFixed(1)}{" "}
                                                    KB
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center p-3">
                                                <svg
                                                    className="mx-auto h-7 w-7 text-gray-400 group-hover:text-gray-600 transition-colors"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    {editingReport
                                                        ? "Pilih Foto Baru (Opsional)"
                                                        : "Pilih Foto Tambahan"}
                                                </p>
                                                <p className="text-[10px] text-gray-455">
                                                    Maks. 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {editingReport &&
                                        editingReport.photo_optional_path &&
                                        !data.photo_optional && (
                                            <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-150 dark:border-gray-800 w-max">
                                                <span className="text-[10px] text-gray-455 dark:text-gray-400 font-medium">
                                                    Foto Tersimpan:
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setViewingPhoto(
                                                            `/storage/${editingReport.photo_optional_path}`,
                                                        )
                                                    }
                                                    className="text-[10px] font-bold text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    [ Lihat Foto ]
                                                </button>
                                            </div>
                                        )}
                                    {errors.photo_optional && (
                                        <p className="text-xs text-error-500">
                                            {errors.photo_optional}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Catatan */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-755 dark:text-gray-300">
                                    Catatan / Keterangan
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    placeholder="Tambahkan catatan jika ada kendala saat pemuatan..."
                                    rows={3}
                                    className="rounded-xl border border-gray-200 bg-transparent p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white resize-none"
                                />
                                {errors.notes && (
                                    <p className="text-xs text-error-500">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>

                            {/* Submit Actions */}
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                                {editingReport ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-650 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05] transition-colors"
                                        >
                                            Batal Edit
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                        >
                                            {processing ? (
                                                <svg
                                                    className="h-4 w-4 animate-spin"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="h-4.5 w-4.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                            {processing
                                                ? "Memperbarui..."
                                                : "Perbarui Laporan"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05] transition-colors"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                        >
                                            {processing ? (
                                                <svg
                                                    className="h-4 w-4 animate-spin"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="h-4.5 w-4.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                            {processing
                                                ? "Mengirim..."
                                                : "Kirim Laporan"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Riwayat Penginputan (Tabel Laporan Muat) ── */}
                {loadReports.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-white/90">
                                    Riwayat Laporan Muat Anda
                                </h3>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Daftar laporan pemuatan yang pernah Anda
                                    kirimkan
                                </p>
                            </div>
                            <span className="px-2.5 py-1 text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg">
                                Total: {loadReports.length} Laporan
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50/30 dark:bg-white/[0.005]">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            DO / Unit
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Detail Timbangan
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Bukti Foto
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-end">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loadReports.map((report, index) => (
                                        <tr
                                            key={report.id}
                                            className={`hover:bg-gray-50/30 dark:hover:bg-white/[0.005] transition-colors text-sm ${editingReport?.id === report.id ? "bg-amber-500/5" : ""}`}
                                        >
                                            <td className="px-6 py-4 text-gray-400 font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800 dark:text-white">
                                                    {report.delivery_order
                                                        ?.nomor_do || "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    Unit:{" "}
                                                    {report.delivery_order
                                                        ?.nomor_unit || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-650 dark:text-gray-300">
                                                {new Date(
                                                    report.load_date,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 space-y-0.5">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Bruto:{" "}
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {parseFloat(
                                                            report.bruto,
                                                        ).toLocaleString()}{" "}
                                                        kg
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Tara:{" "}
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {parseFloat(
                                                            report.tara,
                                                        ).toLocaleString()}{" "}
                                                        kg
                                                    </span>
                                                </div>
                                                <div className="text-xs font-semibold text-brand-600 dark:text-brand-450">
                                                    Netto:{" "}
                                                    <span>
                                                        {parseFloat(
                                                            report.netto,
                                                        ).toLocaleString()}{" "}
                                                        kg
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    {/* Foto Wajib */}
                                                    {report.photo_required_path && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setViewingPhoto(
                                                                    `/storage/${report.photo_required_path}`,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg w-max"
                                                        >
                                                            <svg
                                                                className="h-3.5 w-3.5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth="2.5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            Lihat Gambar
                                                        </button>
                                                    )}
                                                    {/* Foto Opsional */}
                                                    {report.photo_optional_path ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setViewingPhoto(
                                                                    `/storage/${report.photo_optional_path}`,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-655 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-50 dark:bg-white/[0.04] px-2 py-1 rounded-lg w-max"
                                                        >
                                                            <svg
                                                                className="h-3.5 w-3.5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth="2.5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            Lihat Gambar
                                                            (Opsional)
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400 italic px-2">
                                                            Tanpa file tambahan
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-end">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            startEdit(report)
                                                        }
                                                        disabled={
                                                            editingReport?.id ===
                                                            report.id
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50 dark:border-amber-800/40 dark:text-amber-400 dark:hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                report,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-error-200 px-2.5 py-1.5 text-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-800/40 dark:text-error-400 dark:hover:bg-error-500/10"
                                                    >
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
