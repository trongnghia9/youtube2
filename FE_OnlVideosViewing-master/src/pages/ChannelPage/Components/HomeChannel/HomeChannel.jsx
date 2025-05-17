import React, { useEffect } from "react";
import VideosForMembers from "./VideosForMembers";
import VideosForEveryone from "./VideosForEveryone";
import { NavLink, useOutletContext } from "react-router-dom";
import { formatNumber } from "../../../../utils/formatNumber";
import { formatTimeAgo } from "../../../../utils/formatTimeAgo";
import { formatVideoDuration } from "../../../../utils/formatVideoDuration";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosOfChannel } from "../../../../redux/reducers/videoReducer";

const HomeChannel = () => {
    const dispatch = useDispatch();
    const { channelInfo } = useOutletContext();

    const nameChannel = channelInfo?.nameChannel;

    const { allVideos, loading } = useSelector((state) => state.video);

    useEffect(() => {
        if (channelInfo?._id) {
            dispatch(getAllVideosOfChannel(channelInfo._id));
        }
    }, [channelInfo?._id, dispatch]);

    const sortedVideos = [...(allVideos || [])].sort((a, b) => b.views - a.views);
    const [top1, top2, top3] = sortedVideos;
    const videosForEveryone = allVideos;

    return (
        <div className="">
            <div className="p-2 md:p-4 mx-auto">
                {!loading && allVideos.length === 0 ? (
                    <p className="text-center font-medium theme-text-second my-8">Chưa có video nào được đăng.</p>
                ) : (
                    <>
                        <div className="most-view-videos flex flex-col lg:flex-row items-start gap-4 w-full h-full">
                            {top1 && (
                                <div key={top1._id} className="w-full lg:w-3/5 2xl:w-1/2 relative">
                                    <NavLink key={top1._id} to={`/video-viewing/${top1._id}`}>
                                        <div className="overflow-hidden rounded-xl bg-gradient-second">
                                            <img src={top1.thumbnail} alt={top1.title} className="w-full h-80 lg:h-96 object-contain hover:scale-110 duration-300 ease-in-out" />
                                        </div>
                                    </NavLink>
                                    <p className="absolute top-2 right-2 opacity-85 rounded-full px-2 py-1 text-xs theme-first">{formatVideoDuration(top1.duration)}</p>
                                    <div className="absolute w-11/12 lg:h-3/4 md:w-2/5 lg:w-3/5 xl:w-1/2 bottom-1/16 left-1/16 md:top-1/12 md:left-1/16 bg-gradient-second rounded-2xl opacity-85 p-4">
                                        <p className="text-2xl font-medium line-clamp-1 md:line-clamp-3">{top1.title}</p>
                                        <p className="text-sm line-clamp-1 md:line-clamp-3 mb-2 mt-1 md:my-4">{top1.description}</p>
                                        <div className="flex items-center gap-0.5 xl:gap-4">
                                            <NavLink className="" to={`/${channelInfo?.nameChannel}`}>
                                                <img src={channelInfo?.avatarChannel} alt="avatar_uploader" className="avatar" />
                                            </NavLink>
                                            <div className="flex flex-col">
                                                <p className="font-medium text-sm">{channelInfo?.nameChannel}</p>
                                                <div className="flex items-center">
                                                    <p className="text-sm truncate"><span className="font-medium">{formatNumber(top1.views)}</span> views</p>
                                                    <span className="mx-2">•</span>
                                                    <p className="text-sm truncate">{formatTimeAgo(top1.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Video nhiều view thứ 2 & 3 */}
                            <div className="w-full lg:w-2/5 2xl:w-1/2">
                                <div className="flex flex-col sm:flex-row justify-evenly gap-4">
                                    {top2 && (
                                        <div key={top2._id} className="relative">
                                            <NavLink key={top2._id} to={`/video-viewing/${top2._id}`}>
                                                <div className="overflow-hidden rounded-xl bg-gradient-second">
                                                    <img src={top2.thumbnail} alt={top2.title} className="w-full lg:w-auto h-80 lg:h-96 object-contain lg:object-cover hover:scale-110 duration-300 ease-in-out" />
                                                </div>
                                            </NavLink>
                                            <p className="absolute top-2 right-2 theme-first opacity-85 rounded-full px-2 py-1 text-xs">{formatVideoDuration(top2.duration)}</p>
                                            <div className="absolute w-11/12 bottom-1/16 left-1/16 bg-gradient-second rounded-2xl opacity-85 px-4 py-2">
                                                <p className="text-lg font-medium line-clamp-1">{top2.title}</p>
                                                <p className="text-sm line-clamp-1 mb-2 mt-1">{top2.description}</p>
                                                <div className="flex items-center gap-4">
                                                    <NavLink className="" to={`/${channelInfo?.nameChannel}`}>
                                                        <img src={channelInfo?.avatarChannel} alt="avatar_uploader" className="avatar" />
                                                    </NavLink>
                                                    <div className="flex flex-col">
                                                        <p className="font-medium text-sm">{channelInfo?.nameChannel}</p>
                                                        <div className="flex items-center">
                                                            <p className="text-sm"><span className="font-medium">{formatNumber(top2.views)}</span> views</p>
                                                            <span className="mx-2">•</span>
                                                            <p className="text-sm">{formatTimeAgo(top2.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {top3 && (
                                        <div key={top3._id} className="relative lg:hidden 2xl:block">
                                            <NavLink key={top3._id} to={`/video-viewing/${top3._id}`}>
                                                <div className="overflow-hidden rounded-xl bg-gradient-second">
                                                    <img src={top3.thumbnail} alt={top3.title} className="w-full lg:w-auto h-80 lg:h-96 object-contain lg:object-cover hover:scale-110 duration-300 ease-in-out" />
                                                </div>
                                            </NavLink>
                                            <p className="absolute top-2 right-2 opacity-85 theme-first rounded-full px-2 py-1 text-xs">{formatVideoDuration(top3.duration)}</p>
                                            <div className="absolute w-11/12 bottom-1/16 left-1/16 bg-gradient-second rounded-2xl opacity-85 px-4 py-2">
                                                <p className="text-lg font-medium line-clamp-1">{top3.title}</p>
                                                <p className="text-sm line-clamp-1 mb-2 mt-1">{top3.description}</p>
                                                <div className="flex items-center gap-4">
                                                    <NavLink className="" to={`/${channelInfo?.nameChannel}`}>
                                                        <img src={channelInfo?.avatarChannel} alt="avatar_uploader" className="avatar" />
                                                    </NavLink>
                                                    <div className="flex flex-col">
                                                        <p className="font-medium text-sm">{channelInfo?.nameChannel}</p>
                                                        <div className="flex items-center">
                                                            <p className="text-sm"><span className="font-medium">{formatNumber(top3.views)}</span> views</p>
                                                            <span className="mx-2">•</span>
                                                            <p className="text-sm">{formatTimeAgo(top3.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        {/* <div className="line w-full h-0.25 bg-fourthColor my-3"></div>
                        <VideosForMembers /> */}
                        <div className="line w-full h-0.25 bg-fourthColor my-3"></div>
                        <VideosForEveryone
                            nameChannel={nameChannel}
                            videosForEveryone={videosForEveryone}
                            formatNumber={formatNumber}
                            formatTimeAgo={formatTimeAgo}
                            formatVideoDuration={formatVideoDuration}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default HomeChannel;