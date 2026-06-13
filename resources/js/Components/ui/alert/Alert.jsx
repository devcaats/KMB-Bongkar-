import React from "react";
import { Link } from "@inertiajs/react";

const Alert = ({
    variant,
    title,
    message,
    showLink = false,
    linkHref = "#",
    linkText = "Learn more",
}) => {
    // Tailwind classes for each variant
    const variantClasses = {
        success: {
            container:
                "backdrop-blur-md bg-success-50/50 dark:bg-success-500/10 border-success-500/30 dark:border-success-500/20 shadow-sm",
            icon: "text-success-500",
        },
        error: {
            container:
                "backdrop-blur-md bg-error-50/50 dark:bg-error-500/10 border-error-500/30 dark:border-error-500/20 shadow-sm",
            icon: "text-error-500",
        },
        warning: {
            container:
                "backdrop-blur-md bg-warning-50/50 dark:bg-warning-500/10 border-warning-500/30 dark:border-warning-500/20 shadow-sm",
            icon: "text-warning-500",
        },
        info: {
            container:
                "backdrop-blur-md bg-blue-light-50/50 dark:bg-blue-light-500/10 border-blue-light-500/30 dark:border-blue-light-500/20 shadow-sm",
            icon: "text-blue-light-500",
        },
    };

    // Icon for each variant (KMB brand icon)
    const icons = {
        success: (
            <img
                src="/icon/icon.svg"
                className="w-6 h-6 object-contain"
                alt="Success"
            />
        ),
        error: (
            <img
                src="/icon/icon.svg"
                className="w-6 h-6 object-contain"
                alt="Error"
            />
        ),
        warning: (
            <img
                src="/icon/icon.svg"
                className="w-6 h-6 object-contain"
                alt="Warning"
            />
        ),
        info: (
            <img
                src="/icon/icon.svg"
                className="w-6 h-6 object-contain"
                alt="Info"
            />
        ),
    };

    return (
        <div
            className={`rounded-xl border p-4 ${variantClasses[variant].container}`}
        >
            <div className="flex items-start gap-3">
                <div className={`-mt-0.5 ${variantClasses[variant].icon}`}>
                    {icons[variant]}
                </div>

                <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h4>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {message}
                    </p>

                    {showLink && (
                        <Link
                            href={linkHref}
                            className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
                        >
                            {linkText}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert;
