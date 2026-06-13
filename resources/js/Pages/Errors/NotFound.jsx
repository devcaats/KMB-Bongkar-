import { Head, Link } from "@inertiajs/react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function NotFound() {
    return (
        <ThemeProvider>
            <Head title="404 – Halaman Tidak Ditemukan" />

            <div className="relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white p-6 dark:bg-gray-950">

                {/* ── Decorative grid corners ── */}
                <div className="pointer-events-none absolute right-0 top-0 -z-10 w-full max-w-[260px] opacity-60 xl:max-w-[420px]">
                    <GridShape />
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 -z-10 w-full max-w-[260px] rotate-180 opacity-60 xl:max-w-[420px]">
                    <GridShape />
                </div>

                {/* ── Center content ── */}
                <div className="mx-auto w-full max-w-[320px] text-center sm:max-w-[480px]">

                    {/* ERROR label */}
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-500">
                        Error
                    </p>

                    {/* Big 404 */}
                    <div className="relative mb-6 flex items-center justify-center">
                        <span
                            className="select-none text-[10rem] font-black leading-none text-gray-100 dark:text-white/[0.04] sm:text-[14rem]"
                            aria-hidden="true"
                        >
                            404
                        </span>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            {/* Floating KMB Logo */}
                            <div className="animate-bounce rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <img
                                    src="/icon/icon.svg"
                                    alt="KMB Logo"
                                    className="h-16 w-16 object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white/90 sm:text-3xl">
                        Halaman Tidak Ditemukan
                    </h1>

                    {/* Description */}
                    <p className="mb-8 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
                        Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                            Kembali ke Beranda
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Halaman Sebelumnya
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-gray-400 dark:text-gray-600">
                    © {new Date().getFullYear()} KMB Bongkar — All rights reserved
                </p>
            </div>
        </ThemeProvider>
    );
}

function GridShape() {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
        >
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1.5" className="fill-gray-200 dark:fill-gray-800" />
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#grid)" />
            {/* Gradient fade toward center */}
            <rect
                width="400"
                height="400"
                fill="url(#fade)"
            />
            <defs>
                <radialGradient id="fade" cx="100%" cy="0%" r="70%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                </radialGradient>
            </defs>
        </svg>
    );
}
