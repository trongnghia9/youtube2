import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useOutletContext } from "react-router-dom";

const MenuContent = [
    {
        title: "Videos",
        path: `/studio/content-management/videos`
    },
    {
        title: "Shorts",
        path: `/studio/content-management/shorts`
    },
    {
        title: "Blogs",
        path: `/studio/content-management/blogs`
    },
    {
        title: "Playlist",
        path: `/studio/content-management/playlists`
    },
]

const ContentManagement = () => {

    const location = useLocation();
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    // console.log("User info:", userInfo);

    const isEditOrDetailPage = /\/(edit|detail)/.test(location.pathname);

    return (
        <div className="m-2">
            <div className="theme-third rounded-lg p-2 flex flex-col gap-4">
                <div className="title mx-2 border-b-1.5 theme-border">
                    <p className="text-xl font-semibold">Content Management</p>
                </div>
                
                {!isEditOrDetailPage && (
                    <div className="content">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center mx-1.5">
                                {MenuContent.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <div className="w-1/10" key={index}>
                                            <div className="w-11/12 mx-auto duration-300">
                                                <NavLink
                                                    to={item.path}
                                                    className={`flex items-center justify-center gap-x-4 h-10 text-base ${isActive ? "theme-third" : "theme-text-first hover:opacity-75"}`}
                                                >
                                                    <span className="text-sm font-medium truncate">{item.title}</span>
                                                </NavLink>
                                                <div className={`line h-0.5 w-11/12 mx-auto ${isActive ? "theme-bg-second opacity-100 scale-100" : "opacity-0 scale-0"} duration-200`}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mx-1.5">
                    <Outlet context={{ theme, isLoggedIn, userInfo, showNotification }} />
                </div>
            </div>
        </div>
    )
}

export default ContentManagement;