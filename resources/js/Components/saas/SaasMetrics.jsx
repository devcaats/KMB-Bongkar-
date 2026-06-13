import { useState } from "react";

const periodData = {
    weekly: {
        revenue: "$45,210.89",
        revenueTrend: "+1.8%",
        revenueUp: true,
        users: "2,840",
        usersTrend: "+4.2%",
        usersUp: true,
        clv: "$810.20",
        clvTrend: "-0.5%",
        clvUp: false,
        cac: "2,105",
        cacTrend: "+1.2%",
        cacUp: true
    },
    monthly: {
        revenue: "$200,45.87",
        revenueTrend: "+2.5%",
        revenueUp: true,
        users: "9,528",
        usersTrend: "+9.5%",
        usersUp: true,
        clv: "$849.54",
        clvTrend: "-1.6%",
        clvUp: false,
        cac: "9,528",
        cacTrend: "+3.5%",
        cacUp: true
    },
    yearly: {
        revenue: "$2,405,180.00",
        revenueTrend: "+12.4%",
        revenueUp: true,
        users: "114,950",
        usersTrend: "+25.1%",
        usersUp: true,
        clv: "$920.80",
        clvTrend: "+5.8%",
        clvUp: true,
        cac: "114,950",
        cacTrend: "+8.2%",
        cacUp: true
    }
};

export default function SaasMetrics() {
    const [period, setPeriod] = useState("monthly");
    const data = periodData[period];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Overview
                    </h3>
                </div>
                <div className="flex gap-x-3.5">
                    <div className="inline-flex w-full items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                        {["weekly", "monthly", "yearly"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium capitalize transition-colors ${
                                    period === p
                                        ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <div>
                        <button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <svg
                                className="fill-white stroke-current dark:fill-gray-800"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2.29004 5.90393H17.7067"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M17.7075 14.0961H2.29085"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                            </svg>
                            <span className="hidden sm:block">Filter</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
                {/* Metric 1 */}
                <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Total Revenue
                    </span>
                    <div className="mt-2 flex items-end gap-3">
                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                            {data.revenue}
                        </h4>
                        <div>
                            <span className={`flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium ${
                                data.revenueUp
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                            }`}>
                                {data.revenueTrend}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="border-b border-gray-200 px-6 py-5 xl:border-r xl:border-b-0 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Active Users
                    </span>
                    <div className="mt-2 flex items-end gap-3">
                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                            {data.users}
                        </h4>
                        <div>
                            <span className={`flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium ${
                                data.usersUp
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                            }`}>
                                {data.usersTrend}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Customer Lifetime Value
                    </span>
                    <div className="mt-2 flex items-end gap-3">
                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                            {data.clv}
                        </h4>
                        <div>
                            <span className={`flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium ${
                                data.clvUp
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                            }`}>
                                {data.clvTrend}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="px-6 py-5">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Customer Acquisition Cost
                    </span>
                    <div className="mt-2 flex items-end gap-3">
                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                            {data.cac}
                        </h4>
                        <div>
                            <span className={`flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium ${
                                data.cacUp
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                            }`}>
                                {data.cacTrend}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
