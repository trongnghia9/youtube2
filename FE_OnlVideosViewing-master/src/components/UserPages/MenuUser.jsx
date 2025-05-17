import { Drawer } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { BiWorld } from "react-icons/bi";
import { IoHome } from "react-icons/io5";
import { RiFolderVideoLine, RiTv2Line } from "react-icons/ri";
import { SiYoutubeshorts } from "react-icons/si";
import { NavLink, useLocation } from "react-router-dom";
import { ThemeContext } from "../../services/ThemeContext";
import { CgPlayList, CgProfile } from "react-icons/cg";
import { PiClockCounterClockwiseBold, PiClockCounterClockwiseFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";

const MenuUser = () => {

    const { isLoggedIn, userInfo } = useSelector((state) => state.auth.userLogin);

    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const [showAllChannels, setShowAllChannels] = useState(false);

    // Menu
    const [openMenu, setOpenMenu] = useState(false);
    const showDrawerMenu = () => {
        setOpenMenu(true);
        document.body.style.overflow = "hidden";
    };

    const onCloseMenu = () => {
        setOpenMenu(false);
        document.body.style.overflow = "";
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const Menu = [
        { title: "Home", icon: <IoHome className="size-6" />, path: `/` },
        { title: "Shorts", icon: <SiYoutubeshorts className="size-6" />, path: `/shorts` },
        // { title: "Discover", icon: <BiWorld className="size-6" />, path: `/discover` },
        // { title: "Channels", icon: <RiTv2Line className="size-6" />, path: `/channels` },
    ]

    const MenuLoggedIn = [
        { title: "Studio", icon: <CgProfile className="size-6" />, path: `/studio/content-management/videos` },
        { title: "History view", icon: <PiClockCounterClockwiseBold className="size-6" />, path: `/vietductn281103@gmail.com/profile/viewing-history` },
        { title: "Videos", icon: <RiFolderVideoLine className="size-6" />, path: `/vietductn281103@gmail.com/profile/videos-posted` },
        { title: "Playlist", icon: <CgPlayList className="size-6" />, path: `/vietductn281103@gmail.com/profile/playlist` },
    ]

    const subscribedChannels = [
        { avatar: "https://picsum.photos/id/1/400/300", nameChannel: "OnlVideosViewingOnlVideosViewing" },
        { avatar: "https://picsum.photos/id/2/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/3/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/4/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/5/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/6/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/7/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/8/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/9/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/10/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/11/400/300", nameChannel: "OnlVideosViewing" },
        { avatar: "https://picsum.photos/id/12/400/300", nameChannel: "OnlVideosViewing" },
    ]

    const visibleChannels = showAllChannels ? subscribedChannels : subscribedChannels.slice(0, 5);

    return (
        <>
            <button type="primary" onClick={showDrawerMenu} className="btn-event__1">
                <AiOutlineMenuUnfold className="size-6" />
            </button>
            <Drawer
                title={
                    <div className="grid grid-cols-2 items-center">
                        <div className="header-menu">
                            <button type="primary" onClick={onCloseMenu} className="btn-event__1">
                                <AiOutlineMenuFold className="size-6" />
                            </button>
                        </div>
                        <NavLink to={`/`} className="header-icon -ml-2.5">
                            <img src="https://res.cloudinary.com/dci95w73h/image/upload/v1738316604/OnlVideosViewing/FE/Logo/ImageApp_ntdlhd_fga1fc.png" alt="img_logo" className="size-12 rounded-full" />
                        </NavLink>
                    </div>
                }
                closable={false}
                onClose={onCloseMenu}
                open={openMenu}
                placement="left"
                width={175}
                headerStyle={{
                    padding: "0.65rem 20px",
                    background: theme === "dark" ? "#252525" : "#EDEDED",
                    color: theme === "dark" ? "#EDEDED" : "#8D9192",
                }}
                bodyStyle={{
                    padding: "0.65rem 5px",
                    background: theme === "dark" ? "#111111" : "#FFFFFF",
                    color: theme === "dark" ? "#EDEDED" : "#252525",
                    overflowY: "auto",
                }}
                className={`custom-drawer ${theme === "dark" ? "dark-theme" : "light-theme"}`}
            >
                <div className="menu pb-1">
                    <ul>
                        {Menu.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={`flex items-center gap-x-2 h-10 mb-1.5 px-2.5 rounded text-base font-medium ${isActive ? 'theme-active' : 'theme-text-first theme-hover'} `}
                                >
                                    <div className="size-8 flex justify-center items-center border theme-border rounded-full">
                                        {item.icon}
                                    </div>
                                    <span className="text-sm">{item.title}</span>
                                </NavLink>
                            )
                        })}
                    </ul>
                </div>
                {isLoggedIn ? (
                    <div className="">
                        <div className={`loggedIn border-t-1.5 ${theme === "dark" ? "border-fourthColor" : "border-firstColor"} py-1`}>
                            <p className=" mb-1.5 text-center text-base font-medium underline truncate">Hello {userInfo.channel.nameChannel}</p>
                            <div className="">
                                {MenuLoggedIn.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <NavLink
                                            key={index}
                                            to={item.path}
                                            className={`flex items-center gap-x-2 h-10 mb-1.5 px-2.5 rounded text-base font-medium ${isActive ? 'theme-active' : 'theme-text-first theme-hover'} `}
                                        >
                                            <div className="size-8 flex justify-center items-center border theme-border rounded-full">
                                                {item.icon}
                                            </div>
                                            <span className="text-sm">{item.title}</span>
                                        </NavLink>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={`subscribed-channels border-t-1.5 ${theme === "dark" ? "border-fourthColor" : "border-firstColor"} py-1`}>
                            <p className="mb-1.5 text-center text-base font-medium underline">Subscribed Channels</p>
                            <div className="flex flex-col">
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    {visibleChannels.map((item, index) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <motion.div
                                                key={index}
                                                className={`flex items-center gap-x-2 h-10 mb-1.5 px-2.5 rounded ${isActive ? 'theme-active' : 'theme-text-first theme-hover'}`}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.1 }}
                                            >
                                                <img src={item.avatar} alt="avatar" className="size-8 rounded-full border" />
                                                <span className="text-xs truncate">{item.nameChannel}</span>
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                                <button className="flex items-center gap-x-2 h-10 mb-1.5 px-2.5 rounded cursor-pointer focus:outline-none theme-text-first theme-hover" onClick={() => setShowAllChannels(!showAllChannels)}>
                                    <div className="size-8 flex justify-center items-center border theme-border rounded-full">
                                        <MdOutlineKeyboardArrowDown className={`size-6 duration-500 cursor-pointer ${showAllChannels ? "rotate-180" : ""}`} />
                                    </div>
                                    <p className="text-sm">{showAllChannels ? "Thu gọn" : "Hiển thị tất cả"}</p>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className=""></div>
                )}
            </Drawer>
        </>
    )
}

export default MenuUser;