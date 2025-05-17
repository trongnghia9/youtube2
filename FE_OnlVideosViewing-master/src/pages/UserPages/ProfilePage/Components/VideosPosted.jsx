import React, { useContext, useEffect, useState } from "react";
import { NavLink, useOutletContext } from "react-router-dom";
import { Popover } from "antd";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { MoreOutlined } from "@ant-design/icons";
import { ThemeContext } from "../../../../services/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosOfUser } from "../../../../redux/reducers/videoReducer";

const VideosPosted = () => {

    const { userInfo, formatNumber, formatTimeAgo, formatVideoDuration } = useOutletContext();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const userId = userInfo?.channel?._id;

    const dispatch = useDispatch();

    const { allVideos, loading, error } = useSelector((state) => state.video);

    useEffect(() => {
        dispatch(getAllVideosOfUser(userId));
    }, [dispatch, userId]);

    // console.log(allVideos);

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
            <div className={`rounded-2xl p-2 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 computerScreen:grid-cols-6 gap-4">
                    {allVideos.map((video) => (
                        <div key={video._id} className="">
                            <div className={`w-full rounded-2xl hover:shadow duration-200 ease-in overflow-hidden theme-card-first`}>
                                <div className="relative">
                                    <NavLink key={video._id} to={`/video-viewing/${video._id}`}>
                                        <div className="relative">
                                            <img src={video.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover" />
                                            <p className="absolute top-1/16 right-1/16 rounded-full px-2 py-1 text-xs theme-card-first">{formatVideoDuration(video.duration)}</p>
                                        </div>
                                    </NavLink>
                                    <div className="absolute -bottom-6 right-1/4 w-12 h-12">
                                        <div>
                                            <img src={userInfo?.channel?.avatarChannel} alt="Avatar" className="avatar" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div>
                                        <p className="text-sm font-medium ml-0.25 inline-block">{userInfo?.channel?.nameChannel}</p>
                                    </div>
                                    <NavLink key={video._id} to={`/video-viewing/${video._id}`}>
                                        <p className="font-semibold text-lg line-clamp-2">{video.title}</p>
                                    </NavLink>
                                    <div className="flex items-baseline justify-between mt-1.5">
                                        <div className="flex items-center text-sm ml-0.25">
                                            <p className="font-medium">{formatNumber(video.views)} <span className="font-normal text-xs">views</span></p>
                                            <span className="mx-2">•</span>
                                            <p className="font-medium">{formatTimeAgo(video.createdAt)}</p>
                                        </div>
                                        <Popover
                                            content={
                                                <div className="flex flex-col gap-1">
                                                    <button className="btn-event__4 gap-0.5"><IoBookmarkOutline className="icon-setting" /> Save</button>
                                                    <button className="btn-event__4 gap-0.5"><MdOutlinePlaylistAdd className="icon-setting" /> Add Playlist</button>
                                                </div>
                                            }
                                            trigger="click"
                                            open={openMoreOptions === video._id}
                                            onOpenChange={(newOpen) => handleOpenMoreOptionsChange(video._id, newOpen)}
                                        >
                                            <button type="primary" className="btn-event__1 px-1 py-0 rounded-full"><MoreOutlined className="" /></button>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VideosPosted;