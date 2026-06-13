import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Badge from "@/Components/ui/badge/Badge";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const textCollator = new Intl.Collator("id-ID", {
    numeric: true,
    sensitivity: "base",
    ignorePunctuation: true,
});

const normalizeText = (value) => String(value ?? "").trim();

const compareSortValues = (a, b, direction, type = "text") => {
    let result = 0;

    if (type === "number") {
        result = (Number(a) || 0) - (Number(b) || 0);
    } else if (type === "date") {
        result = (Date.parse(a) || 0) - (Date.parse(b) || 0);
    } else {
        result = textCollator.compare(normalizeText(a), normalizeText(b));
    }

    return direction === "asc" ? result : -result;
};

export default function PembuatanDO({
    drivers,
    deliveryOrders: initialDeliveryOrders,
}) {
    const { flash } = usePage().props;

    // Popup state: null | { type: 'success'|'error', message: string }
    const [popupState, setPopupState] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        items: [
            { driver_id: "", nomor_unit: "", nomor_do: "", uang_jalan: "" },
        ],
    });

    // Handle flash messages from server (for full-page submits)
    useEffect(() => {
        if (flash?.success) {
            setPopupState({ type: "success", message: flash.success });
            reset();
        }
    }, [flash]);

    // Form handlers
    const handleRowChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData("items", newItems);
    };

    const addRow = () => {
        setData("items", [
            ...data.items,
            { driver_id: "", nomor_unit: "", nomor_do: "", uang_jalan: "" },
        ]);
    };

    const removeRow = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData("items", newItems);
        }
    };

    // Single save-all button handler
    const handleSave = () => {
        // Clear all previous errors
        clearErrors();

        // Client-side validation for all rows
        let hasError = false;
        data.items.forEach((item, index) => {
            if (!item.driver_id) {
                setError(
                    `items.${index}.driver_id`,
                    "Nama driver wajib diisi.",
                );
                hasError = true;
            }
            if (!item.nomor_unit) {
                setError(
                    `items.${index}.nomor_unit`,
                    "Nomor unit wajib diisi.",
                );
                hasError = true;
            }
            if (!item.nomor_do) {
                setError(`items.${index}.nomor_do`, "Nomor DO wajib diisi.");
                hasError = true;
            }
            if (!item.uang_jalan) {
                setError(
                    `items.${index}.uang_jalan`,
                    "Uang jalan wajib diisi.",
                );
                hasError = true;
            } else if (
                isNaN(item.uang_jalan) ||
                parseFloat(item.uang_jalan) < 0
            ) {
                setError(
                    `items.${index}.uang_jalan`,
                    "Uang jalan tidak boleh kurang dari 0.",
                );
                hasError = true;
            }
        });

        if (hasError) {
            setPopupState({
                type: "error",
                message:
                    "Harap perbaiki kesalahan pada form sebelum menyimpan.",
            });
            return;
        }

        router.post(
            route("pembuatan-do.store"),
            {
                items: data.items,
            },
            {
                preserveState: true,
                onSuccess: () => {
                    setPopupState({
                        type: "success",
                        message: `${data.items.length} data DO berhasil disimpan!`,
                    });
                    // Reset form to 1 empty row
                    setData("items", [
                        {
                            driver_id: "",
                            nomor_unit: "",
                            nomor_do: "",
                            uang_jalan: "",
                        },
                    ]);
                },
                onError: (serverErrors) => {
                    setError(serverErrors);
                    setPopupState({
                        type: "error",
                        message:
                            "Gagal menyimpan data DO. Periksa kembali isian form.",
                    });
                },
            },
        );
    };

    // Table State (Search, Sorting, Pagination)
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState({ col: "created_at", dir: "desc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pastikan initialDeliveryOrders adalah array murni
    const ordersArray = useMemo(
        () => Array.from(initialDeliveryOrders ?? []),
        [initialDeliveryOrders],
    );

    // Filter & Sort data
    const filteredOrders = useMemo(() => {
        return ordersArray.filter((order) => {
            const driverName = order.driver?.name?.toLowerCase() || "";
            const nomorUnit = order.nomor_unit?.toLowerCase() || "";
            const nomorDo = order.nomor_do?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return (
                driverName.includes(search) ||
                nomorUnit.includes(search) ||
                nomorDo.includes(search)
            );
        });
    }, [ordersArray, searchTerm]);

    const sortedOrders = useMemo(() => {
        if (!sort.col) return filteredOrders;

        const result = [...filteredOrders].sort((a, b) => {
            let valA;
            let valB;
            let type = "text";

            if (sort.col === "driver") {
                valA = a.driver?.name || "";
                valB = b.driver?.name || "";
            } else if (sort.col === "uang_jalan") {
                valA = a.uang_jalan;
                valB = b.uang_jalan;
                type = "number";
            } else if (sort.col === "created_at") {
                valA = a.created_at;
                valB = b.created_at;
                type = "date";
            } else {
                valA = a[sort.col] || "";
                valB = b[sort.col] || "";
            }

            return (
                compareSortValues(valA, valB, sort.dir, type) ||
                (Number(a.id) || 0) - (Number(b.id) || 0)
            );
        });

        console.log("[SORTED ORDERS] col:", sort.col, "dir:", sort.dir, "first 3:", result.slice(0, 3).map(o => o.driver?.name || o.nomor_do));
        return result;
    }, [filteredOrders, sort]);


    // Pagination
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedOrders.slice(start, start + rowsPerPage);
    }, [sortedOrders, currentPage, rowsPerPage]);

    // Reset pagination to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    // Formatting helpers
    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AppLayout>
            <Head title="Pembuatan DO" />

            {/* ── Success / Error Popup ─────────────────────────────────────── */}
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
                        className={`
                        relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden
                        ${
                            popupState.type === "success"
                                ? "bg-white dark:bg-gray-900 border border-success-200 dark:border-success-800"
                                : "bg-white dark:bg-gray-900 border border-error-200 dark:border-error-800"
                        }
                    `}
                    >
                        {/* Colored top strip */}
                        <div
                            className={`h-1.5 w-full ${popupState.type === "success" ? "bg-success-500" : "bg-error-500"}`}
                        />

                        <div className="p-6">
                            {/* Icon + Title */}
                            <div className="flex items-start gap-4">
                                <div
                                    className={`
                                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                                    ${
                                        popupState.type === "success"
                                            ? "bg-success-100 dark:bg-success-500/20"
                                            : "bg-error-100 dark:bg-error-500/20"
                                    }
                                `}
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
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className={`text-lg font-bold ${popupState.type === "success" ? "text-success-700 dark:text-success-400" : "text-error-700 dark:text-error-400"}`}
                                    >
                                        {popupState.type === "success"
                                            ? "Berhasil Disimpan!"
                                            : "Gagal Menyimpan"}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {popupState.message}
                                    </p>
                                </div>
                            </div>

                            {/* Close button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setPopupState(null)}
                                    className={`
                                        inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
                                        ${
                                            popupState.type === "success"
                                                ? "bg-success-600 hover:bg-success-700 text-white"
                                                : "bg-error-600 hover:bg-error-700 text-white"
                                        }
                                    `}
                                >
                                    {popupState.type === "success" ? (
                                        <>
                                            <svg
                                                className="w-4 h-4"
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
                                            Oke, Tutup
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Tutup
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            <div className="space-y-6">
                {/* Form Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-theme-sm overflow-hidden">
                    <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Pembuatan Delivery Order (DO) Driver
                            </h2>
                            <p className="text-theme-xs text-gray-500 mt-0.5">
                                Input multi data DO pengiriman secara bersamaan
                            </p>
                        </div>
                        <Badge variant="light" color="primary" size="sm">
                            {data.items.length} Item DO
                        </Badge>
                    </div>

                    <div className="p-6">
                        {errors.items && (
                            <div className="mb-4 text-sm text-error-600 font-medium">
                                {errors.items}
                            </div>
                        )}

                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200/60 dark:border-gray-800/80 relative transition-all"
                                >
                                    {/* Header Item */}
                                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            DO #{index + 1}
                                        </span>
                                        {data.items.length > 1 && (
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => removeRow(index)}
                                                className="text-error-500 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-950/20 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold disabled:opacity-50"
                                                title="Hapus baris ini"
                                            >
                                                <svg
                                                    className="h-4 w-4"
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
                                        )}
                                    </div>

                                    {/* Fields Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {/* Driver Select */}
                                        <div>
                                            <InputLabel
                                                htmlFor={`driver-${index}`}
                                                value="Nama Driver"
                                                className="text-xs mb-1"
                                            />
                                            <select
                                                id={`driver-${index}`}
                                                value={item.driver_id}
                                                onChange={(e) =>
                                                    handleRowChange(
                                                        index,
                                                        "driver_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full h-[42px] px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800"
                                            >
                                                <option value="">
                                                    -- Pilih Driver --
                                                </option>
                                                {drivers.map((driver) => (
                                                    <option
                                                        key={driver.id}
                                                        value={driver.id}
                                                    >
                                                        {driver.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                className="mt-1"
                                                message={
                                                    errors[
                                                        `items.${index}.driver_id`
                                                    ]
                                                }
                                            />
                                        </div>

                                        {/* Nomor Unit */}
                                        <div>
                                            <InputLabel
                                                htmlFor={`unit-${index}`}
                                                value="Nomor Unit"
                                                className="text-xs mb-1"
                                            />
                                            <input
                                                id={`unit-${index}`}
                                                type="text"
                                                value={item.nomor_unit}
                                                placeholder="Contoh: DT-104"
                                                onChange={(e) =>
                                                    handleRowChange(
                                                        index,
                                                        "nomor_unit",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full h-[42px] px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800"
                                            />
                                            <InputError
                                                className="mt-1"
                                                message={
                                                    errors[
                                                        `items.${index}.nomor_unit`
                                                    ]
                                                }
                                            />
                                        </div>

                                        {/* Nomor DO */}
                                        <div>
                                            <InputLabel
                                                htmlFor={`do-${index}`}
                                                value="Nomor DO"
                                                className="text-xs mb-1"
                                            />
                                            <input
                                                id={`do-${index}`}
                                                type="text"
                                                value={item.nomor_do}
                                                placeholder="Contoh: DO-998877"
                                                onChange={(e) =>
                                                    handleRowChange(
                                                        index,
                                                        "nomor_do",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full h-[42px] px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800"
                                            />
                                            <InputError
                                                className="mt-1"
                                                message={
                                                    errors[
                                                        `items.${index}.nomor_do`
                                                    ]
                                                }
                                            />
                                        </div>

                                        {/* Uang Jalan */}
                                        <div>
                                            <InputLabel
                                                htmlFor={`allowance-${index}`}
                                                value="Uang Jalan (Rupiah)"
                                                className="text-xs mb-1"
                                            />
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                                                    Rp
                                                </span>
                                                <input
                                                    id={`allowance-${index}`}
                                                    type="number"
                                                    value={item.uang_jalan}
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        handleRowChange(
                                                            index,
                                                            "uang_jalan",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full h-[42px] pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800"
                                                />
                                            </div>
                                            <InputError
                                                className="mt-1"
                                                message={
                                                    errors[
                                                        `items.${index}.uang_jalan`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Row — Tambah DO | Simpan DO */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                            {/* Left: Tambah + Simpan together */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={addRow}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Tambah Data DO
                                </button>

                                {/* Single Simpan DO button */}
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={handleSave}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold shadow-theme-xs transition-colors duration-200 disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
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
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                                />
                                            </svg>
                                            Simpan DO
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Card */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 sm:px-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                            Riwayat Pembuatan DO
                        </h3>
                    </div>

                    <div className="p-5 sm:p-6">
                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                            {/* Search and entries count */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredOrders.length} entries
                                </p>
                                <div className="flex items-center gap-3">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    {/* Entries Selector */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">
                                            Show:
                                        </span>
                                        <select
                                            value={rowsPerPage}
                                            onChange={(e) =>
                                                setRowsPerPage(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="h-10 px-2.5 rounded-lg border border-gray-200 bg-transparent text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-brand-300"
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-full overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-16"
                                            >
                                                No
                                            </TableCell>
                                            <Th
                                                col="driver"
                                                sort={sort}
                                                setSort={setSort}
                                                onResetPage={() =>
                                                    setCurrentPage(1)
                                                }
                                            >
                                                Nama Driver
                                            </Th>
                                            <Th
                                                col="nomor_unit"
                                                sort={sort}
                                                setSort={setSort}
                                                onResetPage={() =>
                                                    setCurrentPage(1)
                                                }
                                            >
                                                Nomor Unit
                                            </Th>
                                            <Th
                                                col="nomor_do"
                                                sort={sort}
                                                setSort={setSort}
                                                onResetPage={() =>
                                                    setCurrentPage(1)
                                                }
                                            >
                                                Nomor DO
                                            </Th>
                                            <Th
                                                col="uang_jalan"
                                                sort={sort}
                                                setSort={setSort}
                                                onResetPage={() =>
                                                    setCurrentPage(1)
                                                }
                                            >
                                                Uang Jalan
                                            </Th>
                                            <Th
                                                col="created_at"
                                                sort={sort}
                                                setSort={setSort}
                                                onResetPage={() =>
                                                    setCurrentPage(1)
                                                }
                                            >
                                                Tanggal Dibuat
                                            </Th>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {paginatedOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    className="px-5 py-10 text-center text-gray-400 dark:text-gray-500"
                                                    colSpan={6}
                                                >
                                                    Tidak ada data Delivery
                                                    Order ditemukan.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedOrders.map(
                                                (order, idx) => (
                                                    <TableRow
                                                        key={order.id}
                                                        className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                                                    >
                                                        <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-400">
                                                            {(currentPage - 1) *
                                                                rowsPerPage +
                                                                idx +
                                                                1}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                                            {order.driver
                                                                ?.name ||
                                                                "Driver Tidak Dikenal"}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                            {order.nomor_unit}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                            {order.nomor_do}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 font-semibold text-brand-600 text-theme-sm dark:text-brand-400 whitespace-nowrap">
                                                            {formatRupiah(
                                                                order.uang_jalan,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400 whitespace-nowrap">
                                                            {formatDate(
                                                                order.created_at,
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <Pagination
                                page={currentPage}
                                total={filteredOrders.length}
                                perPage={rowsPerPage}
                                onPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// ── Subcomponents ──────────────────────────────────────────────────────────────

function Th({ col, sort, setSort, onResetPage, children }) {
    return (
        <TableCell
            isHeader
            className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 cursor-pointer select-none whitespace-nowrap"
            onClick={() => {
                setSort(
                    sort.col === col
                        ? { col, dir: sort.dir === "asc" ? "desc" : "asc" }
                        : { col, dir: "asc" },
                );
                onResetPage();
            }}
        >
            <span className="inline-flex items-center gap-0.5">
                {children}
                <SortArrow active={sort.col === col} dir={sort.dir} />
            </span>
        </TableCell>
    );
}

function SortArrow({ active, dir }) {
    return (
        <span className="inline-flex flex-col gap-0.5 ml-1 align-middle">
            <svg
                className={`w-2 h-1.5 fill-current transition-colors ${active && dir === "asc" ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`}
                viewBox="0 0 8 5"
            >
                <path d="M4.41 0.585C4.21 0.301 3.79 0.301 3.59 0.585L1.05 4.213C0.819 4.545 1.056 5 1.46 5H6.54C6.944 5 7.181 4.545 6.949 4.213L4.41 0.585Z" />
            </svg>
            <svg
                className={`w-2 h-1.5 fill-current transition-colors ${active && dir === "desc" ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`}
                viewBox="0 0 8 5"
            >
                <path d="M4.41 4.415C4.21 4.699 3.79 4.699 3.59 4.415L1.05 0.787C0.819 0.455 1.056 0 1.46 0H6.54C6.944 0 7.181 0.455 6.949 0.787L4.41 4.415Z" />
            </svg>
        </span>
    );
}

function SearchInput({ value, onChange }) {
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <svg className="size-4 fill-current" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04 9.374C3.04 5.877 5.877 3.042 9.375 3.042c3.498 0 6.333 2.835 6.333 6.332 0 3.497-2.835 6.332-6.333 6.332-3.498 0-6.334-2.835-6.334-6.332Zm6.334-7.832C5.05 1.542 1.542 5.049 1.542 9.374c0 4.325 3.508 7.832 7.832 7.832 1.892 0 3.628-.67 4.982-1.787l2.82 2.82a.75.75 0 1 0 1.061-1.06l-2.818-2.82A7.792 7.792 0 0 0 17.208 9.374C17.208 5.049 13.7 1.542 9.374 1.542Z"
                    />
                </svg>
            </span>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-transparent py-2 pr-4 pl-9 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800 xl:w-[260px]"
            />
        </div>
    );
}

function Pagination({ page, total, perPage, onPage }) {
    const totalPages = Math.ceil(total / perPage) || 1;
    const from = Math.min((page - 1) * perPage + 1, total);
    const to = Math.min(page * perPage, total);

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
            pages.push(i);
        } else if (i === page - 2 || i === page + 2) {
            pages.push("...");
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-5 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {from}–{to} of {total} results
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    Previous
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span
                            key={i}
                            className="px-1 text-gray-400 select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            type="button"
                            key={p}
                            onClick={() => onPage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                page === p
                                    ? "bg-brand-500/[0.08] text-brand-600 dark:text-brand-400"
                                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                            }`}
                        >
                            {p}
                        </button>
                    ),
                )}
                <button
                    type="button"
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
