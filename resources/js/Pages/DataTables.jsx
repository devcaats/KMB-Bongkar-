import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Badge from "@/Components/ui/badge/Badge";

// ─── Dataset ──────────────────────────────────────────────────────────────────
const tableData = [
    {
        id: 1,
        user: { image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=60", name: "Lindsey Curtis", role: "Web Designer" },
        projectName: "Agency Website",
        team: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&fit=crop&q=60",
        ],
        status: "Active",
        budget: "3.9K",
    },
    {
        id: 2,
        user: { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=60", name: "Kaiya George", role: "Project Manager" },
        projectName: "Technology",
        team: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&fit=crop&q=60",
        ],
        status: "Pending",
        budget: "24.9K",
    },
    {
        id: 3,
        user: { image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=60", name: "Zain Geidt", role: "Content Writing" },
        projectName: "Blog Writing",
        team: [
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=48&fit=crop&q=60",
        ],
        status: "Active",
        budget: "12.7K",
    },
    {
        id: 4,
        user: { image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=60", name: "Abram Schleifer", role: "Digital Marketer" },
        projectName: "Social Media",
        team: [
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=48&fit=crop&q=60",
        ],
        status: "Cancel",
        budget: "2.8K",
    },
    {
        id: 5,
        user: { image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop&q=60", name: "Carla George", role: "Front-end Developer" },
        projectName: "Website",
        team: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&fit=crop&q=60",
        ],
        status: "Active",
        budget: "4.5K",
    },
    {
        id: 6,
        user: { image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop&q=60", name: "Emery Culhane", role: "QA Engineer" },
        projectName: "Mobile App",
        team: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&fit=crop&q=60",
        ],
        status: "Pending",
        budget: "9.2K",
    },
    {
        id: 7,
        user: { image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&fit=crop&q=60", name: "Livia Donin", role: "UI/UX Designer" },
        projectName: "Brand Identity",
        team: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&fit=crop&q=60",
        ],
        status: "Active",
        budget: "7.1K",
    },
    {
        id: 8,
        user: { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&q=60", name: "Miracle Bator", role: "Backend Developer" },
        projectName: "API Integration",
        team: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&fit=crop&q=60",
        ],
        status: "Active",
        budget: "18.3K",
    },
    {
        id: 9,
        user: { image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop&q=60", name: "Lincoln Herwitz", role: "Product Manager" },
        projectName: "E-Commerce Platform",
        team: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&fit=crop&q=60",
        ],
        status: "Cancel",
        budget: "31.5K",
    },
    {
        id: 10,
        user: { image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&fit=crop&q=60", name: "Ekstrom Bothman", role: "Operations Lead" },
        projectName: "Infrastructure",
        team: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=48&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&fit=crop&q=60",
        ],
        status: "Active",
        budget: "14.0K",
    },
];

// Extended dataset for table 2 & 3
const tableData2 = tableData.map((d) => ({
    ...d,
    id: d.id + 100,
    position: d.user.role,
    office: ["New York", "London", "Tokyo", "San Francisco", "Edinburgh"][d.id % 5],
    age: 25 + (d.id * 7) % 40,
    startDate: `${d.id + 10} Mar, 2027`,
    salary: `$${(d.id * 12500).toLocaleString()}`,
}));

const tableData3 = tableData.map((d) => ({
    ...d,
    id: d.id + 200,
    position: d.user.role,
    office: ["Edinburgh", "Tokyo", "London", "New York", "San Francisco"][d.id % 5],
    age: 30 + (d.id * 5) % 35,
    startDate: `${d.id + 5} Jun, 2027`,
    salary: `$${(d.id * 8900).toLocaleString()}`,
}));

// ─── Status badge color mapping ───────────────────────────────────────────────
const statusColor = (status) => {
    if (status === "Active") return "success";
    if (status === "Pending") return "warning";
    return "error";
};

const textCollator = new Intl.Collator("id-ID", {
    numeric: true,
    sensitivity: "base",
    ignorePunctuation: true,
});

const normalizeText = (value) => String(value ?? "").trim();

const compareSortValues = (a, b, direction, type = "text") => {
    const result = type === "number"
        ? (Number(a) || 0) - (Number(b) || 0)
        : textCollator.compare(normalizeText(a), normalizeText(b));

    return direction === "asc" ? result : -result;
};

// ─── Reusable sort arrow icon ──────────────────────────────────────────────────
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

// ─── Search Input ──────────────────────────────────────────────────────────────
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

// ─── Pagination ────────────────────────────────────────────────────────────────
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-5 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {from}–{to} of {total} results
            </p>
            <div className="flex items-center gap-1">
                <button
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

// ─── Team Avatars ──────────────────────────────────────────────────────────────
function TeamAvatars({ images }) {
    return (
        <div className="flex -space-x-2">
            {images.slice(0, 3).map((src, i) => (
                <div key={i} className="w-7 h-7 overflow-hidden rounded-full border-2 border-white dark:border-gray-900">
                    <img src={src} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=U&size=28"; }} />
                </div>
            ))}
            {images.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">+{images.length - 3}</span>
                </div>
            )}
        </div>
    );
}

// ─── Main DataTables Page ──────────────────────────────────────────────────────
export default function DataTables() {
    // ── Table 1 state ──
    const [search1, setSearch1] = useState("");
    const [sort1, setSort1] = useState({ col: "name", dir: "asc" });
    const [page1, setPage1] = useState(1);
    const perPage1 = 5;

    // ── Table 2 state (with delete) ──
    const [rows2, setRows2] = useState(tableData2);
    const [search2, setSearch2] = useState("");
    const [sort2, setSort2] = useState({ col: "name", dir: "asc" });
    const [page2, setPage2] = useState(1);
    const perPage2 = 5;

    // ── Table 3 state (with checkboxes) ──
    const [search3, setSearch3] = useState("");
    const [sort3, setSort3] = useState({ col: "name", dir: "asc" });
    const [page3, setPage3] = useState(1);
    const [selected, setSelected] = useState(new Set());
    const perPage3 = 5;

    // ── Shared filter/sort/paginate helper ──
    const process = (data, search, sort, page, perPage) => {
        let items = [...data];
        if (search) {
            const q = search.toLowerCase();
            items = items.filter(
                (r) =>
                    r.user.name.toLowerCase().includes(q) ||
                    r.projectName.toLowerCase().includes(q) ||
                    r.status.toLowerCase().includes(q)
            );
        }
        items.sort((a, b) => {
            const type = sort.col === "budget" ? "number" : "text";
            const va = sort.col === "budget"
                ? parseFloat(a.budget)
                : a.user[sort.col] ?? a[sort.col] ?? "";
            const vb = sort.col === "budget"
                ? parseFloat(b.budget)
                : b.user[sort.col] ?? b[sort.col] ?? "";

            return compareSortValues(va, vb, sort.dir, type) || (Number(a.id) || 0) - (Number(b.id) || 0);
        });
        const total = items.length;
        const paginated = items.slice((page - 1) * perPage, page * perPage);
        return { paginated, total };
    };

    const toggleSort = (setSort, sort, col) => {
        setSort(sort.col === col
            ? { col, dir: sort.dir === "asc" ? "desc" : "asc" }
            : { col, dir: "asc" }
        );
    };

    const { paginated: rows1, total: total1 } = useMemo(
        () => process(tableData, search1, sort1, page1, perPage1),
        [search1, sort1, page1]
    );
    const { paginated: pRows2, total: total2 } = useMemo(
        () => process(rows2, search2, sort2, page2, perPage2),
        [rows2, search2, sort2, page2]
    );
    const { paginated: rows3, total: total3 } = useMemo(
        () => process(tableData3, search3, sort3, page3, perPage3),
        [search3, sort3, page3]
    );

    const handleDelete = (id) => setRows2((prev) => prev.filter((r) => r.id !== id));

    const allChecked = rows3.length > 0 && rows3.every((r) => selected.has(r.id));
    const toggleAll = (e) => {
        const next = new Set(selected);
        rows3.forEach((r) => e.target.checked ? next.add(r.id) : next.delete(r.id));
        setSelected(next);
    };
    const toggleRow = (id) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    // ── Reusable column header cell ──
    const Th = ({ col, sort, setSort, children, onPage }) => (
        <TableCell
            isHeader
            className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 cursor-pointer select-none whitespace-nowrap"
            onClick={() => { toggleSort(setSort, sort, col); onPage(1); }}
        >
            <span className="inline-flex items-center gap-0.5">
                {children}
                <SortArrow active={sort.col === col} dir={sort.dir} />
            </span>
        </TableCell>
    );

    // ─── Table wrapper card ──────────────────────────────────────────────────────
    const TableCard = ({ title, children }) => (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 sm:px-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{title}</h3>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Data Tables" />

            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Data Tables</h2>
                <nav>
                    <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <li>Home</li>
                        <li>
                            <svg className="size-3.5 fill-current" viewBox="0 0 16 16">
                                <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
                            </svg>
                        </li>
                        <li className="font-medium text-gray-800 dark:text-white/90">Data Tables</li>
                    </ol>
                </nav>
            </div>

            <div className="space-y-6">
                {/* ─── Table 1: Basic project table ─────────────────────────── */}
                <TableCard title="Basic Table 1">
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        {/* Search */}
                        <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {total1} entries
                            </p>
                            <SearchInput value={search1} onChange={(e) => { setSearch1(e.target.value); setPage1(1); }} />
                        </div>

                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <Th col="name" sort={sort1} setSort={setSort1} onPage={setPage1}>User</Th>
                                        <Th col="projectName" sort={sort1} setSort={setSort1} onPage={setPage1}>Project Name</Th>
                                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Team</TableCell>
                                        <Th col="status" sort={sort1} setSort={setSort1} onPage={setPage1}>Status</Th>
                                        <Th col="budget" sort={sort1} setSort={setSort1} onPage={setPage1}>Budget</Th>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {rows1.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="px-5 py-10 text-center text-gray-400 dark:text-gray-500" colSpan={5}>
                                                No results found
                                            </TableCell>
                                        </TableRow>
                                    ) : rows1.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                        <img src={row.user.image} alt={row.user.name} className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user.name)}&size=40`; }} />
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{row.user.name}</span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{row.user.role}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                {row.projectName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <TeamAvatars images={row.team} />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Badge size="sm" color={statusColor(row.status)}>{row.status}</Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                {row.budget}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination page={page1} total={total1} perPage={perPage1} onPage={setPage1} />
                    </div>
                </TableCard>

                {/* ─── Table 2: With delete action ──────────────────────────── */}
                <TableCard title="Basic Table 2">
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {total2} entries
                            </p>
                            <SearchInput value={search2} onChange={(e) => { setSearch2(e.target.value); setPage2(1); }} />
                        </div>

                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <Th col="name" sort={sort2} setSort={setSort2} onPage={setPage2}>User</Th>
                                        <Th col="projectName" sort={sort2} setSort={setSort2} onPage={setPage2}>Project Name</Th>
                                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Team</TableCell>
                                        <Th col="status" sort={sort2} setSort={setSort2} onPage={setPage2}>Status</Th>
                                        <Th col="budget" sort={sort2} setSort={setSort2} onPage={setPage2}>Budget</Th>
                                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {pRows2.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="px-5 py-10 text-center text-gray-400 dark:text-gray-500" colSpan={6}>
                                                No results found
                                            </TableCell>
                                        </TableRow>
                                    ) : pRows2.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                        <img src={row.user.image} alt={row.user.name} className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user.name)}&size=40`; }} />
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{row.user.name}</span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{row.position}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                {row.projectName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <TeamAvatars images={row.team} />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Badge size="sm" color={statusColor(row.status)}>{row.status}</Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                {row.budget}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleDelete(row.id)}
                                                        className="text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="size-5 fill-current" viewBox="0 0 21 21">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.04 4.29C7.04 3.05 8.05 2.04 9.29 2.04h2.42c1.24 0 2.25 1.01 2.25 2.25v.25h2.17 1.04a.75.75 0 0 1 0 1.5h-.31V8.75v5v2.96c0 1.24-1.01 2.25-2.25 2.25H6.38a2.25 2.25 0 0 1-2.25-2.25V13.75v-5V6.04h-.31a.75.75 0 0 1 0-1.5h1.04 2.17v-.25Zm7.34.25h-7.5v-.25c0-.41.34-.75.75-.75h5.99c.41 0 .75.34.75.75v.25ZM5.62 6.04v2.71 5 2.96c0 .41.34.75.75.75h8.25c.41 0 .75-.34.75-.75v-2.96-5-2.71H5.62Zm3.21 2.46a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75Zm4.08.75a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0v-5Z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="size-5 fill-current" viewBox="0 0 21 21">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.09 3.53a2.25 2.25 0 0 0-3.18 0L5.61 11.83a2.25 2.25 0 0 0-.58.99l-.74 3.49a.75.75 0 0 0 .9.9l3.48-.74c.37-.08.71-.27.99-.58l8.3-8.3a2.25 2.25 0 0 0 0-3.18l-.97-.97Zm-2.12 1.06a.75.75 0 0 1 1.06 0l.97.97a.75.75 0 0 1 0 1.06l-.9.89-2.03-2.03.9-.89Zm-1.96 1.96-6.34 6.34a.75.75 0 0 0-.2.38l-.5 2.36 2.36-.5a.75.75 0 0 0 .37-.2l6.34-6.34-2.03-2.04Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination page={page2} total={total2} perPage={perPage2} onPage={setPage2} />
                    </div>
                </TableCard>

                {/* ─── Table 3: With checkboxes & export ────────────────────── */}
                <TableCard title="Basic Table 3">
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                            <div className="flex items-center gap-3">
                                {selected.size > 0 && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                        {selected.size} selected
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        const data = tableData3.filter((r) => selected.size === 0 || selected.has(r.id));
                                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url; a.download = "export.json"; a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                                >
                                    <svg className="size-4 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm3.293-7.707a1 1 0 0 1 1.414 0L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414Z" />
                                    </svg>
                                    Export
                                </button>
                            </div>
                            <SearchInput value={search3} onChange={(e) => { setSearch3(e.target.value); setPage3(1); }} />
                        </div>

                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                checked={allChecked}
                                                onChange={toggleAll}
                                                className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                        </TableCell>
                                        <Th col="name" sort={sort3} setSort={setSort3} onPage={setPage3}>User</Th>
                                        <Th col="projectName" sort={sort3} setSort={setSort3} onPage={setPage3}>Project Name</Th>
                                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Team</TableCell>
                                        <Th col="status" sort={sort3} setSort={setSort3} onPage={setPage3}>Status</Th>
                                        <Th col="budget" sort={sort3} setSort={setSort3} onPage={setPage3}>Budget</Th>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {rows3.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="px-5 py-10 text-center text-gray-400 dark:text-gray-500" colSpan={6}>
                                                No results found
                                            </TableCell>
                                        </TableRow>
                                    ) : rows3.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors ${selected.has(row.id) ? "bg-brand-50/30 dark:bg-brand-500/5" : ""}`}
                                        >
                                            <TableCell className="px-5 py-4 w-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(row.id)}
                                                    onChange={() => toggleRow(row.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                        <img src={row.user.image} alt={row.user.name} className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user.name)}&size=40`; }} />
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{row.user.name}</span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{row.user.role}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                {row.projectName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <TeamAvatars images={row.team} />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Badge size="sm" color={statusColor(row.status)}>{row.status}</Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-300 whitespace-nowrap">
                                                {row.budget}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination page={page3} total={total3} perPage={perPage3} onPage={setPage3} />
                    </div>
                </TableCard>
            </div>
        </AppLayout>
    );
}
