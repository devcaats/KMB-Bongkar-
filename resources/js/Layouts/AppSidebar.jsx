import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

// ─── Nav Config ────────────────────────────────────────────────────────────
const navItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM15 3.25C13.7574 3.25 12.75 4.25736 12.75 5.5V8.99998C12.75 10.2426 13.7574 11.25 15 11.25H18.5C19.7426 11.25 20.75 10.2426 20.75 8.99998V5.5C20.75 4.25736 19.7426 3.25 18.5 3.25H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15Z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
    {
        name: "Pembuatan DO",
        path: "/pembuatan-do",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 4a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v16h12V9h-5a1 1 0 01-1-1V4H6zm8 .414L16.586 7H14V4.414z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
    {
        name: "Rincian DO",
        path: "/rincian-do",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 3.25A2.75 2.75 0 002.25 6v12A2.75 2.75 0 005 20.75h14A2.75 2.75 0 0021.75 18V6A2.75 2.75 0 0019 3.25H5zM3.75 8.5V6c0-.69.56-1.25 1.25-1.25h14c.69 0 1.25.56 1.25 1.25v2.5H3.75zm0 1.5V18c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25v-8H3.75zM6 13a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7zm7-3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
    {
        name: "Koneksi WA Bot",
        path: "/wa-bot",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.5 3.25A2.25 2.25 0 003.25 5.5v13A2.25 2.25 0 005.5 20.75h13a2.25 2.25 0 002.25-2.25v-13a2.25 2.25 0 00-2.25-2.25h-13zm-.75 2.25a.75.75 0 01.75-.75h13a.75.75 0 01.75.75v13a.75.75 0 01-.75.75h-13a.75.75 0 01-.75-.75v-13zM7 7a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1V7zm7-1a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1h-2zm-7 8a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2zm7-1a1 1 0 100 2h1v1a1 1 0 102 0v-2a1 1 0 00-1-1h-2z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
    {
        name: "Log Aktivitas",
        path: "/log-aktivitas",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2 0v14h12V5H6zm3 3a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H10z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
    {
        name: "Manajemen User",
        path: "/users",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8zm-2 9a4 4 0 014-4h8a4 4 0 014 4v1a1 1 0 11-2 0v-1a2 2 0 00-2-2H8a2 2 0 00-2 2v1a1 1 0 11-2 0v-1z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
];

// eslint-disable-next-line no-unused-vars
const othersItems = [
    {
        name: "Charts",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM12 7C12.4142 7 12.75 7.33579 12.75 7.75V11.25H16.25C16.6642 11.25 17 11.5858 17 12C17 12.4142 16.6642 12.75 16.25 12.75H12C11.5858 12.75 11.25 12.4142 11.25 12V7.75C11.25 7.33579 11.5858 7 12 7Z"
                    fill="currentColor"
                />
            </svg>
        ),
        subItems: [
            { name: "Line Chart", path: "#" },
            { name: "Bar Chart", path: "#" },
        ],
    },
    {
        name: "UI Elements",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.25 6C3.25 4.48122 4.48122 3.25 6 3.25H18C19.5188 3.25 20.75 4.48122 20.75 6V18C20.75 19.5188 19.5188 20.75 18 20.75H6C4.48122 20.75 3.25 19.5188 3.25 18V6ZM6 4.75C5.30964 4.75 4.75 5.30964 4.75 6V18C4.75 18.6904 5.30964 19.25 6 19.25H18C18.6904 19.25 19.25 18.6904 19.25 18V6C19.25 5.30964 18.6904 4.75 18 4.75H6Z"
                    fill="currentColor"
                />
            </svg>
        ),
        subItems: [
            { name: "Alerts", path: "#" },
            { name: "Avatar", path: "#" },
            { name: "Badge", path: "#" },
            { name: "Buttons", path: "#" },
            { name: "Images", path: "#" },
            { name: "Videos", path: "#" },
        ],
    },
    {
        name: "Authentication",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 3.5C9.51472 3.5 7.5 5.51472 7.5 8V10H6.5C5.39543 10 4.5 10.8954 4.5 12V19C4.5 20.1046 5.39543 21 6.5 21H17.5C18.6046 21 19.5 20.1046 19.5 19V12C19.5 10.8954 18.6046 10 17.5 10H16.5V8C16.5 5.51472 14.4853 3.5 12 3.5ZM15 10V8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8V10H15ZM12 14C12.5523 14 13 14.4477 13 15V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V15C11 14.4477 11.4477 14 12 14Z"
                    fill="currentColor"
                />
            </svg>
        ),
        subItems: [
            { name: "Sign In", path: "#" },
            { name: "Sign Up", path: "#" },
        ],
    },
];

// ─── Chevron icon ───────────────────────────────────────────────────────────
const ChevronIcon = ({ isOpen }) => (
    <svg
        className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""}`}
        viewBox="0 0 20 20"
        fill="none"
    >
        <path
            d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// ─── Dots icon (for collapsed sidebar section title) ────────────────────────
const HorizontalDots = () => (
    <svg className="mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
            fill="currentColor"
        />
    </svg>
);

// ─── Badge component ────────────────────────────────────────────────────────
const MenuBadge = ({ isActive }) => (
    <span
        className={`menu-dropdown-badge ${isActive ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"}`}
    >
        New
    </span>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { url, props } = usePage();
    const user = props.auth.user;

    const dynamicNavItems = useMemo(() => {
        if (user?.role === "driver") {
            return [
                {
                    name: "Dashboard",
                    path: "/dashboard",
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM15 3.25C13.7574 3.25 12.75 4.25736 12.75 5.5V8.99998C12.75 10.2426 13.7574 11.25 15 11.25H18.5C19.7426 11.25 20.75 10.2426 20.75 8.99998V5.5C20.75 4.25736 19.7426 3.25 18.5 3.25H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15Z"
                                fill="currentColor"
                            />
                        </svg>
                    ),
                },
                {
                    name: "Laporan Muat",
                    path: "/laporan-muat",
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                fill="currentColor"
                            />
                        </svg>
                    ),
                },
                {
                    name: "Laporan Bongkar",
                    path: "/laporan-bongkar",
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                fill="currentColor"
                            />
                        </svg>
                    ),
                },
                {
                    name: "Maintenance Unit",
                    path: "/maintenance-unit",
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                fill="currentColor"
                            />
                        </svg>
                    ),
                },
            ];
        }
        return navItems;
    }, [user]);

    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});

    const isActive = useCallback(
        (path) => {
            if (path === "#") return false;
            if (path === "/profile" && url.startsWith("/profile")) return true;
            return url === path;
        },
        [url],
    );

    // Auto-open submenu that contains the active route
    useEffect(() => {
        let matched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? dynamicNavItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((sub) => {
                        if (isActive(sub.path)) {
                            setOpenSubmenu({ type: menuType, index });
                            matched = true;
                        }
                    });
                }
            });
        });
        if (!matched) setOpenSubmenu(null);
    }, [url, isActive, dynamicNavItems]);

    // Measure submenu height for animation
    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prev) => ({
                    ...prev,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index, menuType) => {
        setOpenSubmenu((prev) => {
            if (prev && prev.type === menuType && prev.index === index) return null;
            return { type: menuType, index };
        });
    };

    const showText = isExpanded || isHovered || isMobileOpen;

    const renderMenuItems = (items, menuType) => (
        <ul className="flex flex-col gap-1">
            {items.map((nav, index) => {
                const key = `${menuType}-${index}`;
                const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
                const hasActiveChild = nav.subItems?.some((s) => isActive(s.path));
                const isItemActive = hasActiveChild || (nav.path && isActive(nav.path));

                return (
                    <li key={nav.name}>
                        {nav.subItems ? (
                            <button
                                onClick={() => handleSubmenuToggle(index, menuType)}
                                className={`menu-item group w-full text-left ${isOpen || hasActiveChild ? "menu-item-active" : "menu-item-inactive"} ${!showText ? "lg:justify-center" : ""}`}
                            >
                                <span
                                    className={`menu-item-icon-size ${isOpen || hasActiveChild ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}
                                >
                                    {nav.icon}
                                </span>
                                {showText && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                                {showText && nav.badge && (
                                    <span className="absolute right-10 flex items-center gap-1">
                                        <MenuBadge isActive={isOpen || hasActiveChild} />
                                    </span>
                                )}
                                {showText && <ChevronIcon isOpen={isOpen} />}
                            </button>
                        ) : (
                            <Link
                                href={
                                    nav.path === "/profile" && typeof route !== "undefined"
                                        ? route("profile.edit")
                                        : nav.path ?? "#"
                                }
                                className={`menu-item group ${isItemActive ? "menu-item-active" : "menu-item-inactive"}`}
                            >
                                <span
                                    className={`menu-item-icon-size ${isItemActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}
                                >
                                    {nav.icon}
                                </span>
                                {showText && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                            </Link>
                        )}

                        {/* Submenu dropdown */}
                        {nav.subItems && showText && (
                            <div
                                ref={(el) => { subMenuRefs.current[key] = el; }}
                                className="overflow-hidden transition-all duration-300"
                                style={{
                                    height: isOpen ? `${subMenuHeight[key] ?? 0}px` : "0px",
                                }}
                            >
                                <ul className="mt-2 flex flex-col gap-1 ml-9">
                                    {nav.subItems.map((sub) => (
                                        <li key={sub.name}>
                                            <Link
                                                href={sub.path}
                                                className={`menu-dropdown-item group relative ${isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                                            >
                                                {sub.name}
                                                {sub.badge && (
                                                    <span className="absolute right-3 flex items-center gap-1">
                                                        <MenuBadge isActive={isActive(sub.path)} />
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
            ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo */}
            <div
                className={`py-8 flex ${!showText ? "lg:justify-center" : "justify-start"}`}
            >
                <Link href="/dashboard">
                    {showText ? (
                        <span className="flex items-center gap-2">
                            <img
                                src="/icon/icon.svg"
                                alt="KMB Bongkar"
                                className="h-9 w-9 object-contain"
                            />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                KMB Bongkar
                            </span>
                        </span>
                    ) : (
                        <img
                            src="/icon/icon.svg"
                            alt="KMB Bongkar"
                            className="h-9 w-9 object-contain"
                        />
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        {/* Main Menu */}
                        <div>
                            {renderMenuItems(dynamicNavItems, "main")}
                        </div>
                    </div>
                </nav>
                {showText && <SidebarWidget />}
            </div>
        </aside>
    );
};

export default AppSidebar;
