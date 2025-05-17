import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import VideoViewingPage from "../pages/UserPages/VideoPage/VideoViewingPage";
import VideosSuggestionPage from "../pages/UserPages/VideoPage/VideosSuggestionPage";
import VideoInfo from "../pages/UserPages/VideoPage/VideoInfo";
import { fetchVideoInfo, setVideoInfo } from "../redux/reducers/videoReducer";
import { SocketContext } from "../services/SocketContext";
import { ThemeContext } from "../services/ThemeContext";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatNumber } from "../utils/formatNumber";
import Notification from "../components/StudioPage/Notification";

const VideoLayout = () => {

    const { theme } = useContext(ThemeContext);
    const { videoId } = useParams();
    const [searchParams] = useSearchParams();
    const playlistId = searchParams.get("playlistId");

    // console.log(playlistId);

    const dispatch = useDispatch();

    const { socket, isConnected, isLoggedIn, userInfo } = useContext(SocketContext);

    const userId = userInfo?.channel?._id;
    const { videoInfo } = useSelector((state) => state.video);

    // console.log(videoInfo);

    const channelId = videoInfo?.uploader?._id;
    const channelName = videoInfo?.uploader?.nameChannel;

    // console.log(channelName);

    useEffect(() => {
        if (videoId) {
            dispatch(setVideoInfo(null));
            dispatch(fetchVideoInfo(videoId));
        }
    }, [dispatch, videoId]);

    const LOOP_STORAGE_KEY = "video-loop-mode";

    const [loopMode, setLoopMode] = useState(() => {
        const saved = localStorage.getItem(LOOP_STORAGE_KEY);
        return saved || "none"; // default to 'none'
    });

    const toggleLoopMode = () => {
        setLoopMode((prev) => {
            if (prev === "none") return "loop-one";
            if (prev === "loop-one") return "loop-all";
            return "none";
        });
    };

    useEffect(() => {
        localStorage.setItem(LOOP_STORAGE_KEY, loopMode);
    }, [loopMode]);

    const [notification, setNotification] = useState(null);

    const showNotification = (type, message, description) => {
        setNotification({ type, message, description });
    };

    return (
        <div className="max-w-8xl mx-auto min-h-screen">
            <div className="m-2 lg:m-2.5 flex flex-col lg:flex-row gap-4">
                <div className="right-page lg:w-3/4">
                    {videoInfo ? (
                        <>
                            <VideoViewingPage
                                videoId={videoId}
                                userId={userId}
                                playlistId={playlistId}
                                videoInfo={videoInfo}
                                isLoggedIn={isLoggedIn}
                                userInfo={userInfo}
                                loopMode={loopMode}
                            />
                            <VideoInfo
                                theme={theme}
                                videoId={videoId}
                                userId={userId}
                                userInfo={userInfo}
                                isLoggedIn={isLoggedIn}
                                videoInfo={videoInfo}
                                socket={socket}
                                isConnected={isConnected}
                                formatNumber={formatNumber}
                                formatTimeAgo={formatTimeAgo}
                                showNotification={showNotification}
                            />
                        </>
                    ) : (
                        <div className="text-center py-10">Đang tải video...</div>
                    )}
                </div>
                <div className="left-page lg:w-1/4">
                    <VideosSuggestionPage
                        theme={theme}
                        videoId={videoId}
                        videoInfo={videoInfo}
                        channelId={channelId}
                        channelName={channelName}
                        playlistId={playlistId}
                        userInfo={userInfo}
                        isLoggedIn={isLoggedIn}
                        formatNumber={formatNumber}
                        formatTimeAgo={formatTimeAgo}
                        loopMode={loopMode}
                        toggleLoopMode={toggleLoopMode}
                    />
                </div>
            </div>

            {notification && (
                <div className="fixed top-1/20 right-1/17 z-50">
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        description={notification.description}
                        duration={3000}
                        onClose={() => setNotification(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoLayout;