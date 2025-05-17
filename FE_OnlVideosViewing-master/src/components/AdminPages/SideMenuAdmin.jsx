import React, { createContext } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsArrowBarLeft } from "react-icons/bs";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { LuUserRoundPen } from "react-icons/lu";
import { MdManageAccounts, MdOutlineVideoLibrary } from "react-icons/md";
import { SiCarrd, SiYoutubeshorts, SiYoutubestudio } from "react-icons/si";
import { TbArrowBarRight, TbMessageReport } from "react-icons/tb";
import { NavLink, useLocation } from "react-router-dom";

const SideMenuAdmin = ({ onToggle, isOpen }) => {
    const Menu = [
        {
            title: "Accounts",
            icon: <MdManageAccounts className="size-6" />,
            path: `/admin/accounts-management`
        },
        {
            title: "Reports",
            icon: <TbMessageReport className="size-6" />,
            path: `/admin/reports`
        },
    ]

    const location = useLocation();
    const SidebarContext = createContext();

    return (
        <div className={`${isOpen ? "w-52" : "w-16"} duration-300`}>
            <aside className="h-screen py-1 pl-1.5">
                <nav className="h-full flex flex-col items-center themeBgReverse rounded border-r shadow-sm">
                    <div className={`w-full p-2.5 flex items-center ${isOpen ? "justify-between" : "justify-center"} shadow-md`}>
                        <div className={`${isOpen ? "w-full" : "w-0"}`}>
                            <div className={`h-9 w-2/3 object-container rounded-sm flex justify-around items-center transition-all ${isOpen ? "scale-100" : "scale-0"} duration-300`}>
                                <img src="https://res.cloudinary.com/dci95w73h/image/upload/v1738316604/OnlVideosViewing/FE/Logo/ImageApp_ntdlhd_fga1fc.png" alt="img_logo" className="size-9 object-cover rounded-full shadow-md"/>
                                <p className="text-sm font-semibold text-secondColor underline">Admin</p>
                            </div>
                        </div>
                        <button className="p-1.5 rounded-lg theme hover:opacity-75" onClick={onToggle}>
                            <TbArrowBarRight className={`size-6 duration-500 cursor-pointer ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    <SidebarContext.Provider value={isOpen}>
                        <ul className="flex flex-col flex-grow items-center">
                            {Menu.map((item, index) => {
                                const isActive = item.path.startsWith('/studio/content-management')
                                    ? location.pathname.startsWith('/studio/content-management')
                                    : location.pathname === item.path;
                                return (
                                    <NavLink key={index} to={item.path} className={`relative p-2 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? 'theme hover:opacity-95' : 'themeTextReverse'} hover:bg-secondColor transition-all duration-150 ease-in-out shadow-sm`}>
                                        <li className="flex items-center justify-center rounded-lg text-sm">
                                            <div className="p-1 rounded-full border theme">{item.icon}</div>
                                            <span className={`overflow-hidden transition-all ${isOpen ? "w-32 ml-3 truncate" : "hidden"}`}>{item.title}</span>
                                            {alert && <div className={`absolute right-2.5 size-2 rounded-full bg-indigo-600 ${isOpen ? "" : "top-2"}`} />}

                                            {!isOpen && (
                                                <div className={`absolute z-50 left-full w-26 rounded-md px-2 py-1 ml-6 theme text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-300`}>{item.title}</div>
                                            )}
                                        </li>
                                    </NavLink>
                                )
                            })}
                        </ul>
                    </SidebarContext.Provider>

                    <div className="w-full h-auto border-t themeBorderReverse flex justify-center py-2.5 px-2">
                        <img src="https://res.cloudinary.com/dci95w73h/image/upload/v1738316604/OnlVideosViewing/FE/Logo/ImageApp_ntdlhd_fga1fc.png" alt="" className="size-10 rounded-md" />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${isOpen ? "w-56 ml-2" : "w-0"}`}>
                            <div className="flex flex-col justify-center items-start">
                                <p className="text-sm font-semibold themeTextReverse">Viet Duc</p>
                                <span className="text-xs themeTextReverse truncate">vietductn281103@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </div>
    )
};

export default SideMenuAdmin;