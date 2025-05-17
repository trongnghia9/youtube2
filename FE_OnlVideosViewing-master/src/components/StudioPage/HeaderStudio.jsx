import React, { createContext, useContext, useEffect, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsArrowBarLeft, BsFilePost, BsPostcardFill } from "react-icons/bs";
import { IoCreate, IoReturnDownBackSharp } from "react-icons/io5";
import { LuUserRoundPen } from "react-icons/lu";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { SiCarrd, SiYoutubeshorts, SiYoutubestudio } from "react-icons/si";
import { TbArrowBarRight } from "react-icons/tb";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import { ThemeContext } from "../../services/ThemeContext";

const avatarDefault = "https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png";

export default function HeaderStudio({ onToggle, isOpen, isLoggedIn, userInfo }) {

    const { theme, toggleTheme } = useContext(ThemeContext);

    console.log(userInfo);

    const Menu = [
        {
            title: "Content",
            icon: <SiCarrd className="size-6" />,
            path: `/studio/content-management/videos`
        },
        {
            title: "Create Video",
            icon: <MdOutlineVideoLibrary className="size-6" />,
            path: `/studio/create-video`
        },
        {
            title: "Create Short",
            icon: <SiYoutubeshorts className="size-6" />,
            path: `/studio/create-short`
        },
        {
            title: "Create Blog",
            icon: <BsPostcardFill className="size-6" />,
            path: `/studio/create-blog`
        },
        {
            title: "Edit Profile",
            icon: <LuUserRoundPen className="size-6" />,
            path: `/studio/edit-profile/${userInfo?.channel?._id}`
        },
        {
            title: "Setting",
            icon: <AiOutlineSetting className="size-6" />,
            path: `/studio/setting`
        },
        {
            title: "Back Profile",
            icon: <IoReturnDownBackSharp className="size-6" />,
            path: `/${userInfo?.email}/profile/videos-posted`
        }
    ]

    const location = useLocation();
    const SidebarContext = createContext();

    // Drawer
    const [openHeader, setOpenHeader] = useState(false);
    const showDrawerHeader = () => {
        setOpenHeader(true);
    };
    const onCloseHeader = () => {
        setOpenHeader(false);
    };

    return (
        <div className="">
            <div className={`${isOpen ? "w-56" : "w-20"} duration-300 hidden lg:block`}>
                <aside className="h-screen py-1 pl-1.5">
                    <nav className="h-full flex flex-col items-center theme-header-third theme-border rounded border-r shadow-sm">
                        <div className={`w-full p-4 pb-2 flex items-center ${isOpen ? "justify-between" : "justify-center"}`}>
                            <div className={`leading-4 ${isOpen ? "w-full" : "w-0"}`}>
                                <div className={`font-semibold theme-text-first flex items-center gap-0.5 overflow-hidden transition-all ${isOpen ? "scale-100" : "scale-0"} duration-300`}><SiYoutubestudio className="size-6" /><span className="text-2xl underline">Studio</span></div>
                            </div>
                            <button className="p-1.5 rounded-lg theme-first hover:opacity-75" onClick={onToggle}>
                                {isOpen ? <BsArrowBarLeft className="size-6" /> : <TbArrowBarRight className="size-6" />}
                            </button>
                        </div>

                        <SidebarContext.Provider value={isOpen}>
                            <ul className="flex flex-col flex-grow items-center">
                                {Menu.map((item, index) => {
                                    const isActive = item.path.startsWith('/studio/content-management')
                                        ? location.pathname.startsWith('/studio/content-management')
                                        : location.pathname === item.path;
                                    return (
                                        <NavLink key={index} to={item.path} className={`relative p-2 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? 'theme-active' : 'theme-text-first theme-hover'}`}>
                                            <li className="flex items-center justify-center rounded-lg text-sm">
                                                <div className="p-1 rounded-full border theme-first">{item.icon}</div>
                                                <span className={`overflow-hidden transition-all ${isOpen ? "w-32 ml-3 truncate" : "hidden"}`}>{item.title}</span>
                                                {alert && <div className={`absolute right-2.5 size-2 rounded-full bg-thirdColor ${isOpen ? "" : "top-2"}`} />}

                                                {!isOpen && (
                                                    <div className={`absolute z-50 left-full w-26 rounded-md px-2 py-1 ml-6 theme-first text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-300`}>{item.title}</div>
                                                )}
                                            </li>
                                        </NavLink>
                                    )
                                })}
                            </ul>
                        </SidebarContext.Provider>

                        <div className="w-full h-auto border-t theme-border flex justify-center py-2.5 px-2">
                            <img src={userInfo?.avatar?.url ? userInfo.avatar.url : avatarDefault} alt="" className="size-10 rounded-md" />
                            <div className={`flex justify-between items-center overflow-hidden transition-all ${isOpen ? "w-56 ml-2" : "w-0"}`}>
                                <div className="flex flex-col justify-center items-start">
                                    <p className="text-sm font-semibold theme-text-first">{userInfo?.username}</p>
                                    <span className="text-xs theme-text-first truncate">{userInfo?.email}</span>
                                </div>
                            </div>
                        </div>
                    </nav>
                </aside>
            </div>
            <div className="lg:hidden">
                <button className="p-1.5 rounded-lg theme-first hover:opacity-75" onClick={showDrawerHeader}>
                    <TbArrowBarRight className="size-6" />
                </button>
                <Drawer
                    title={
                        <div className={`w-full p-4 pb-2 flex items-center justify-between`}>
                            <div className={`leading-4 w-full`}>
                                <div className={`font-semibold theme-text-first flex items-center gap-0.5 overflow-hidden transition-all scale-100 duration-300`}><SiYoutubestudio className="size-6" /><span className="text-2xl underline">Studio</span></div>
                            </div>
                            <button className="p-1.5 rounded-lg theme-first hover:opacity-75" onClick={onCloseHeader}>
                                <BsArrowBarLeft className="size-6" />
                            </button>
                        </div>
                    }
                    closable={false}
                    placement="left"
                    onClose={onCloseHeader}
                    open={openHeader}
                    width={200}
                    headerStyle={{
                        padding: "0",
                        background: theme === "dark" ? "#252525" : "#EDEDED",
                        color: theme === "dark" ? "#EDEDED" : "#8D9192",
                    }}
                    bodyStyle={{
                        padding: "0.5rem 0",
                        background: theme === "dark" ? "#111111" : "#FFFFFF",
                        color: theme === "dark" ? "#EDEDED" : "#252525",
                        overflowY: "auto",
                    }}
                    className={`custom-drawer ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                >
                    <SidebarContext.Provider value={isOpen}>
                        <ul className="flex flex-col flex-grow items-center">
                            {Menu.map((item, index) => {
                                const isActive = item.path.startsWith('/studio/content-management')
                                    ? location.pathname.startsWith('/studio/content-management')
                                    : location.pathname === item.path;
                                return (
                                    <NavLink key={index} to={item.path} className={`relative p-2 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? 'theme-active' : 'theme-text-first theme-hover'}`}>
                                        <li className="flex items-center justify-center rounded-lg text-sm">
                                            <div className="p-1 rounded-full border theme-first">{item.icon}</div>
                                            <span className={`overflow-hidden transition-all ${isOpen ? "w-32 ml-3 truncate" : "hidden"}`}>{item.title}</span>
                                            {alert && <div className={`absolute right-2.5 size-2 rounded-full bg-thirdColor ${isOpen ? "" : "top-2"}`} />}

                                            {!isOpen && (
                                                <div className={`absolute z-50 left-full w-26 rounded-md px-2 py-1 ml-6 theme-first text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-300`}>{item.title}</div>
                                            )}
                                        </li>
                                    </NavLink>
                                )
                            })}
                        </ul>
                    </SidebarContext.Provider>
                </Drawer>
            </div>
        </div>
    )
}