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
            <Head title="Selamat datang" />

            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                            Selamat datang di KMB Bongkar!
                        </h1>
                    </div>

                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
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
                                className="p-6 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:border-l"
                            >
                                <div
                                    id="docs-card-content"
                                    className="flex items-center space-x-4"
                                >
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-12 w-12 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
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
