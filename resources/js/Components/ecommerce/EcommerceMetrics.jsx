import { useMemo } from "react";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine } from "../icons";
import Badge from "../ui/badge/Badge";
import { usePage } from "@inertiajs/react";

// Helper function to get Indonesian month names dynamically
function getPrevAndCurrentMonth() {
    const now = new Date();
    const thisMonth = now.toLocaleString("id-ID", { month: "long" });
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = prev.toLocaleString("id-ID", { month: "long" });
    return { thisMonth, prevMonth };
}

// Helper function to get a dynamic greeting based on time of day
function getGreeting() {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Pagi";
    if (hours >= 12 && hours < 16) return "Siang";
    if (hours >= 16 && hours < 19) return "Sore";
    return "Malam";
}

export default function EcommerceMetrics({ metrics }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || "User";
    const greeting = getGreeting();

    const doCount = metrics?.do_count_this_month ?? 0;
    const doPercent = metrics?.do_percentage_change ?? 0;
    const doDir = metrics?.do_percentage_direction ?? "up";

    const { thisMonth, prevMonth } = getPrevAndCurrentMonth();

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* <!-- Logo KMB & Greeting Card Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/shape/logo.svg"
                        alt="KMB Logo"
                        className="w-12 h-12 object-contain"
                    />
                    <div>
                        <h3 className="font-extrabold text-brand-600 dark:text-brand-400 text-lg leading-tight">
                            We CARE
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            for Every Load We Carry
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Selamat {greeting},{" "}
                        <span className="text-brand-600 dark:text-brand-400 font-bold">
                            {userName}
                        </span>
                        !
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                        <svg
                            className="w-4 h-4 text-brand-500 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                        Selamat Bekerja!
                    </p>
                </div>
            </div>
            {/* <!-- Logo KMB & Greeting Card End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Delivery Orders Bulan Ini
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {doCount.toLocaleString("id-ID")}
                        </h4>
                    </div>

                    <Badge color={doDir === "up" ? "success" : "error"}>
                        {doDir === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        {doPercent}%
                        <span className="month-cmp">
                            {prevMonth} → {thisMonth}
                        </span>
                    </Badge>
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
}
