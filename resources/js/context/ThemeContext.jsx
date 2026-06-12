import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext(undefined);

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }
    // Tidak ada preferensi tersimpan → ikuti sistem device
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Inisialisasi langsung agar tidak ada flash
        const initial = getInitialTheme();
        if (initial === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        return initial;
    });

    useEffect(() => {
        // Terapkan class & simpan ke localStorage setiap kali tema berubah
        localStorage.setItem("theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
