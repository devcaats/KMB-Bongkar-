import Chart from "react-apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../icons";

export default function ConversionFunnelChart() {
    const [isOpen, setIsOpen] = useState(false);

    const chartOptions = {
        colors: ["#465fff"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 320,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                horizontal: true,
                barHeight: "55%",
                distributed: true,
                isFunnel: true,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ": " + val.toLocaleString();
            },
            dropShadow: {
                enabled: false,
            },
            style: {
                fontSize: "13px",
                fontFamily: "Outfit",
                fontWeight: 600,
                colors: ["#fff"],
            },
        },
        colors: [
            "#465fff",
            "#5c73ff",
            "#7387ff",
            "#8a9bff",
            "#a1afff"
        ],
        legend: {
            show: false,
        },
        xaxis: {
            categories: [
                "Website Visits",
                "Downloads/Signups",
                "Active Trials",
                "Paid Conversions",
                "Renewals"
            ],
            labels: {
                style: {
                    fontFamily: "Outfit",
                },
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        tooltip: {
            theme: "dark",
            y: {
                formatter: function (val) {
                    return val.toLocaleString() + " Users";
                },
            },
        },
    };

    const series = [
        {
            name: "Conversion Funnel",
            data: [120000, 78000, 42000, 15000, 9500],
        },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Conversion Funnel
                    </h3>
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
            <div className="custom-scrollbar max-w-full overflow-x-auto">
                <div className="-ml-5 min-w-[700px] pl-2">
                    <Chart options={chartOptions} series={series} type="bar" height={320} />
                </div>
            </div>
        </div>
    );
}
