import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../icons";

const activities = [
    {
        id: 1,
        name: "Francisco Grbbs",
        action: "created invoice",
        invoice: "PQ-4491C",
        time: "Just Now",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=60",
        isNewInvoice: true
    },
    {
        id: 2,
        name: "Courtney Henry",
        action: "created invoice",
        invoice: "HK-234G",
        time: "15 minutes ago",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&fit=crop&q=60",
        isNewInvoice: false
    },
    {
        id: 3,
        name: "Bessie Cooper",
        action: "created invoice",
        invoice: "LH-2891C",
        time: "5 months ago",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&fit=crop&q=60",
        isNewInvoice: false
    },
    {
        id: 4,
        name: "Theresa Web",
        action: "created invoice",
        invoice: "CK-125NH",
        time: "2 weeks ago",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&q=60",
        isNewInvoice: false
    }
];

export default function RecentActivities() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Activities
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

            <div className="relative">
                {/* Timeline vertical connector line */}
                <div className="absolute top-6 bottom-10 left-5 w-px bg-gray-200 dark:bg-gray-800"></div>

                {activities.map((activity, index) => (
                    <div key={activity.id} className={`relative flex ${index !== activities.length - 1 ? "mb-6" : ""}`}>
                        <div className="z-10 flex-shrink-0">
                            <img
                                src={activity.avatar}
                                alt={activity.name}
                                className="size-10 rounded-full object-cover ring-4 ring-white dark:ring-gray-900"
                            />
                        </div>
                        <div className="ml-4">
                            {activity.isNewInvoice && (
                                <div className="mb-1 flex items-center gap-1">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 5.0625H14.0625L12.5827 8.35084C12.4506 8.64443 12.4506 8.98057 12.5827 9.27416L14.0625 12.5625H10.125C9.50368 12.5625 9 12.0588 9 11.4375V10.875M3.9375 10.875H9M3.9375 3.375H7.875C8.49632 3.375 9 3.87868 9 4.5V10.875M3.9375 15.9375V2.0625"
                                            stroke="#12B76A"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="text-theme-xs text-success-500 font-medium">New invoice</p>
                                </div>
                            )}
                            <div className="flex items-baseline">
                                <h3 className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                                    {activity.name}
                                </h3>
                                <span className="text-theme-sm ml-2 font-normal text-gray-500 dark:text-gray-400">
                                    {activity.action}
                                </span>
                            </div>
                            <p className="text-theme-sm font-normal text-gray-500 dark:text-gray-400">
                                {activity.invoice}
                            </p>
                            <p className="text-theme-xs mt-1 text-gray-400">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
