import { Head, Link } from "@inertiajs/react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function ServerError() {
    return (
        <ThemeProvider>
            <Head title="500 - Server Error" />

            <div className="relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white p-6 dark:bg-gray-950">
                <div className="pointer-events-none absolute right-0 top-0 -z-10 w-full max-w-[260px] opacity-60 xl:max-w-[420px]">
                    <GridShape />
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 -z-10 w-full max-w-[260px] rotate-180 opacity-60 xl:max-w-[420px]">
                    <GridShape />
                </div>

                <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-error-500">
                        Server Error
                    </p>

                    {/* Big 500 */}
                    <div className="relative mb-8 flex items-center justify-center">
                        <span
                            className="select-none text-[10rem] font-black leading-none text-red-50 dark:text-red-900/20 sm:text-[14rem]"
                            aria-hidden="true"
                        >
                            500
                        </span>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="animate-bounce rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-900 border border-red-100 dark:border-red-900/40">
                                <div className="relative">
                                    <img
                                        src="/icon/icon.svg"
                                        alt="KMB Logo"
                                        className="h-16 w-16 object-contain opacity-80"
                                    />
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                                        !
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white/90 sm:text-3xl">
                        Terjadi Kesalahan Server
                    </h1>

                    <p className="mb-8 max-w-[460px] text-base text-gray-500 dark:text-gray-400 sm:text-lg">
                        Maaf, sistem sedang mengalami gangguan. Silakan coba lagi
                        beberapa saat lagi.
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
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
                                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                                />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                            Kembali ke Beranda
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
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
                                    d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0 0 19 5M19 5h-5M5 19h5"
                                />
                            </svg>
                            Coba Lagi
                        </button>
                    </div>
                </div>

                <p className="absolute bottom-6 left-1/2 w-full max-w-[calc(100%-3rem)] -translate-x-1/2 text-center text-sm text-gray-400 dark:text-gray-600">
                    © {new Date().getFullYear()} KMB Bongkar - All rights
                    reserved
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
            className="h-full w-full"
        >
            <defs>
                <pattern
                    id="server-error-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                >
                    <circle
                        cx="1"
                        cy="1"
                        r="1.5"
                        className="fill-gray-200 dark:fill-gray-800"
                    />
                </pattern>
                <radialGradient id="server-error-fade" cx="100%" cy="0%" r="70%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                </radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#server-error-grid)" />
            <rect width="400" height="400" fill="url(#server-error-fade)" />
        </svg>
    );
}
