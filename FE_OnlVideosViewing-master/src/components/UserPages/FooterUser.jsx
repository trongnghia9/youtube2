import React, { useState } from "react";
import { BiWorld } from "react-icons/bi";
import { IoHome, IoSettingsOutline } from "react-icons/io5";
import { RiTv2Line } from "react-icons/ri";
import { SiYoutubeshorts } from "react-icons/si";
import { NavLink, useLocation } from "react-router-dom";

const FooterUser = () => {

    const location = useLocation();

    const Menu = [
        {
            title: "Home",
            icon: <IoHome className="size-6" />,
            path: `/`
        },
        {
            title: "Shorts",
            icon: <SiYoutubeshorts className="size-6" />,
            path: `/shorts`
        },
        {
            title: "Discover",
            icon: <BiWorld className="size-6" />,
            path: `/discover`
        },
        {
            title: "Channels",
            icon: <RiTv2Line className="size-6" />,
            path: `/channels`
        },
        {
            title: "Setting",
            icon: <IoSettingsOutline className="size-6" />,
            path: `/setting`
        }
    ]

    return (
        <div className="theme-first fixed bottom-0 left-0 w-full shadow-md z-50">
            <footer className="block md:hidden">
                <div className="flex justify-between items-center px-5 h-12 rounded-md">
                    {Menu.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={`relative h-full w-full flex flex-col justify-center items-center group cursor-pointer`}
                            >
                                <div className={`group-hover:-translate-y-5 group-hover:p-2 group-hover:rounded-full group-hover:text-[--third-color] group-hover:bg-[--background-third-color] group-hover:border-2 group-hover:border-[--third-color] duration-200 ease-linear ${isActive ? "-translate-y-1/2 p-2 rounded-full text-[--third-color] bg-[--background-third-color] border-2 border-[--third-color]" : ""}`}>
                                    {item.icon}
                                </div>
                                <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs group-hover:opacity-100 duration-200 ease-linear ${isActive ? "opacity-100" : "opacity-0"}`}>{item.title}</div>
                            </NavLink>
                        );
                    })}
                </div>
            </footer>
        </div>
    );
};

export default FooterUser;