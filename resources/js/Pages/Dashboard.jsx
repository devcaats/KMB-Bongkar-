import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import EcommerceMetrics from "@/Components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/Components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/Components/ecommerce/StatisticsChart";
import RecentOrders from "@/Components/ecommerce/RecentOrders";
import DemographicCard from "@/Components/ecommerce/DemographicCard";

export default function Dashboard({
    metrics,
    recent_logs,
    driver_stats,
    statistics_chart,
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const fmtKg = (val) =>
        val != null ? parseFloat(val).toLocaleString("id-ID") + " kg" : "—";

    const fmtDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    if (user?.role === "driver") {
        return (
            <AppLayout>
                <Head title="Dashboard Driver" />

                <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                                    <span className="h-1.5 w-1.5 rounded-full bg-success-400 animate-pulse" />
                                    Driver Aktif
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">
                                    Halo, {user.name}! 👋
                                </h2>
                                <p className="text-white/80 text-sm mt-1.5 max-w-xl">
                                    Selamat datang di portal driver KMB Bongkar.
                                    Laporkan aktivitas pemuatan, pembongkaran,
                                    atau ajukan perbaikan unit kendaraan Anda
                                    langsung di sini.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/10">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-xl" />
                        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-500/10 rounded-full translate-y-12 blur-lg" />
                    </div>

                    {/* Features Grid */}
                    <div>
                        <h3 className="text-base font-bold text-gray-800 dark:text-white/95 mb-4">
                            Pilih Layanan Pelaporan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Card: Laporan Muat */}
                            <Link
                                href="/laporan-muat"
                                className="group relative block rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-800 overflow-hidden"
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-450 mb-5 transition-transform duration-300 group-hover:scale-110">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white/95">
                                            Laporan Muat
                                        </h4>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Catat nomor DO, lokasi muat, berat
                                            muatan, dan detail surat jalan saat
                                            memulai perjalanan.
                                        </p>
                                    </div>
                                    <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-450 group-hover:gap-2 transition-all">
                                        Buat Laporan
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Link>

                            {/* Card: Laporan Bongkar */}
                            <Link
                                href="/laporan-bongkar"
                                className="group relative block rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-800 overflow-hidden"
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-5 transition-transform duration-300 group-hover:scale-110">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white/95">
                                            Laporan Bongkar
                                        </h4>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Catat timbangan bongkar, lokasi
                                            tujuan, dan bukti bongkar muatan
                                            setelah sampai tujuan.
                                        </p>
                                    </div>
                                    <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                                        Buat Laporan
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Link>

                            {/* Card: Maintenance Unit */}
                            <Link
                                href="/maintenance-unit"
                                className="group relative block rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-800 overflow-hidden"
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-5 transition-transform duration-300 group-hover:scale-110">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white/95">
                                            Maintenance Unit
                                        </h4>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Ajukan keluhan kerusakan kendaraan,
                                            perbaikan ban, ganti oli, servis
                                            rutin, atau masalah unit lainnya.
                                        </p>
                                    </div>
                                    <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
                                        Laporkan Masalah
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <StatisticsChart chartData={statistics_chart} />

                    {/* ── Statistik Per Tanggal ── */}
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sm:px-6">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                    Statistik Netto Per Tanggal
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Ringkasan netto muat, netto bongkar, dan
                                    selisih (susut/surplus) berdasarkan tanggal
                                    DO dibuat
                                </p>
                            </div>
                            <span className="px-2.5 py-1 text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg">
                                {driver_stats?.length ?? 0} Hari
                            </span>
                        </div>

                        {!driver_stats || driver_stats.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Belum ada data laporan muat atau bongkar.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02]">
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                    Netto Muat
                                                </span>
                                            </th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                                                    Netto Bongkar
                                                </span>
                                            </th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Susut / Surplus
                                            </th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {driver_stats.map((row, i) => {
                                            const hasBongkar =
                                                row.netto_bongkar !== null;
                                            const selisih = row.selisih;
                                            const status = row.status;

                                            const statusBadge = () => {
                                                if (!hasBongkar)
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                            Belum Dibongkar
                                                        </span>
                                                    );
                                                if (status === "surplus")
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400 border border-success-200 dark:border-success-800">
                                                            ▲ Surplus
                                                        </span>
                                                    );
                                                if (status === "susut")
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400 border border-error-200 dark:border-error-800">
                                                            ▼ Susut
                                                        </span>
                                                    );
                                                return (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                        = Pas
                                                    </span>
                                                );
                                            };

                                            const selisihDisplay = () => {
                                                if (!hasBongkar)
                                                    return (
                                                        <span className="text-gray-400">
                                                            —
                                                        </span>
                                                    );
                                                const abs =
                                                    Math.abs(
                                                        selisih,
                                                    ).toLocaleString("id-ID");
                                                if (status === "surplus")
                                                    return (
                                                        <span className="font-bold text-success-600 dark:text-success-400">
                                                            +{abs} kg
                                                        </span>
                                                    );
                                                if (status === "susut")
                                                    return (
                                                        <span className="font-bold text-error-600 dark:text-error-400">
                                                            −{abs} kg
                                                        </span>
                                                    );
                                                return (
                                                    <span className="font-bold text-gray-600 dark:text-gray-400">
                                                        0 kg
                                                    </span>
                                                );
                                            };

                                            return (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-gray-50/40 dark:hover:bg-white/[0.005] transition-colors"
                                                >
                                                    <td className="px-5 py-3.5 font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                        {fmtDate(row.tanggal)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap">
                                                        {fmtKg(row.netto_muat)}
                                                    </td>
                                                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap">
                                                        {hasBongkar ? (
                                                            <span className="text-indigo-600 dark:text-indigo-400">
                                                                {fmtKg(
                                                                    row.netto_bongkar,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic text-xs">
                                                                Menunggu bongkar
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        {selisihDisplay()}
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        {statusBadge()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity Logs */}
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sm:px-6">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                    Aktivitas Terakhir Anda
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Riwayat 5 pelaporan terakhir yang Anda
                                    kirimkan
                                </p>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {!recent_logs || recent_logs.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-400">
                                    Belum ada riwayat laporan yang dikirimkan.
                                </div>
                            ) : (
                                recent_logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-55/30 dark:hover:bg-white/[0.01] transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                                        log.activity ===
                                                        "Laporan Muat"
                                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                            : log.activity ===
                                                                "Laporan Bongkar"
                                                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                                              : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                    }`}
                                                >
                                                    {log.activity}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-650 dark:text-gray-300 font-medium">
                                                {log.details}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Default dashboard (admin/finance)
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Metrics Row */}
                <div className="col-span-12">
                    <EcommerceMetrics metrics={metrics} />
                </div>

                {/* Statistics Chart */}
                <div className="col-span-12">
                    <StatisticsChart chartData={statistics_chart} />
                </div>

                {/* Monthly Sales Chart */}
                {/* <div className="col-span-12">
                    <MonthlySalesChart />
                </div> */}

                {/* Demographics */}
                {/* <div className="col-span-12 xl:col-span-5">
                    <DemographicCard />
                </div> */}

                {/* Recent Orders */}
                {/* <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div> */}
            </div>
        </AppLayout>
    );
}
