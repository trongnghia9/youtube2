import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { getViewHistoryByUserId } from "../../../../redux/reducers/viewHistoryReducer";
import PopoverPlaylist from "../../../../components/UserPages/PopoverPlaylist";

const ViewHistory = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { theme, userInfo, isLoggedIn, formatNumber, formatTimeAgo, formatVideoDuration } = useOutletContext();

    const userId = userInfo?.channel?._id;

    const { viewHistory, total, page, limit, loading, error } = useSelector((state) => state.viewHistory);

    useEffect(() => {
        dispatch(getViewHistoryByUserId({ userId, page: 1, limit: 5 }));
    }, [dispatch, userId]);

    const [openMoreOptions, setOpenMoreOptions] = useState(null);

    const handleOpenMoreOptionsChange = (_id, newOpen) => {
        setOpenMoreOptions(newOpen ? _id : null);
    };

    return (
        <div className="py-4 px-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {viewHistory.map((video) => {
                    const videoInfo = video.videoId;
                    return (
                        <div key={videoInfo._id} className={`w-full rounded-2xl hover:shadow duration-200 ease-in overflow-hidden theme-card-first`}>
                            <div className="relative">
                                <NavLink to={`/video-viewing/${videoInfo._id}`}>
                                    <div className="relative">
                                        <img src={videoInfo.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover" />
                                        <p className="absolute top-1/16 right-1/16 rounded-full px-2 py-1 text-xs theme-card-first">{formatVideoDuration(Number(videoInfo.duration))}</p>
                                    </div>
                                </NavLink>
                                <div className="absolute -bottom-6 right-1/4 w-12 h-12">
                                    <NavLink to={`/${videoInfo.uploader.nameChannel}`}>
                                        <img src={videoInfo.uploader.avatarChannel?.trim() || avatarDefault} alt="Avatar" className="avatar" />
                                    </NavLink>
                                </div>
                            </div>
                            <div className="p-4">
                                <NavLink to={`/${videoInfo.uploader.nameChannel}`}>
                                    <p className="text-sm font-medium ml-0.25 inline-block">{videoInfo.uploader.nameChannel}</p>
                                </NavLink>
                                <NavLink to={`/video-viewing/${videoInfo._id}`}>
                                    <p className="font-semibold text-lg line-clamp-2">{videoInfo.title}</p>
                                </NavLink>
                                <div className="flex items-baseline justify-between mt-1.5">
                                    <div className="flex items-center text-sm ml-0.25">
                                        <p className="font-medium">{formatNumber(videoInfo.views)} <span className="font-normal text-xs">views</span></p>
                                        <span className="mx-2">•</span>
                                        <p className="font-medium"><span className="font-normal text-xs">Last view:</span> {formatTimeAgo(video.lastViewedAt)}</p>
                                    </div>

                                    <div className="">
                                        {isLoggedIn && (
                                            <PopoverPlaylist
                                                theme={theme}
                                                videoId={videoInfo._id}
                                                userId={userId}
                                                openId={openMoreOptions}
                                                onOpenChange={handleOpenMoreOptionsChange}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ViewHistory;