import React from "react";
import { Link } from "@inertiajs/react";
import GridShape from "../common/GridShape";
import ThemeTogglerTwo from "../common/ThemeTogglerTwo";

export default function AuthLayout({ children }) {
    return (
        <>
            <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
                {/* Perbaikan typo dari dark:bg-grey-900 menjadi dark:bg-gray-900 */}
                <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
                    {children}
                    <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
                        <div className="relative flex items-center justify-center z-10">
                            <GridShape />
                            <div className="flex flex-col items-center max-w-ws">
                                <Link href="/" className="block mb-4">
                                    <img
                                        width={231}
                                        height={48}
                                        src="/images/shape/logo.svg"
                                        alt="Logo"
                                    />
                                </Link>
                                <div className="flex flex-col items-center text-center px-8">
                                    <p className="text-4xl font-bold leading-tight text-white">
                                        We{" "}
                                        <span
                                            className="text-blue-400"
                                            style={{
                                                borderBottom:
                                                    "3px solid #60a5fa",
                                                paddingBottom: "2px",
                                            }}
                                        >
                                            CARE
                                        </span>
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-white">
                                        for Every Load We Carry
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mengganti teks mentah dengan komponen tombol toggle aktif */}
                    <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </div>
        </>
    );
}
