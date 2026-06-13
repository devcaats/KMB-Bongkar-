import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Badge from "@/Components/ui/badge/Badge";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ROLES = [
    { value: "admin",   label: "Admin",   color: "error" },
    { value: "driver",  label: "Driver",  color: "success" },
    { value: "finance", label: "Finance", color: "warning" },
];

const roleInfo = (role) => ROLES.find((r) => r.value === role) ?? { label: role, color: "light" };

export default function UsersIndex({ users: initialUsers }) {
    const { flash } = usePage().props;

    const [popupState, setPopupState] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        nohp: "",
        password: "",
        role: "",
    });

    // Flash message handling
    useMemo(() => {
        if (flash?.success) setPopupState({ type: "success", message: flash.success });
        if (flash?.error)   setPopupState({ type: "error",   message: flash.error });
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("users.store"), {
            preserveState: true,
            onSuccess: () => {
                setPopupState({ type: "success", message: `User ${data.name} berhasil ditambahkan!` });
                reset();
                setShowForm(false);
            },
            onError: () => {
                setPopupState({ type: "error", message: "Gagal menyimpan. Periksa kembali isian form." });
            },
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route("users.destroy", deleteTarget.id), {
            preserveState: true,
            onSuccess: () => {
                setPopupState({ type: "success", message: `User ${deleteTarget.name} berhasil dihapus.` });
                setDeleteTarget(null);
            },
            onError: () => {
                setPopupState({ type: "error", message: "Gagal menghapus user." });
                setDeleteTarget(null);
            },
        });
    };

    const filteredUsers = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return (initialUsers ?? []).filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.nohp || "").toLowerCase().includes(q) ||
                u.role.toLowerCase().includes(q),
        );
    }, [initialUsers, searchTerm]);

    return (
        <AppLayout>
            <Head title="Manajemen User" />

            {/* ── Popup ── */}
            <Popup
                open={popupState !== null}
                closeOnDocumentClick
                onClose={() => setPopupState(null)}
                modal
                overlayStyle={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
                contentStyle={{ border: "none", background: "transparent", padding: 0, width: "auto" }}
            >
                {popupState && (
                    <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border ${popupState.type === "success" ? "border-success-200 dark:border-success-800" : "border-error-200 dark:border-error-800"}`}>
                        <div className={`h-1.5 w-full ${popupState.type === "success" ? "bg-success-500" : "bg-error-500"}`} />
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${popupState.type === "success" ? "bg-success-100 dark:bg-success-500/20" : "bg-error-100 dark:bg-error-500/20"}`}>
                                    {popupState.type === "success" ? (
                                        <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold ${popupState.type === "success" ? "text-success-700 dark:text-success-400" : "text-error-700 dark:text-error-400"}`}>
                                        {popupState.type === "success" ? "Berhasil!" : "Gagal"}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{popupState.message}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={() => setPopupState(null)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${popupState.type === "success" ? "bg-success-600 hover:bg-success-700" : "bg-error-600 hover:bg-error-700"}`}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            {/* ── Confirm Delete Popup ── */}
            <Popup
                open={deleteTarget !== null}
                closeOnDocumentClick
                onClose={() => setDeleteTarget(null)}
                modal
                overlayStyle={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
                contentStyle={{ border: "none", background: "transparent", padding: 0, width: "auto" }}
            >
                {deleteTarget && (
                    <div className="relative w-full max-w-sm mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-error-200 dark:border-error-800">
                        <div className="h-1.5 w-full bg-error-500" />
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-error-100 dark:bg-error-500/20">
                                    <svg className="w-6 h-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-error-700 dark:text-error-400">Hapus User?</h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        User <strong>{deleteTarget.name}</strong> akan dihapus secara permanen. Aksi ini tidak dapat dibatalkan.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]">
                                    Batal
                                </button>
                                <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-error-600 text-sm font-semibold text-white hover:bg-error-700">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            <div className="space-y-6">
                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen User</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola akun admin, driver, dan finance.</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(!showForm); clearErrors(); reset(); }}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-600"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah User
                    </button>
                </div>

                {/* ── Add User Form ── */}
                {showForm && (
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sm:px-6">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Tambah User Baru</h3>
                            <button onClick={() => { setShowForm(false); reset(); clearErrors(); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* Nama */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nama <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Nama lengkap"
                                        className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    />
                                    {errors.name && <p className="text-xs text-error-500">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="email@example.com"
                                        className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    />
                                    {errors.email && <p className="text-xs text-error-500">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="Min. 8 karakter"
                                        className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    />
                                    {errors.password && <p className="text-xs text-error-500">{errors.password}</p>}
                                </div>

                                {/* No HP */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        No HP / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nohp}
                                        onChange={(e) => setData("nohp", e.target.value)}
                                        placeholder="62812xxxxxxx"
                                        className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    />
                                    {errors.nohp && <p className="text-xs text-error-500">{errors.nohp}</p>}
                                </div>

                                {/* Role */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Role <span className="text-error-500">*</span>
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData("role", e.target.value)}
                                        className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    >
                                        <option value="">-- Pilih Role --</option>
                                        {ROLES.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="text-xs text-error-500">{errors.role}</p>}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); reset(); clearErrors(); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? (
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {processing ? "Menyimpan..." : "Simpan User"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── User Table ── */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-5 py-4 sm:px-6">
                        <div>
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Daftar User</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{filteredUsers.length} user ditemukan</p>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04 9.374C3.04 5.877 5.877 3.042 9.375 3.042c3.498 0 6.333 2.835 6.333 6.332 0 3.497-2.835 6.332-6.333 6.332-3.498 0-6.334-2.835-6.334-6.332Zm6.334-7.832C5.05 1.542 1.542 5.049 1.542 9.374c0 4.325 3.508 7.832 7.832 7.832 1.892 0 3.628-.67 4.982-1.787l2.82 2.82a.75.75 0 1 0 1.061-1.06l-2.818-2.82A7.792 7.792 0 0 0 17.208 9.374C17.208 5.049 13.7 1.542 9.374 1.542Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama, email, no HP, role..."
                                className="h-10 w-full sm:w-[260px] rounded-lg border border-gray-200 bg-transparent py-2 pr-4 pl-9 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-12">No</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">No HP</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Role</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Terdaftar</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-end font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="px-5 py-10 text-center text-gray-400" colSpan={7}>
                                            Tidak ada user ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user, idx) => {
                                        const role = roleInfo(user.role);
                                        return (
                                            <TableRow key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                                <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-400">{idx + 1}</TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-sm">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{user.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                                                <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                    {user.nohp || "-"}
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <Badge color={role.color}>{role.label}</Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-400 text-theme-xs whitespace-nowrap">
                                                    {new Date(user.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-end">
                                                    <button
                                                        onClick={() => setDeleteTarget(user)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-error-200 px-3 py-1.5 text-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-800 dark:text-error-400 dark:hover:bg-error-500/10"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
