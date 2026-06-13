export default function CountryMap() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-gray-100 dark:border-gray-800/40 p-4">
            <svg
                className="w-full h-full max-h-[180px] text-gray-300 dark:text-gray-700"
                viewBox="0 0 800 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Stylized world grid/continents lines */}
                <path
                    d="M 120 120 Q 180 80 250 110 T 320 200 T 260 270 T 130 220 Z"
                    className="stroke-gray-200 dark:stroke-gray-800 fill-gray-100/30 dark:fill-gray-900/10"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <path
                    d="M 370 90 Q 420 80 470 100 T 520 180 T 430 240 Z"
                    className="stroke-gray-200 dark:stroke-gray-800 fill-gray-100/30 dark:fill-gray-900/10"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <path
                    d="M 500 120 Q 560 110 620 130 T 670 200 T 590 280 Z"
                    className="stroke-gray-200 dark:stroke-gray-800 fill-gray-100/30 dark:fill-gray-900/10"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <path
                    d="M 220 260 Q 250 310 280 360 T 300 390"
                    className="stroke-gray-200 dark:stroke-gray-800 fill-gray-100/30 dark:fill-gray-900/10"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />

                {/* USA Dot & Label */}
                <circle cx="220" cy="140" r="16" className="text-brand-500/10 animate-pulse fill-current" />
                <circle cx="220" cy="140" r="6" className="text-brand-500 fill-current" />
                
                {/* France Dot & Label */}
                <circle cx="410" cy="130" r="16" className="text-brand-500/10 animate-pulse fill-current" />
                <circle cx="410" cy="130" r="6" className="text-brand-500 fill-current" />
                
                {/* India Dot & Label */}
                <circle cx="560" cy="180" r="16" className="text-brand-500/10 animate-pulse fill-current" />
                <circle cx="560" cy="180" r="6" className="text-brand-500 fill-current" />
            </svg>
        </div>
    );
}
