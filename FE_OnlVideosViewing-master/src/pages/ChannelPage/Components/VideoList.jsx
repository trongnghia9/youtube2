import { MoreOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { NavLink, useOutletContext } from "react-router-dom";
import { formatNumber } from "../../../utils/formatNumber";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";
import { formatVideoDuration } from "../../../utils/formatVideoDuration";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosOfChannel } from "../../../redux/reducers/videoReducer";

const VideoList = () => {
    const dispatch = useDispatch();
    const { theme, channelInfo } = useOutletContext();

    const { allVideos, loading } = useSelector((state) => state.video);

    useEffect(() => {
        if (channelInfo?._id) {
            dispatch(getAllVideosOfChannel(channelInfo._id));
        }
    }, [channelInfo?._id, dispatch]);

    // State lưu _id của popover đang mở
    const [openMoreOptions, setOpenMoreOptions] = useState(null);

    // Hàm đóng popover
    const hideMoreOptions = () => {
        setOpenMoreOptions(null);
    };

    // Hàm xử lý mở popover theo _id
    const handleOpenMoreOptionsChange = (_id, newOpen) => {
        setOpenMoreOptions(newOpen ? _id : null);
    };

    return (
        <div className="p-1.5 mx-auto">
            <div className={`rounded-xl p-2 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                {loading ? (
                    <p className="text-center py-8 font-medium">Đang tải video...</p>
                ) : allVideos.length === 0 ? (
                    <p className="text-center py-8 font-medium">Chưa có video nào được đăng.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 computerScreen:grid-cols-6 gap-4">
                        {allVideos.map((video) => (
                            <div key={video._id} className={`w-full rounded-2xl hover:shadow duration-200 ease-in overflow-hidden theme-card-first`}>
                                <div className="relative">
                                    <NavLink key={video._id} to={`/video-viewing/${video._id}`}>
                                        <div className="relative">
                                            <img src={video.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover" />
                                            <p className="absolute top-1/16 right-1/16 rounded-full px-2 py-1 text-xs theme-card-first">
                                                {formatVideoDuration(video.duration)}
                                            </p>
                                        </div>
                                    </NavLink>
                                    <div className="absolute -bottom-6 right-1/4 w-12 h-12">
                                        <NavLink key={video._id} to={`/${channelInfo?.nameChannel}`}>
                                            <img src={channelInfo?.avatarChannel} alt="Avatar" className="avatar" />
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <NavLink key={video._id} to={`/${channelInfo?.nameChannel}`}>
                                        <p className="text-sm font-medium ml-0.25 inline-block">{channelInfo?.nameChannel}</p>
                                    </NavLink>
                                    <NavLink key={video._id} to={`/video-viewing/${video._id}`}>
                                        <p className="font-semibold text-lg line-clamp-1 lg:line-clamp-2">{video.title}</p>
                                    </NavLink>
                                    <div className="flex items-baseline justify-between mt-2 md:mt-1.5">
                                        <div className="flex items-center text-sm ml-0.25">
                                            <p className="font-medium">
                                                {formatNumber(video.views)} <span className="font-normal text-xs">views</span>
                                            </p>
                                            <span className="mx-2">•</span>
                                            <p className="font-medium">{formatTimeAgo(video.createdAt)}</p>
                                        </div>
                                        <Popover
                                            content={
                                                <div className="flex flex-col gap-1">
                                                    <button className="btn-event__4 gap-0.5">
                                                        <IoBookmarkOutline className="icon-setting" /> Save
                                                    </button>
                                                    <button className="btn-event__4 gap-0.5">
                                                        <MdOutlinePlaylistAdd className="icon-setting" /> Add Playlist
                                                    </button>
                                                </div>
                                            }
                                            trigger="click"
                                            open={openMoreOptions === video._id}
                                            onOpenChange={(newOpen) => handleOpenMoreOptionsChange(video._id, newOpen)}
                                        >
                                            <button type="primary" className="btn-event__1 px-1 py-0 rounded-full">
                                                <MoreOutlined className="" />
                                            </button>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VideoList;