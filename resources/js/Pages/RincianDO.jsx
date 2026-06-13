import AppLayout from "@/Layouts/AppLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import Badge from "@/Components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

const formatDate = (value) => {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
};

const formatDateTime = (value) => {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

const formatKg = (value) => {
    if (value === null || value === undefined || value === "") return "-";

    return `${new Intl.NumberFormat("id-ID").format(Number(value) || 0)} kg`;
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);

const statusInfo = (order) => {
    if (order.is_complete) {
        return { label: "Lengkap", color: "success" };
    }

    if (order.load_report || order.unload_report) {
        return { label: "Parsial", color: "warning" };
    }

    return { label: "Belum Lapor", color: "light" };
};

const selisihInfo = (report) => {
    if (!report) return { label: "-", color: "light" };
    if (report.status_selisih === "surplus") return { label: "Surplus", color: "success" };
    if (report.status_selisih === "susut") return { label: "Susut", color: "error" };

    return { label: "Pas", color: "info" };
};

const SummaryCard = ({ label, value, hint }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
);

const EmptyReport = ({ label }) => (
    <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:text-gray-400">
        {label} belum tersedia
    </div>
);

export default function RincianDO({
    orders = [],
    whatsappConfigured = false,
    whatsappRecipients = [],
}) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("semua");
    const [popupState, setPopupState] = useState(null);
    const [processingTarget, setProcessingTarget] = useState(null);
    const [whatsappTarget, setWhatsappTarget] = useState(null);
    const [selectedRecipientId, setSelectedRecipientId] = useState("");

    useEffect(() => {
        if (flash?.success) {
            setPopupState({ type: "success", message: flash.success });
        }

        if (flash?.error) {
            setPopupState({ type: "error", message: flash.error });
        }
    }, [flash]);

    const summary = useMemo(() => {
        const complete = orders.filter((order) => order.is_complete).length;
        const partial = orders.filter(
            (order) => !order.is_complete && (order.load_report || order.unload_report),
        ).length;
        const notReported = orders.length - complete - partial;
        const totalNettoMuat = orders.reduce(
            (sum, order) => sum + (Number(order.load_report?.netto) || 0),
            0,
        );
        const totalNettoBongkar = orders.reduce(
            (sum, order) => sum + (Number(order.unload_report?.netto) || 0),
            0,
        );

        return {
            complete,
            partial,
            notReported,
            totalNettoMuat,
            totalNettoBongkar,
            totalSelisih: totalNettoBongkar - totalNettoMuat,
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();

        return orders.filter((order) => {
            const status = statusInfo(order).label.toLowerCase();
            const matchesStatus =
                statusFilter === "semua" ||
                (statusFilter === "lengkap" && order.is_complete) ||
                (statusFilter === "parsial" && status === "parsial") ||
                (statusFilter === "belum" && status === "belum lapor");

            const searchable = [
                order.nomor_do,
                order.nomor_unit,
                order.driver,
                status,
                order.unload_report?.status_selisih,
            ]
                .join(" ")
                .toLowerCase();

            return matchesStatus && searchable.includes(q);
        });
    }, [orders, searchTerm, statusFilter]);

    const hasWhatsappRecipients = whatsappRecipients.length > 0;
    const selectedRecipient = whatsappRecipients.find(
        (recipient) => String(recipient.id) === String(selectedRecipientId),
    );

    const openWhatsappDialog = (target) => {
        setWhatsappTarget(target);
        setSelectedRecipientId((current) => current || String(whatsappRecipients[0]?.id || ""));
    };

    const closeWhatsappDialog = () => {
        if (processingTarget === null) {
            setWhatsappTarget(null);
        }
    };

    const confirmWhatsappSend = () => {
        if (!whatsappTarget || !selectedRecipientId) {
            setPopupState({ type: "error", message: "Pilih akun penerima WA terlebih dahulu." });
            return;
        }

        const targetId = whatsappTarget.type === "all" ? "all" : whatsappTarget.order.id;
        const url =
            whatsappTarget.type === "all"
                ? route("rincian-do.whatsapp.all")
                : route("rincian-do.whatsapp", whatsappTarget.order.id);

        setProcessingTarget(targetId);
        router.post(url, { recipient_user_id: selectedRecipientId }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessingTarget(null);
                setWhatsappTarget(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Rincian Delivery Order" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase text-brand-500">
                            Admin Delivery Order
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                            Rincian Delivery Order
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Pantau seluruh DO beserta laporan muat, laporan bongkar, dan status selisih.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openWhatsappDialog({ type: "all" })}
                        disabled={
                            !whatsappConfigured ||
                            !hasWhatsappRecipients ||
                            summary.complete === 0 ||
                            processingTarget !== null
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-success-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-success-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 12h14m0 0l-5-5m5 5l-5 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {processingTarget === "all" ? "Mengirim..." : "Kirim Semua DO Lengkap ke WA"}
                    </button>
                </div>

                {!whatsappConfigured && (
                    <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-800 dark:bg-warning-500/10 dark:text-orange-300">
                        Bot WA belum dikonfigurasi. Isi `WHATSAPP_BOT_URL`
                        di file `.env`, lalu jalankan ulang config cache bila aplikasi memakai cache.
                    </div>
                )}

                {whatsappConfigured && !hasWhatsappRecipients && (
                    <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-800 dark:bg-warning-500/10 dark:text-orange-300">
                        Belum ada akun yang memiliki no HP. Isi field `nohp` di Manajemen User agar bisa dipilih sebagai penerima WA.
                    </div>
                )}

                {popupState && (
                    <div
                        className={`flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${
                            popupState.type === "success"
                                ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-500/10 dark:text-success-400"
                                : "border-error-200 bg-error-50 text-error-700 dark:border-error-800 dark:bg-error-500/10 dark:text-error-400"
                        }`}
                    >
                        <p className="font-medium">{popupState.message}</p>
                        <button
                            type="button"
                            onClick={() => setPopupState(null)}
                            className="text-current opacity-70 transition hover:opacity-100"
                            aria-label="Tutup pesan"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M5 5l10 10M15 5L5 15"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {whatsappTarget && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-950/50 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Pilih Penerima WA
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {whatsappTarget.type === "all"
                                        ? "Kirim semua DO lengkap ke akun yang dipilih."
                                        : `Kirim DO ${whatsappTarget.order.nomor_do} ke akun yang dipilih.`}
                                </p>
                            </div>

                            <div className="space-y-4 px-5 py-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Akun penerima
                                </label>
                                <select
                                    value={selectedRecipientId}
                                    onChange={(event) => setSelectedRecipientId(event.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                                >
                                    {whatsappRecipients.map((recipient) => (
                                        <option key={recipient.id} value={recipient.id}>
                                            {recipient.name} - {recipient.nohp}
                                        </option>
                                    ))}
                                </select>

                                {selectedRecipient && (
                                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                                        Pesan akan dikirim otomatis ke nomor {selectedRecipient.nohp}.
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={closeWhatsappDialog}
                                    disabled={processingTarget !== null}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmWhatsappSend}
                                    disabled={!selectedRecipientId || processingTarget !== null}
                                    className="rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-success-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processingTarget !== null ? "Mengirim..." : "Kirim Sekarang"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="Total DO" value={orders.length} hint={`${summary.complete} sudah lengkap`} />
                    <SummaryCard label="Parsial" value={summary.partial} hint={`${summary.notReported} belum lapor`} />
                    <SummaryCard label="Netto Muat" value={formatKg(summary.totalNettoMuat)} hint="Akumulasi laporan muat" />
                    <SummaryCard label="Selisih Netto" value={formatKg(summary.totalSelisih)} hint="Bongkar dikurangi muat" />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:max-w-md">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M9.166 15.833a6.667 6.667 0 100-13.334 6.667 6.667 0 000 13.334zM17.5 17.5l-3.625-3.625"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Cari nomor DO, unit, driver, atau status"
                                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                        >
                            <option value="semua">Semua Status</option>
                            <option value="lengkap">Lengkap</option>
                            <option value="parsial">Parsial</option>
                            <option value="belum">Belum Lapor</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-950">
                                <TableRow>
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Delivery Order
                                    </TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Laporan Muat
                                    </TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Laporan Bongkar
                                    </TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Aksi
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Tidak ada rincian DO yang sesuai dengan filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const status = statusInfo(order);
                                        const selisih = selisihInfo(order.unload_report);

                                        return (
                                            <TableRow key={order.id} className="align-top">
                                                <TableCell className="min-w-[220px] px-4 py-4">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {order.nomor_do}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {order.driver || "-"} / {order.nomor_unit}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatDateTime(order.created_at)}
                                                        </p>
                                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                            {formatCurrency(order.uang_jalan)}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-[220px] px-4 py-4">
                                                    {order.load_report ? (
                                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {formatDate(order.load_report.load_date)}
                                                            </p>
                                                            <p>Bruto: {formatKg(order.load_report.bruto)}</p>
                                                            <p>Tara: {formatKg(order.load_report.tara)}</p>
                                                            <p className="font-semibold text-brand-600 dark:text-brand-400">
                                                                Netto: {formatKg(order.load_report.netto)}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <EmptyReport label="Laporan muat" />
                                                    )}
                                                </TableCell>

                                                <TableCell className="min-w-[240px] px-4 py-4">
                                                    {order.unload_report ? (
                                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {formatDate(order.unload_report.unload_date)}
                                                            </p>
                                                            <p>Bruto: {formatKg(order.unload_report.bruto)}</p>
                                                            <p>Tara: {formatKg(order.unload_report.tara)}</p>
                                                            <p className="font-semibold text-brand-600 dark:text-brand-400">
                                                                Netto: {formatKg(order.unload_report.netto)}
                                                            </p>
                                                            <p className="text-xs font-semibold">
                                                                Selisih: {formatKg(order.unload_report.selisih)}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <EmptyReport label="Laporan bongkar" />
                                                    )}
                                                </TableCell>

                                                <TableCell className="min-w-[150px] px-4 py-4">
                                                    <div className="flex flex-col items-start gap-2">
                                                        <Badge color={status.color}>{status.label}</Badge>
                                                        <Badge color={selisih.color}>{selisih.label}</Badge>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-[170px] px-4 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => openWhatsappDialog({ type: "one", order })}
                                                        disabled={
                                                            !whatsappConfigured ||
                                                            !hasWhatsappRecipients ||
                                                            !order.is_complete ||
                                                            processingTarget !== null
                                                        }
                                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-success-200 px-3 py-2 text-xs font-semibold text-success-700 transition hover:bg-success-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-success-800 dark:text-success-400 dark:hover:bg-success-500/10"
                                                    >
                                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M3.5 10.5l4 4 9-9"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        {processingTarget === order.id ? "Mengirim..." : "Kirim WA"}
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
