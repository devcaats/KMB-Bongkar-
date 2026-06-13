import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ThemeProvider } from "../context/ThemeContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent = ({ children }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-950 font-sans antialiased text-gray-900 dark:text-gray-100">
            <div>
                <AppSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AppHeader />
                <div className="p-4 mx-auto w-full max-w-screen-2xl md:p-6 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AppLayout = ({ children }) => {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
        </ThemeProvider>
    );
};

export default AppLayout;
