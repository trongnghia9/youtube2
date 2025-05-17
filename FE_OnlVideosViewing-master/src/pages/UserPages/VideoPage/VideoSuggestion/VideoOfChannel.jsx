import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearChannelInfo, getChannelByName } from "../../../../redux/reducers/channelReducer";
import { NavLink } from "react-router-dom";
import { getAllVideosOfChannel } from "../../../../redux/reducers/videoReducer";

const VideoOfChannel = ({ theme, videoId, channelName, formatNumber, formatTimeAgo }) => {
    const dispatch = useDispatch();
    const { channelInfo, error } = useSelector((state) => state.channel);

    const { allVideos, loading } = useSelector((state) => state.video);

    // console.log("allVideos", allVideos);

    useEffect(() => {
        if (channelInfo?._id) {
            dispatch(getAllVideosOfChannel(channelInfo._id));
        }
    }, [channelInfo?._id, dispatch]);

    if (loading) {
        return (
            <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} p-4`}>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} p-4`}>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    const otherVideos = allVideos?.filter(video => video._id !== videoId);

    // console.log("otherVideos", otherVideos);

    return (
        <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="p-0.5">
                <div className="">
                    {otherVideos.length > 0 ? (
                        otherVideos.map((video) => (
                            <div key={video._id} className="flex mx-1 my-1.5 border-b-0.5 rounded-lg gap-2 p-1 theme-bg-first">
                                <NavLink to={`/video-viewing/${video._id}`} className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/2">
                                    <div className="rounded-md overflow-hidden aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:w-full lg:h-full">
                                        <img className="w-full h-auto object-cover hover:scale-105 duration-300" src={video.thumbnail} alt={video.title} />
                                    </div>
                                </NavLink>
                                <div className="w-2/3 sm:w-3/4 md:w-4/5 lg:w-1/2">
                                    <NavLink to={`/video-viewing/${video._id}`}>
                                        <h2 className="text-sm font-semibold themeText">{video.title}</h2>
                                    </NavLink>
                                    <p className="text-xs font-normal themeText opacity-90 mb-1">
                                        {channelName}
                                    </p>
                                    <div className="flex items-center lg:justify-between">
                                        <p className="text-xs themeText flex gap-1">
                                            {formatNumber(video.views)}{" "}
                                            <span className="block lg:hidden xl:block">views</span>
                                        </p>
                                        <span className="mx-2 lg:hidden">•</span>
                                        <p className="text-xs italic truncate themeText">
                                            {formatTimeAgo(video.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-4">No videos found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoOfChannel;