import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import HeaderUser from "../components/UserPages/HeaderUser";
import FooterUser from "../components/UserPages/FooterUser";
import { ThemeContext } from "../services/ThemeContext";
import { SocketContext } from "../services/SocketContext";
import DropdownSidebarMenuUser from "../components/UserPages/DropdownSidebarMenuUser";

const UserLayout = () => {

    const { theme } = useContext(ThemeContext);
    const { socket, isConnected, isLoggedIn, userInfo } = useContext(SocketContext);

    // console.log("Is connected:", isConnected);

    // console.log("Is logged in:", isLoggedIn);

    // console.log("User info:", userInfo);

    // console.log("Socket:", socket);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
    };

    return (
        <div className={`h-screen w-full flex justify-center overflow-hidden ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="flex w-full max-w-screen-2xl">
                <div className="hidden md:block">
                    <DropdownSidebarMenuUser
                        onToggle={handleToggleSidebar}
                        isOpen={isSidebarOpen}
                        userInfo={userInfo}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <HeaderUser value={{ socket, isConnected, isLoggedIn, userInfo }} />
                    <div className="flex-1 overflow-y-auto body-sidebar">
                        <Outlet context={{ theme, isLoggedIn, userInfo }} />
                    </div>
                </div>
            </div>
            <div className="lines"></div>
            <FooterUser />
        </div>
    );
};

export default UserLayout;