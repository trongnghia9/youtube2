import React, { createContext, useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoChevronDown, IoHome, IoHomeOutline, IoLogoBuffer, IoReturnDownBackSharp } from "react-icons/io5";
import { SiCarrd, SiYoutubeshorts, SiYoutubestudio } from "react-icons/si";
import { ThemeContext } from "../../services/ThemeContext";
import { MdGTranslate, MdMenuOpen, MdOutlineDashboard, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight, MdOutlineVideoLibrary } from "react-icons/md";
import { LuUserRoundPen } from "react-icons/lu";
import { FaMoon, FaProductHunt, FaSun, FaUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { SlSettings } from "react-icons/sl";
import { RiFolderVideoLine, RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { CgPlayList, CgProfile } from "react-icons/cg";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { motion } from "framer-motion";

import logoDefault from "../../assets/images/Logo.png";
import avatarDefault from "../../assets/images/Avatar_Default.png";

const DropdownSidebarMenuUser = ({ onToggle, isOpen, userInfo, isLoggedIn }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const [openSetting, setOpenSetting] = useState(false);
    const [showSetting, setShowSetting] = useState(false);

    const [showAllChannels, setShowAllChannels] = useState(false);

    // console.log(userInfo);

    const menuItems = [
        { label: "Home", icon: <IoHome className="size-5" />, path: `/` },
        { label: "Shorts", icon: <SiYoutubeshorts className="size-5" />, path: `/shorts` },
    ];

    const MenuLoggedIn = [
        // { title: "Studio", icon: <CgProfile className="size-6" />, path: `/studio/content-management/videos` },
        { label: "History view", icon: <PiClockCounterClockwiseBold className="size-5" />, path: `/vietductn281103@gmail.com/profile/viewing-history` },
        { label: "Videos", icon: <RiFolderVideoLine className="size-5" />, path: `/vietductn281103@gmail.com/profile/videos-posted` },
        { label: "Playlist", icon: <CgPlayList className="size-5" />, path: `/vietductn281103@gmail.com/profile/playlists` },
    ];

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
    ];

    const toggleSetting = () => {
        if (openSetting) {
            setOpenSetting(false);
            setTimeout(() => {
                setShowSetting(false);
            }, 300);
        } else {
            setShowSetting(true);
            setTimeout(() => {
                setOpenSetting(true);
            }, 10);
        }
    };

    return (
        <>
            <nav className={`shadow-md h-screen px-2 duration-500 theme-header-third ${isOpen ? 'w-52' : 'w-16'}`}>

                <div className="flex flex-col justify-between h-full">
                    <div className="">
                        <div className={`mx-1.25 my-0.25 h-16 flex items-center ${isOpen ? "justify-between" : "justify-center"} border-b-1.5`}>
                            <div className={`${!isOpen ? 'w-0' : 'w-5/6'} flex items-center gap-3`}>
                                <img src={logoDefault} alt="Logo" className={`${!isOpen ? 'size-0' : 'size-12'} rounded-lg ease-in-out duration-500`} />
                                <p className={`text-xl font-semibold ${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden`}>Metube</p>
                            </div>
                            <div className="mt-1 w-8 h-8 border-1.5 theme-border rounded-full p-1"><RiMenuFoldFill className={`size-5 duration-500 cursor-pointer ${!isOpen && ' rotate-180'} ease-in-out duration-100`} onClick={onToggle} /></div>
                        </div>

                        <div className="">
                            <ul className={`flex flex-col my-1`}>
                                {
                                    menuItems.map((item, index) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <NavLink to={item.path} key={index} className={`px-2 py-1.5 my-0.5 rounded-md duration-300 cursor-pointer relative group ${isActive ? 'theme-active' : 'theme-text-first theme-hover'}`}>
                                                <li className="flex items-center gap-3 rounded-lg text-sm">
                                                    <div className="border-1.5 theme-border rounded-full p-1">{item.icon}</div>
                                                    <p className={`${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden text-sm font-medium`}>{item.label}</p>

                                                    {!isOpen && (
                                                        <div className={`absolute z-50 left-full w-auto rounded-md px-2.5 py-1.5 ml-4 theme-first text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-300`}>{item.label}</div>
                                                    )}
                                                </li>
                                            </NavLink>
                                        )
                                    })
                                }
                            </ul>

                            {isLoggedIn ? (
                                <div className="">
                                    <div className={`loggedIn border-t-1.5 ${theme === "dark" ? "border-fourthColor" : "border-firstColor"}`}>
                                        <ul className="flex flex-col my-1">
                                            {MenuLoggedIn.map((item, index) => {
                                                const isActive = location.pathname === item.path;
                                                return (
                                                    <NavLink to={item.path} key={index} className={`px-2 py-1.5 my-0.5 rounded-md duration-300 cursor-pointer relative group ${isActive ? 'theme-active' : 'theme-text-first theme-hover'}`}>
                                                        <li className="flex items-center gap-3 rounded-lg text-sm">
                                                            <div className="border-1.5 theme-border rounded-full p-1">{item.icon}</div>
                                                            <p className={`${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden text-sm font-medium truncate`}>{item.label}</p>

                                                            {!isOpen && (
                                                                <div className={`absolute z-50 left-full w-auto rounded-md px-2.5 py-1.5 ml-4 theme-first text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-300`}>{item.label}</div>
                                                            )}
                                                        </li>
                                                    </NavLink>
                                                )
                                            })}
                                        </ul>
                                    </div>

                                    <div className={`subscribed-channels border-t-1.5 ${theme === "dark" ? "border-fourthColor" : "border-firstColor"} py-1`}>
                                        <div className='px-2 py-1.5 my-0.5 theme-text-first theme-hover rounded-md duration-300 cursor-pointer flex gap-3 items-center relative group shadow-sm'>
                                            <button className="border-1.5 theme-border rounded-full p-1" onClick={() => setShowAllChannels(!showAllChannels)}><GoPeople className="size-5" /></button>
                                            <div className="w-full">
                                                <div className={`${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden flex items-center justify-between`}>
                                                    <p className={`text-sm font-medium`}>Channels</p>
                                                    <button className="border theme-border rounded-full" onClick={() => setShowAllChannels(!showAllChannels)}>
                                                        <MdOutlineKeyboardArrowDown className={`size-5 duration-500 cursor-pointer ${showAllChannels ? "rotate-180" : ""}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            {showAllChannels && (
                                                <div className={`absolute z-50 left-full ml-4 rounded-md p-1.5 theme-header-third text-sm transition-all duration-300 ease-in-out ${!isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
                                                    <div className="max-h-60 w-48 content-sidebar overflow-y-auto overflow-x-hidden">
                                                        {subscribedChannels.map((channel, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ x: 50, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ duration: 0.05, delay: index * 0.05 }}
                                                                className="flex items-center gap-3 p-1.5 mb-1 theme-hover rounded-md cursor-pointer"
                                                            >
                                                                <img
                                                                    src={channel.avatar}
                                                                    alt={channel.nameChannel}
                                                                    className="size-8 rounded-full object-cover"
                                                                />
                                                                <p className="text-sm font-medium truncate">{channel.nameChannel}</p>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                        {isOpen && showAllChannels && (
                                            <div className="flex flex-col max-h-[calc(100vh-500px)] content-sidebar overflow-y-auto overflow-x-hidden">
                                                {subscribedChannels.map((channel, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ x: 100, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ duration: 0.05, delay: index * 0.05 }}
                                                        className="flex items-center gap-3 p-1.25 m-0.5 rounded-md theme-hover theme-text-first cursor-pointer"
                                                    >
                                                        <img
                                                            src={channel.avatar}
                                                            alt={channel.nameChannel}
                                                            className="size-8 rounded-full object-cover"
                                                        />
                                                        {isOpen && (
                                                            <p className="text-sm font-medium truncate">
                                                                {channel.nameChannel}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ) : (
                                <div className=""></div>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='setting border-t-1.5'>
                            <div className='px-2 py-1.5 my-2 theme-text-first theme-hover rounded-md duration-300 cursor-pointer flex gap-3 items-center relative group'>
                                <div className="border-1.5 theme-border rounded-full p-1" onClick={toggleSetting}><SlSettings className="size-5" /></div>
                                <div className="w-full">
                                    <div className={`${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden flex items-center justify-between`}>
                                        <p className={`text-sm font-medium`}>Setting</p>
                                        <button className="border theme-border rounded-full" onClick={toggleSetting}>
                                            <MdOutlineKeyboardArrowRight className={`size-5 duration-500 cursor-pointer ${openSetting ? "rotate-180" : ""}`} />
                                        </button>
                                    </div>
                                </div>
                                {showSetting && (
                                    <div className={`absolute z-50 left-full ml-4 w-28 rounded-md p-2 theme-first text-sm transition-all duration-300 ease-in-out ${openSetting ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
                                        <div className="flex flex-col items-start gap-2">
                                            <button onClick={toggleTheme} className="flex items-center gap-1">
                                                {theme === "dark" ? <FaSun className="icon-setting" /> : <FaMoon className="icon-setting" />}
                                                <span>{theme === "dark" ? "Light" : "Moon"}</span>
                                            </button>
                                            <button className="flex items-center gap-1">
                                                <MdGTranslate className="icon-setting" /> Translate
                                            </button>
                                            <NavLink
                                                to={`/setting`}
                                                className="px-2.5 py-0.5 border theme-border rounded-md hover:text-[--text-first-color] hover:underline"
                                            >
                                                To Setting
                                            </NavLink>
                                        </div>
                                    </div>
                                )}

                                {/* {!open && (
                                    <div className={`absolute z-50 left-full w-28 rounded-md p-2 ml-4 theme-first text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-300`}>
                                        <div className="flex flex-col items-start gap-2">
                                            <button onClick={toggleTheme} className="flex items-center gap-0.25">
                                                {theme === "dark" ? <FaSun className="icon-setting" /> : <FaMoon className="icon-setting" />}
                                                <span>{theme === "dark" ? "Light" : "Moon"}</span>
                                            </button>
                                            <button className="flex items-center"><MdGTranslate className="icon-setting" /> Translate</button>
                                            <NavLink to={`/setting`} className={"px-2.5 py-0.5 border-1.5 theme-border rounded-md hover:text-[--text-first-color] hover:underline"}>to Setting</NavLink>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <div className="info-user mx-0.5 duration-300 cursor-pointer flex items-center relative group py-2.5 border-t-1.5">
                            <NavLink to={`/${userInfo?.email}/profile/videos-posted`} className="flex items-center gap-2.5 h-10">
                                <div className="size-11">
                                    <img src={userInfo?.channel?.avatarChannel ? userInfo.channel.avatarChannel : avatarDefault} alt="Avatar" className="size-11 rounded-md" />
                                </div>
                                <div className="flex flex-col">
                                    <p className={`${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden text-sm font-medium`}>{userInfo?.channel.nameChannel}</p>
                                    <div className="w-5/6">
                                        <p className={`${!isOpen && 'w-0 translate-x-20'} duration-500 overflow-hidden text-xs truncate`}>{userInfo?.email}</p>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default DropdownSidebarMenuUser;