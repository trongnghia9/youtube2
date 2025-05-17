import React, { useContext, useState } from "react";
import SideMenuAdmin from "../components/AdminPages/SideMenuAdmin";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../services/ThemeContext";

export default function AdminLayout () {

    const { theme } = useContext(ThemeContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
    };

    return (
        <div className={`rounded-lg h-screen flex flex-col md:flex-row to-transparent ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <SideMenuAdmin onToggle={handleToggleSidebar} isOpen={isSidebarOpen} className="h-full" />
            <div className={`duration-300 ${isSidebarOpen ? 'lg:w-4/5 xl:w-4/5 2xl:w-10.5/12' : 'w-11.25/12'} h-screen overflow-y-auto mx-auto`}>
                <Outlet />
            </div>
        </div>
    );
};