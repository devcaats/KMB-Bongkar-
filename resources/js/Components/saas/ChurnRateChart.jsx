import Chart from "react-apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../icons";

export default function ChurnRateChart() {
    const [isOpen, setIsOpen] = useState(false);

    const chartOptions = {
        colors: ["#ea580c"], // orange/red for churn
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "area",
            height: 48,
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        tooltip: {
            fixed: {
                enabled: false,
            },
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => "Churn: ",
                },
            },
            marker: {
                show: false,
            },
        },
    };

    const series = [
        {
            name: "Churn Rate",
            data: [4.8, 4.5, 4.6, 4.3, 4.4, 4.1, 4.26],
        },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Churn Rate
                    </h3>
                    <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
                        Downgrade to Free plan
                    </p>
                </div>
                <div className="relative inline-block h-fit">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                    </button>
                    <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
                        <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            View More
                        </DropdownItem>
                        <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-title-xs font-semibold text-gray-800 dark:text-white/90">
                        4.26%
                    </h3>
                    <p className="text-theme-xs mt-1 text-gray-500 dark:text-gray-400">
                        <span className="text-error-500 mr-1 inline-block">0.31%</span>
                        than last Week
                    </p>
                </div>
                <div className="w-24 h-12">
                    <Chart options={chartOptions} series={series} type="area" height={48} width={96} />
                </div>
            </div>
        </div>
    );
}
