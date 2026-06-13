import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Badge from "@/Components/ui/badge/Badge";

const textCollator = new Intl.Collator("id-ID", {
    numeric: true,
    sensitivity: "base",
    ignorePunctuation: true,
});

const normalizeText = (value) => String(value ?? "").trim();

const compareSortValues = (a, b, direction, type = "text") => {
    let result = 0;

    if (type === "date") {
        result = (Date.parse(a) || 0) - (Date.parse(b) || 0);
    } else {
        result = textCollator.compare(normalizeText(a), normalizeText(b));
    }

    return direction === "asc" ? result : -result;
};

export default function ActivityLog({ logs }) {
    // Search, Sorting, Pagination States
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState({ col: "created_at", dir: "desc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter logs by user name, activity type, or details
    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const userName = log.user?.name?.toLowerCase() || "";
            const activity = log.activity?.toLowerCase() || "";
            const details = log.details?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return (
                userName.includes(search) ||
                activity.includes(search) ||
                details.includes(search)
            );
        });
    }, [logs, searchTerm]);

    // Sort logs
    const sortedLogs = useMemo(() => {
        if (!sort.col) return filteredLogs;

        return [...filteredLogs].sort((a, b) => {
            let valA;
            let valB;
            let type = "text";

            if (sort.col === "user") {
                valA = a.user?.name || "";
                valB = b.user?.name || "";
            } else if (sort.col === "created_at") {
                valA = a.created_at;
                valB = b.created_at;
                type = "date";
            } else {
                valA = a[sort.col] || "";
                valB = b[sort.col] || "";
            }

            return compareSortValues(valA, valB, sort.dir, type) || (Number(a.id) || 0) - (Number(b.id) || 0);
        });
    }, [filteredLogs, sort]);

    // Paginate logs
    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedLogs.slice(start, start + rowsPerPage);
    }, [sortedLogs, currentPage, rowsPerPage]);

    // Reset page to 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    // Reusable Column Header
    const Th = ({ col, sort, setSort, children }) => (
        <TableCell
            isHeader
            className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 cursor-pointer select-none whitespace-nowrap"
            onClick={() => {
                setSort(sort.col === col
                    ? { col, dir: sort.dir === "asc" ? "desc" : "asc" }
                    : { col, dir: "asc" }
                );
                setCurrentPage(1);
            }}
        >
            <span className="inline-flex items-center gap-0.5">
                {children}
                <SortArrow active={sort.col === col} dir={sort.dir} />
            </span>
        </TableCell>
    );

    // Format Date Helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    return (
        <AppLayout>
            <Head title="Log Aktivitas" />

            <div className="space-y-6">
                {/* Header title */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-theme-sm overflow-hidden">
                    <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Aktivitas</h2>
                            <p className="text-theme-xs text-gray-500 mt-0.5">Daftar log aktivitas penambahan data oleh Admin / Staff</p>
                        </div>
                        <Badge variant="light" color="primary" size="sm">
                            {logs.length} Total Log
                        </Badge>
                    </div>

                    <div className="p-6">
                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                            {/* Search and Entries selector */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50/50 dark:bg-white/[0.01]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredLogs.length} entries found
                                </p>
                                <div className="flex items-center gap-3">
                                    <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    {/* Entries count selection */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Show:</span>
                                        <select
                                            value={rowsPerPage}
                                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                            className="h-10 px-2.5 rounded-lg border border-gray-200 bg-transparent text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-brand-300"
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="max-w-full overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-16">No</TableCell>
                                            <Th col="user" sort={sort} setSort={setSort}>Nama Admin/Staff</Th>
                                            <Th col="activity" sort={sort} setSort={setSort}>Aktivitas</Th>
                                            <Th col="details" sort={sort} setSort={setSort}>Detail</Th>
                                            <Th col="created_at" sort={sort} setSort={setSort}>Waktu</Th>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {paginatedLogs.length === 0 ? (
                                            <TableRow>
                                                <TableCell className="px-5 py-10 text-center text-gray-400 dark:text-gray-500" colSpan={5}>
                                                    Tidak ada log aktivitas ditemukan.
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedLogs.map((log, idx) => (
                                            <TableRow key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                                <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-400">
                                                    {(currentPage - 1) * rowsPerPage + idx + 1}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                                    {log.user?.name || "System"}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 whitespace-nowrap">
                                                    <Badge size="sm" color="primary">
                                                        {log.activity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300">
                                                    {log.details}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400 whitespace-nowrap">
                                                    {formatDate(log.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <Pagination page={currentPage} total={filteredLogs.length} perPage={rowsPerPage} onPage={setCurrentPage} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// ── Subcomponents ──────────────────────────────────────────────────────────────

function SortArrow({ active, dir }) {
    return (
        <span className="inline-flex flex-col gap-0.5 ml-1 align-middle">
            <svg
                className={`w-2 h-1.5 fill-current transition-colors ${active && dir === "asc" ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`}
                viewBox="0 0 8 5"
            >
                <path d="M4.41 0.585C4.21 0.301 3.79 0.301 3.59 0.585L1.05 4.213C0.819 4.545 1.056 5 1.46 5H6.54C6.944 5 7.181 4.545 6.949 4.213L4.41 0.585Z" />
            </svg>
            <svg
                className={`w-2 h-1.5 fill-current transition-colors ${active && dir === "desc" ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`}
                viewBox="0 0 8 5"
            >
                <path d="M4.41 4.415C4.21 4.699 3.79 4.699 3.59 4.415L1.05 0.787C0.819 0.455 1.056 0 1.46 0H6.54C6.944 0 7.181 0.455 6.949 0.787L4.41 4.415Z" />
            </svg>
        </span>
    );
}

function SearchInput({ value, onChange }) {
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <svg className="size-4 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04 9.374C3.04 5.877 5.877 3.042 9.375 3.042c3.498 0 6.333 2.835 6.333 6.332 0 3.497-2.835 6.332-6.333 6.332-3.498 0-6.334-2.835-6.334-6.332Zm6.334-7.832C5.05 1.542 1.542 5.049 1.542 9.374c0 4.325 3.508 7.832 7.832 7.832 1.892 0 3.628-.67 4.982-1.787l2.82 2.82a.75.75 0 1 0 1.061-1.06l-2.818-2.82A7.792 7.792 0 0 0 17.208 9.374C17.208 5.049 13.7 1.542 9.374 1.542Z" />
                </svg>
            </span>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-transparent py-2 pr-4 pl-9 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800 xl:w-[260px]"
            />
        </div>
    );
}

function Pagination({ page, total, perPage, onPage }) {
    const totalPages = Math.ceil(total / perPage) || 1;
    const from = Math.min((page - 1) * perPage + 1, total);
    const to = Math.min(page * perPage, total);

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
            pages.push(i);
        } else if (i === page - 2 || i === page + 2) {
            pages.push("...");
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50/50 dark:bg-white/[0.01]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {from}–{to} of {total} results
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    Previous
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={i} className="px-1 text-gray-400 select-none">…</span>
                    ) : (
                        <button
                            type="button"
                            key={p}
                            onClick={() => onPage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p
                                    ? "bg-brand-500/[0.08] text-brand-600 dark:text-brand-400"
                                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    type="button"
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
