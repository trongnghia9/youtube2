import React, { useEffect, useState } from "react";
import { BsBan, BsRepeat, BsRepeat1 } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";
import { MdLock, MdPublic } from "react-icons/md";
import PopoverPlaylistViewing from "../../../../components/VideoPages/PopoverPlaylistViewing";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylistInfo } from "../../../../redux/reducers/playlistReducer";
import { NavLink } from "react-router-dom";

const PlaylistVideo = ({ theme, playlistId, videoId, userInfo, formatTimeAgo, loopMode, toggleLoopMode }) => {

    // console.log(loopMode);

    const dispatch = useDispatch();

    const { currentPlaylist } = useSelector((state) => state.playlist);

    // console.log(currentPlaylist);

    useEffect(() => {
        if (playlistId) {
            dispatch(getPlaylistInfo(playlistId));
        }
    }, [playlistId, dispatch]);

    // console.log(userInfo);

    const userId = userInfo?.channel?._id;

    // State lưu videoId của popover đang mở
    const [openMoreOptions, setOpenMoreOptions] = useState(null);

    const handleOpenMoreOptionsChange = (_id, newOpen) => {
        setOpenMoreOptions(newOpen ? _id : null);
    };

    return (
        <div className="mt-2 theme-first rounded-xl py-2">
            <div className="header-playlist px-2.5">
                <div className="header-top flex items-center justify-between border-b-1.5 theme-border pb-2">
                    <div className="">
                        <p className="font-semibold text-lg">{currentPlaylist?.titlePlaylist}</p>
                    </div>
                    <div className="">
                        {currentPlaylist?.isPrivate ? <MdLock className="size-5" /> : <MdPublic className="size-5" />}
                    </div>
                </div>
                <div className="header-bottom py-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b-1.5 px-0.5 pb-2">
                        <p className="text-xs line-clamp-2">{currentPlaylist?.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={toggleLoopMode} className={`p-1 rounded-full ${loopMode !== 'none' ? 'btn-1' : 'theme-hover'} border-1.5 theme-border duration-300 ease-in-out flex items-center gap-1`}>
                            {loopMode === 'loop-all' ? <BsRepeat className="text-lg" /> : loopMode === 'loop-one' ? <BsRepeat1 className="text-lg" /> : <BsBan className="text-lg" />}
                        </button>
                        <p className="text-xs">Updated about <span className="font-medium">{formatTimeAgo(currentPlaylist?.updatedAt)}</span></p>
                    </div>
                </div>
            </div>
            <div className="body-playlist theme-header-third rounded-b-lg">
                <div className="flex flex-col border-t-1.5">
                    {currentPlaylist?.videos.map((video, index) => {
                        const videoInfo = video.video;
                        return (
                            <div key={video._id} className={`mt-1 p-1 flex items-center gap-1 ${videoInfo._id === videoId ? "theme-first" : "theme-hover"} duration-300 ease-in-out rounded-md`}>
                                <div className="w-1/12 flex items-center justify-center">
                                    {videoInfo._id === videoId ? (
                                        <FaPlay className="size-4 theme-text-first" />
                                    ) : (
                                        <span className="text-sm font-medium theme-text-first">{index + 1}</span>
                                    )}
                                </div>
                                <NavLink to={`/video-viewing/${videoInfo._id}?playlistId=${playlistId}`} className="w-4/12 overflow-hidden rounded-md">
                                    <img src={videoInfo.thumbnail} alt="playlist" className="h-14 w-full object-cover hover:scale-105 duration-300" />
                                </NavLink>
                                <NavLink to={`/video-viewing/${videoInfo._id}?playlistId=${playlistId}`} className="w-6/12 flex flex-col text-start px-1">
                                    <p className="line-clamp-1 text-sm theme-text-first">{videoInfo.title}</p>
                                    <p className="text-xs font-normal theme-text-first opacity-85 line-clamp-2">{videoInfo.description}</p>
                                </NavLink>
                                <div className="w-1/12 flex items-center justify-center">
                                    <PopoverPlaylistViewing
                                        theme={theme}
                                        userId={userId}
                                        playlistId={playlistId}
                                        videoId={videoInfo._id}
                                        openId={openMoreOptions}
                                        onOpenChange={handleOpenMoreOptionsChange}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

export default PlaylistVideo;