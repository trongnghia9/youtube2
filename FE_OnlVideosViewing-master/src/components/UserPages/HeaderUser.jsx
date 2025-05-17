import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../services/ThemeContext";
import LoginStatus from "./LoginStatus";
import { IoSearchOutline } from "react-icons/io5";

const HeaderUser = ({ value }) => {

    const { theme, toggleTheme } = useContext(ThemeContext);

    const { socket, isConnected, isLoggedIn, userInfo } = value;

    // console.log("Is connected:", isConnected);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Search
    const onSearch = (value, _e, info) => console.log(info?.source, value);

    // Setup
    const [openSetting, setOpenSetting] = useState(false);
    const hideSetting = () => {
        setOpenSetting(false);
    };
    const handleOpenSettingChange = (newOpenSetting) => {
        setOpenSetting(newOpenSetting);
    };

    // Drawer Search
    const [openSearch, setOpenSearch] = useState(false);
    const showDrawerSearch = () => {
        setOpenSearch(true);
    };
    const onCloseSearch = () => {
        setOpenSearch(false);
    };

    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchClick = () => {
        console.log("Tìm kiếm với từ khoá:", searchTerm);
        // Bạn có thể thêm logic tìm kiếm ở đây
    };

    return (
        <div className="flex items-center justify-between h-16 theme-header-third shadow-md px-2 md:px-6 border-b-1.5">
            <div className="left-header relative w-full md:w-5/6 flex justify-start">
                <div className={`relative transition-all duration-500 ease-in-out ${isFocused ? "w-full max-w-lg" : "w-full max-w-sm"} rounded-full border-1.5 theme-border`}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`w-full pl-16 pr-4 py-2 text-sm rounded-full theme-header-first placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                    />
                    <button
                        onClick={handleSearchClick}
                        className="absolute inset-y-0 left-0 pl-4 pr-3.5 flex items-center pointer-events-auto transition-colors duration-300 cursor-pointer border-r-1.5 theme-border rounded-l-full theme-header-first theme-hover"
                    >
                        <IoSearchOutline className="size-5 hover:scale-110 transition-all duration-300 ease-in-out" />
                    </button>
                </div>
            </div>

            <div className="right-header w-1/2 sm:w-1/3 lg:w-1/5 xl:w-1/6 flex items-center justify-end">
                <LoginStatus value={{ socket, isConnected, isLoggedIn, userInfo }} />
            </div>
        </div>
    );
};

export default HeaderUser;