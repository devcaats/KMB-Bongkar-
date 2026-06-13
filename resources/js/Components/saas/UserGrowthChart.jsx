import Chart from "react-apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../icons";

export default function UserGrowthChart() {
    const [isOpen, setIsOpen] = useState(false);

    const chartOptions = {
        colors: ["#10b981"], // green for growth
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
                    formatter: () => "New Signups: ",
                },
            },
            marker: {
                show: false,
            },
        },
    };

    const series = [
        {
            name: "User Growth",
            data: [3200, 3400, 3100, 3500, 3300, 3600, 3768],
        },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        User Growth
                    </h3>
                    <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
                        New signups website + mobile
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
                        3,768
                    </h3>
                    <p className="text-theme-xs mt-1 text-gray-500 dark:text-gray-400">
                        <span className="text-success-600 mr-1 inline-block">+3.85%</span>
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
