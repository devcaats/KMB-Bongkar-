import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white text-center sm:text-left">
                            Selamat datang di KMB Bongkar!
                        </h1>
                    </div>

                    <div className="mt-8 backdrop-blur-md bg-white/70 dark:bg-gray-800/40 overflow-hidden border border-gray-200/50 dark:border-gray-700/30 shadow-lg sm:rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div id="screenshot-container" className="p-6">
                                <img
                                    src="/screenshot.png"
                                    alt="Screenshot KMB Bongkar"
                                    onError={handleImageError}
                                    className="w-full h-auto rounded-md"
                                />
                            </div>

                            <div
                                id="docs-card"
                                className="p-6 border-t border-gray-200/50 dark:border-gray-700/30 md:border-t-0 md:border-l"
                            >
                                <div
                                    id="docs-card-content"
                                    className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4"
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src="/icon/icon.svg"
                                            className="h-12 w-12 object-contain"
                                            alt="Logo KMB"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Silahkan login untuk memulai
                                        </h3>
                                        {/* <p
                                            className="mt-1 text-sm text
                                            -600 dark:text-gray-400"
                                        >
                                            Silahkan .
                                        </p> */}
                                        <Link
                                            href="/login"
                                            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
