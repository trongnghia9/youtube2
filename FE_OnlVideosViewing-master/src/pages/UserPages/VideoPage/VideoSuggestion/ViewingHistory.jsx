import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getViewHistoryByUserId } from "../../../../redux/reducers/viewHistoryReducer";
import { NavLink } from "react-router-dom";

const ViewHistory = ({ theme, userInfo, formatNumber, formatTimeAgo }) => {

    const dispatch = useDispatch();

    const userId = userInfo?.channel?._id;

    const { viewHistory, total, page, limit, loading, error } = useSelector((state) => state.viewHistory);

    console.log("viewHistory", viewHistory);

    useEffect(() => {
        dispatch(getViewHistoryByUserId({ userId, page: 1, limit: 5 }));
    }, [dispatch, userId]);

    return (
        <div>
            <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                <div className="p-0.5">
                    <div className="">
                        {viewHistory.map((video) => {
                            const videoInfo = video.videoId;
                            return (
                                <div key={videoInfo._id} className="lg:h-24 flex items-center mx-1 my-1.5 border-b-0.5 rounded-lg gap-2 p-1 theme-bg-first">
                                    <NavLink to={`/video-viewing/${videoInfo._id}`} className={`w-1/3 sm:w-1/4 md:w-1/5 lg:w-5/12`}>
                                        <div className="flex items-center rounded-md overflow-hidden aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:w-full lg:h-full">
                                            <img className="w-full h-auto object-cover hover:scale-105 duration-300" src={videoInfo.thumbnail} alt={videoInfo.title} />
                                        </div>
                                    </NavLink>
                                    <div className="w-2/3 sm:w-3/4 md:w-4/5 lg:w-7/12 flex flex-col gap-1">
                                        <div className="flex flex-col gap-1">
                                            <NavLink to={`/video-viewing/${videoInfo._id}`}>
                                                <h2 className="text-sm font-semibold line-clamp-2">{videoInfo.title}</h2>
                                            </NavLink>
                                            <NavLink to={`/${videoInfo.uploader.nameChannel}`}>
                                                <p className="text-xs font-normal opacity-90 mb-1">{videoInfo.uploader.nameChannel}</p>
                                            </NavLink>
                                        </div>
                                        <div className="flex items-center lg:justify-between">
                                            <p className="text-xs flex gap-1">{formatNumber(videoInfo.views)} <span className="block lg:hidden xl:block">views</span></p>
                                            <span className="mx-2 lg:hidden">•</span>
                                            <p className="text-xs italic truncate">{formatTimeAgo(video.lastViewedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewHistory;