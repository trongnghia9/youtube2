import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { clearChannelInfo, getChannelByName, subscribeChannel, unsubscribeChannel } from "../../redux/reducers/channelReducer";
import { formatNumber } from "../../utils/formatNumber";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { formatVideoDuration } from "../../utils/formatVideoDuration";
import { SocketContext } from "../../services/SocketContext";
import axios from "axios";
import { ThemeContext } from "../../services/ThemeContext";

const baseURL = import.meta.env.VITE_BACKEND_BASEURL;

const ChannelInfo = () => {

    const { theme } = useContext(ThemeContext);
    const { socket, isConnected, isLoggedIn, userInfo } = useContext(SocketContext);

    // console.log("userInfo", userInfo);

    const userId = userInfo?.channel?._id;

    // console.log("userId", userId);

    const { nameChannel } = useParams();
    const location = useLocation();

    const dispatch = useDispatch();
    const { channelInfo, loading, error } = useSelector((state) => state.channel);

    // console.log(channelInfo);

    const channelId = channelInfo?._id;

    const listSubscribes = channelInfo?.subscribers;

    // console.log("channelId", channelId);

    // console.log("listSubscribes", listSubscribes);

    useEffect(() => {
        dispatch(clearChannelInfo());
        if (nameChannel) {
            dispatch(getChannelByName(nameChannel));
        }
    }, [dispatch, nameChannel]);

    const [isSubscribedState, setIsSubscribedState] = useState(listSubscribes?.includes(userId));

    const [subscribersCount, setSubscribersCount] = useState(channelInfo?.subscribersCount || 0);

    const handleSubscribe = async () => {
        // try {
        //     let response;

        //     if (isSubscribedState) {
        //         response = await axios.delete(`${baseURL}/channel/unsubscribe/${channelId}`, { data: { userId } });

        //         setIsSubscribedState(false);

        //         if (socket) {
        //             socket.emit("unsubscribe-channel", { channelId, userId });
        //             setSubscribersCount(prev => prev - 1);
        //             console.log(`Left room channel successfully ${channelId}`);
        //         }
        //     } else {
        //         response = await axios.post(`${baseURL}/channel/subscribe/${channelId}`, { userId });

        //         setIsSubscribedState(true);

        //         if (socket) {
        //             socket.emit("subscribe-channel", { channelId, userId });
        //             setSubscribersCount(prev => prev + 1);
        //             console.log(`Joined room channel successfully ${channelId}`);
        //         }
        //     }
        // } catch (error) {
        //     console.error("Subscribe/Unsubscribe failed:", error);
        // }

        if (!channelId || !userId) return;

        try {
            if (isSubscribedState) {
                await dispatch(unsubscribeChannel({ channelId, userId, socket }));
                setIsSubscribedState(false);
                setSubscribersCount(prev => prev - 1);
                console.log(`Left room channel successfully ${channelId}`);
            } else {
                await dispatch(subscribeChannel({ channelId, userId, socket }));
                setIsSubscribedState(true);
                setSubscribersCount(prev => prev + 1);
                console.log(`Joined room channel successfully ${channelId}`);
            }
        } catch (error) {
            console.error("Subscribe/Unsubscribe failed:", error);
        }
    };

    useEffect(() => {
        setIsSubscribedState(channelInfo?.subscribers?.includes(userId));
    }, [channelInfo, userId]);

    useEffect(() => {
        setSubscribersCount(channelInfo?.subscribersCount || 0);
    }, [channelInfo]);

    const MenuChannel = [
        { title: "Home", path: `/${channelInfo?.nameChannel}` },
        { title: "Videos", path: `/${channelInfo?.nameChannel}/videos` },
        { title: "Shorts", path: `/${channelInfo?.nameChannel}/shorts` },
        { title: "Blogs", path: `/${channelInfo?.nameChannel}/blogs` },
        { title: "Playlist", path: `/${channelInfo?.nameChannel}/playlists` },
    ]

    const isEditOrDetailPage = /\/(blog-detail)/.test(location.pathname);

    if (loading || !channelInfo) {
        return <div className="text-center py-10">Loading channel info...</div>;
    }

    return (
        <>
            <div className="mb-4">
                <div className="relative">
                    <div className="cover-photo max-w-7xl mx-auto overflow-hidden rounded-b-2xl">
                        <img src={channelInfo?.bannerChannel} alt="thumbnail" className="w-full h-64 object-cover hover:scale-105 duration-300 ease-in-out" />
                    </div>
                    <div className="absolute top-4/5 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-11/12 sm:w-3/4 mx-auto mb-4">
                        <div className="flex items-start gap-4 xl:gap-0">
                            <div className="avatar-channel w-1/4 2xl:w-1/6 flex justify-center">
                                <img src={channelInfo?.avatarChannel} alt="avatar" className="avatar size-20 xl:size-36" />
                            </div>
                            <div className="info w-3/4 2xl:w-5/6 2xl:ml-6">
                                <div className="flex flex-col w-5/6 gap-y-1 theme-card-second p-2.5 lg:p-4 border-1.5 rounded-2xl">
                                    <h1 className="font-semibold text-xl xl:text-2xl 2xl:text-3xl">{channelInfo?.nameChannel}</h1>
                                    <div className="ml-0.5 pr-10">
                                        <p className="text-xs lg:text-sm"><span>{formatNumber(subscribersCount)}</span> subscribers</p>
                                        <p className="text-xs line-clamp-1 lg:line-clamp-2 ml-0.5 my-1">{channelInfo?.description}</p>
                                    </div>
                                    <div className="button-action ml-0.25 flex items-center gap-2">
                                        <button className="btn-event__1 font-medium px-2 py-1.5 rounded-lg" onClick={handleSubscribe}>
                                            {isSubscribedState ? "Hủy đăng kí" : "Đăng kí"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!isEditOrDetailPage && (
                    <div className="w-11/12 sm:w-3/4 mx-auto mt-40">
                        <header className="sm:mx-4">
                            <div className="flex items-center justify-between md:w-4/5 lg:w-2/3 xl:w-1/2 gap-1">
                                {MenuChannel.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <div className="w-1/5" key={index}>
                                            <NavLink
                                                to={item.path}
                                                className={`flex items-center justify-center gap-x-4 h-10 px-2.5 rounded-t-lg text-base ${isActive ? "theme-third" : "theme-text-first"} hover:bg-thirdColor hover:text-fifthColor transition-all duration-300 ease-in-out`}
                                            >
                                                <span className="text-sm font-medium truncate">{item.title}</span>
                                            </NavLink>
                                        </div>
                                    );
                                })}
                            </div>
                        </header>
                    </div>
                )}
                <div className={`mx-2 md:w-11/12 md:mx-auto lg:w-11.75/12 theme-card-second rounded-2xl ${!isEditOrDetailPage ? "" : "mt-40 duration-600 ease-in-out"}`}>
                    <Outlet context={{ theme, channelInfo, formatNumber, formatTimeAgo, formatVideoDuration }} />
                </div>
            </div>
        </>
    )
}

export default ChannelInfo;