import Chart from "react-apexcharts";

export default function StatisticsChart({ chartData }) {
    const categories = chartData?.categories ?? [];
    const hasData = categories.length > 0;

    const parseLocalDate = (dateStr) => new Date(`${dateStr}T00:00:00`);

    const formatDate = (dateStr) =>
        parseLocalDate(dateStr).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
        });

    const formatKg = (value) =>
        `${Number(value ?? 0).toLocaleString("id-ID")} kg`;

    const series = [
        {
            name: "Netto Muat",
            type: "line",
            data: chartData?.netto_muat ?? [],
        },
        {
            name: "Netto Bongkar",
            type: "line",
            data: chartData?.netto_bongkar ?? [],
        },
        {
            name: "Susut",
            type: "column",
            data: chartData?.susut ?? [],
        },
        {
            name: "Surplus",
            type: "column",
            data: chartData?.surplus ?? [],
        },
    ];

    const options = {
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit, sans-serif",
            markers: {
                size: 6,
            },
        },
        colors: ["#2563EB", "#4F46E5", "#DC2626", "#16A34A"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 340,
            type: "line",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "38%",
                borderRadius: 3,
            },
        },
        stroke: {
            curve: "smooth",
            width: [3, 3, 0, 0],
        },
        markers: {
            size: [4, 4, 0, 0],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            borderColor: "#E5E7EB",
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            x: {
                formatter: (_, opts) => {
                    const date = categories[opts.dataPointIndex];
                    return date
                        ? parseLocalDate(date).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                          })
                        : "";
                },
            },
            y: {
                formatter: formatKg,
            },
        },
        xaxis: {
            type: "category",
            categories: categories.map(formatDate),
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                rotate: -35,
                style: {
                    fontSize: "12px",
                    colors: "#6B7280",
                },
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            labels: {
                formatter: (value) => Number(value).toLocaleString("id-ID"),
                style: {
                    fontSize: "12px",
                    colors: ["#6B7280"],
                },
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Statistik Netto DO
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        Netto muat, netto bongkar, susut, dan surplus
                        berdasarkan tanggal DO dibuat
                    </p>
                </div>
            </div>

            {!hasData ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 dark:border-gray-800">
                    Belum ada data DO untuk ditampilkan.
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[760px] xl:min-w-full">
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            height={340}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
