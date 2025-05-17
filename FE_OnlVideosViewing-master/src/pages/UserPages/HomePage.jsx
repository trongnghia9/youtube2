import { MoreOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { NavLink, useOutletContext } from "react-router-dom";
import { ThemeContext } from "../../services/ThemeContext";
import { formatNumber } from "../../utils/formatNumber";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { formatVideoDuration } from "../../utils/formatVideoDuration";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../../redux/reducers/videoReducer";
import PopoverPlaylist from "../../components/UserPages/PopoverPlaylist";

const avatarDefault = "https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png";

const HomePage = () => {

    const { theme, userInfo, isLoggedIn } = useOutletContext();

    // console.log(userInfo);

    const userId = userInfo?.channel?._id;

    // console.log(userId);

    const dispatch = useDispatch();

    const { allVideos, loading, error } = useSelector((state) => state.video);

    // console.log("allVideos", allVideos);

    useEffect(() => {
        dispatch(getAllVideos());
    }, [dispatch]);

    // State lưu videoId của popover đang mở
    const [openMoreOptions, setOpenMoreOptions] = useState(null);

    const handleOpenMoreOptionsChange = (_id, newOpen) => {
        setOpenMoreOptions(newOpen ? _id : null);
    };

    return (
        <div >
            {/* <div className="">
                video:
                - img demo
                - video
                - title
                - description
                - author (avatar, name)
                - category
                - display mode - che do hien thi (public, private, gioi han nguoi xem (chi dang ki moi duoc xem))
                - view
                - time created
                - like / unlike
                - comment (co the comment tuong tac voi nhau)

                <br />
                header - list category
                <br />
                body - list video (3 row)
                <br />
                body - list video short (1 row)
            </div> */}

            <body className="mx-5 my-10">
                <div className="tags-body">
                    {/* {videos.map((video) => (
                        <div className="tag-video" key={video._id}>
                            <p>{video.tags}</p>
                        </div>    
                    ))} */}
                </div>
                <div className={`video-body ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {allVideos.map((video) => (
                            <div key={video._id} className={`w-full rounded-2xl hover:shadow duration-200 ease-in overflow-hidden theme-card-first`}>
                                <div className="relative">
                                    <NavLink to={`video-viewing/${video._id}`}>
                                        <div className="relative">
                                            <img src={video.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover" />
                                            <p className="absolute top-1/16 right-1/16 rounded-full px-2 py-1 text-xs theme-card-first">{formatVideoDuration(Number(video.duration))}</p>
                                        </div>
                                    </NavLink>
                                    <div className="absolute -bottom-6 right-1/4 w-12 h-12">
                                        <NavLink to={`/${video.uploader.nameChannel}`}>
                                            <img src={video.uploader.avatarChannel?.trim() || avatarDefault} alt="Avatar" className="avatar" />
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <NavLink to={`/${video.uploader.nameChannel}`}>
                                        <p className="text-sm font-medium ml-0.25 inline-block">{video.uploader.nameChannel}</p>
                                    </NavLink>
                                    <NavLink to={`video-viewing/${video._id}`}>
                                        <p className="font-semibold text-lg line-clamp-2">{video.title}</p>
                                    </NavLink>
                                    <div className="flex items-baseline justify-between mt-1.5">
                                        <div className="flex items-center text-sm ml-0.25">
                                            <p className="font-medium">{formatNumber(video.views)} <span className="font-normal text-xs">views</span></p>
                                            <span className="mx-2">•</span>
                                            <p className="font-medium">{formatTimeAgo(video.createdAt)}</p>
                                        </div>

                                        <div className="">
                                            {isLoggedIn && (
                                                <PopoverPlaylist
                                                    theme={theme}
                                                    videoId={video._id}
                                                    userId={userId}
                                                    openId={openMoreOptions}
                                                    onOpenChange={handleOpenMoreOptionsChange}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </body>
        </div>
    );
};

export default HomePage;
