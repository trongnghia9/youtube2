import React, { useEffect, useRef, useState } from "react";
import { IoMdPause, IoMdPlay, IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { RiFullscreenExitFill, RiFullscreenFill, RiResetLeftFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { combineFullVideo, updateVideoView } from "../../../redux/reducers/videoReducer";
import { getPlaylistInfo } from "../../../redux/reducers/playlistReducer";
import { useNavigate } from "react-router-dom";
import LikeButton from "../../../components/social/LikeButton";
import CommentSection from "../../../components/social/CommentSection";
import PlaylistManager from "../../../components/social/PlaylistManager";

const baseURL = import.meta.env.VITE_BACKEND_BASEURL;

const VideoViewingPage = ({ videoId, userId, videoInfo, playlistId, loopMode }) => {

    // console.log(videoInfo.duration);

    // console.log(playlistId);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentPlaylist } = useSelector((state) => state.playlist);

    // console.log(currentPlaylist);

    useEffect(() => {
        if (playlistId) {
            dispatch(getPlaylistInfo(playlistId));
        }
    }, [playlistId, dispatch]);

    const validVideos = currentPlaylist?.videos?.filter(item => item?.video?._id);
    const isLastVideoInPlaylist =
        playlistId &&
        validVideos?.length > 0 &&
        validVideos[validVideos.length - 1].video._id === videoId;

    const shouldShowReplay = !playlistId || isLastVideoInPlaylist;

    const [initialVideoUrl, setInitialVideoUrl] = useState(null);
    const [finalVideoUrl, setFinalVideoUrl] = useState(null);

    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [previousVolume, setPreviousVolume] = useState(volume);

    const videoContainerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [playbackRate, setPlaybackRate] = useState(1);

    const [isEnded, setIsEnded] = useState(false);

    const [isSingleUrl, setIsSingleUrl] = useState(false);
    const chunkVideoRef = useRef(null);
    const finalVideoRef = useRef(null);
    const hasIncrementedView = useRef(false);

    useEffect(() => {
        setDuration(videoInfo.duration);
        setThumbnailUrl(videoInfo.thumbnail);

        if (videoInfo.url.length === 1) {
            setIsSingleUrl(true);
            setInitialVideoUrl(videoInfo.url[0]);
            setFinalVideoUrl(null);
        } else {
            setIsSingleUrl(false);
            setInitialVideoUrl(videoInfo.url[0]);
            dispatch(combineFullVideo(videoId))
                .unwrap()
                .then(({ folderName, fileName }) => {
                    const streamUrl = `${baseURL}/video/stream-video?folderName=${folderName}&fileName=${fileName}`;
                    setFinalVideoUrl(streamUrl);
                })
                .catch((err) => console.error('Lỗi khi ghép video:', err));
        }
    }, [videoId]);

    useEffect(() => {
        const chunkVideo = chunkVideoRef.current;
        const finalVideo = finalVideoRef.current;

        if (finalVideoUrl && chunkVideo && finalVideo) {
            finalVideo.currentTime = chunkVideo.currentTime;
            chunkVideo.pause();
            chunkVideo.muted = true;
            // finalVideo.muted = isMuted;
            finalVideo.play();
            setIsPlaying(true);
        }
    }, [finalVideoUrl]);

    // Đồng bộ thời gian phát
    useEffect(() => {
        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (!currentVideo) return;

        const updateTime = () => setCurrentTime(currentVideo.currentTime);
        const updateDuration = () => {
            if (!duration) setDuration(currentVideo.duration);
        };

        const handleEnded = () => {
            setIsEnded(true);
            setIsPlaying(false);

            const isLoopingLocal = loopMode === "loop-all";
            const isLoopOne = loopMode === "loop-one";

            if (isLoopOne) {
                handleReplay();
                return;
            }

            if (playlistId && currentPlaylist?.videos?.length > 0) {
                const currentIndex = validVideos.findIndex(item => item.video._id === videoId);
                const nextItem = validVideos[currentIndex + 1];

                if (nextItem) {
                    navigate(`/video-viewing/${nextItem.video._id}?playlistId=${playlistId}`);
                } else if (isLoopingLocal) {
                    const firstItem = currentPlaylist.videos[0];
                    if (firstItem) {
                        navigate(`/video-viewing/${firstItem.video._id}?playlistId=${playlistId}`);
                    }
                }
            }
        };

        currentVideo.addEventListener('timeupdate', updateTime);
        currentVideo.addEventListener('loadedmetadata', updateDuration);
        currentVideo.addEventListener('ended', handleEnded);

        // Thiết lập volume ban đầu
        currentVideo.volume = volume;
        currentVideo.muted = isMuted;

        return () => {
            currentVideo.removeEventListener('timeupdate', updateTime);
            currentVideo.removeEventListener('loadedmetadata', updateDuration);
            currentVideo.removeEventListener('ended', handleEnded);
        };
    }, [finalVideoUrl, duration, volume, isMuted, videoId, loopMode, playlistId, currentPlaylist]);

    useEffect(() => {
        if (!userId) return;

        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (!currentVideo || !duration) return;

        const lastWatchedKey = `watchedTime_${videoId}_${userId}`;
        let watchedTime = parseFloat(localStorage.getItem(lastWatchedKey)) || 0;

        let stopTracking = false; // ✅ flag để dừng theo dõi trong session hiện tại

        const interval = setInterval(() => {
            if (stopTracking || currentVideo.paused || currentVideo.ended) return;

            watchedTime += 1;
            localStorage.setItem(lastWatchedKey, watchedTime.toString());

            const percentageWatched = (watchedTime / duration) * 100;

            if (percentageWatched >= 10 && !hasIncrementedView.current) {
                hasIncrementedView.current = true;

                dispatch(updateVideoView({
                    videoId,
                    userId
                }))
                    .unwrap()
                    .then((res) => {
                        console.log('View updated:', res);
                        localStorage.removeItem(lastWatchedKey);
                        stopTracking = true;
                    })
                    .catch((err) => {
                        console.error('Lỗi khi cập nhật view:', err);
                    });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [videoId, finalVideoUrl, duration, userId, dispatch]);

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);

        if (!isSingleUrl && !finalVideoUrl && newTime > 30) {
            return; // Không cho tua quá 30s
        }

        setCurrentTime(newTime);

        if (chunkVideoRef.current) chunkVideoRef.current.currentTime = newTime;
        if (finalVideoRef.current) finalVideoRef.current.currentTime = newTime;
    };

    const handlePlayPause = () => {
        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (!currentVideo) return;

        if (currentVideo.paused) {
            currentVideo.play();
            setIsPlaying(true);

            // Chỉ thực hiện 1 lần khi bắt đầu phát
            if (!hasStarted) setHasStarted(true);
        } else {
            currentVideo.pause();
            setIsPlaying(false);
        }
    };

    const handleMuteToggle = () => {
        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (!currentVideo) return;

        if (isMuted) {
            // Đang unmute → bật lại
            const newVolume = previousVolume || 0.1;
            setVolume(newVolume);
            currentVideo.volume = newVolume;
            currentVideo.muted = false;
            setIsMuted(false);
        } else {
            // Đang có âm → mute về 0
            setPreviousVolume(volume); // lưu lại trước khi set 0
            setVolume(0);
            currentVideo.volume = 0;
            currentVideo.muted = true;
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);

        if (newVolume > 0) {
            setPreviousVolume(newVolume); // lưu lại nếu người dùng thay đổi volume từ > 0
            setIsMuted(false);
        } else {
            setIsMuted(true);
        }

        setVolume(newVolume);

        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (currentVideo) {
            currentVideo.volume = newVolume;
            currentVideo.muted = newVolume === 0;
        }
    };

    const handleSpeedChange = (rate) => {
        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (currentVideo) {
            currentVideo.playbackRate = rate;
            setPlaybackRate(rate);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleFullscreenToggle = () => {
        const container = videoContainerRef.current;

        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    const handleReplay = () => {
        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.play();
            setIsEnded(false);
            setIsPlaying(true);
        }
    };

    const formatTime = (sec) => {
        const min = Math.floor(sec / 60).toString().padStart(2, '0');
        const secStr = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${min}:${secStr}`;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4">
            <div className="lg:w-2/3">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {/* Video player */}
                    <video
                        ref={chunkVideoRef}
                        src={initialVideoUrl}
                        poster={thumbnailUrl}
                        className="w-full h-full"
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    <video
                        ref={finalVideoRef}
                        src={finalVideoUrl}
                        className="w-full h-full hidden"
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />

                    {/* Video controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        {/* Progress bar */}
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4">
                                <button onClick={handlePlayPause}>
                                    {isPlaying ? <IoMdPause size={24} /> : <IoMdPlay size={24} />}
                                </button>
                                <button onClick={handleMuteToggle}>
                                    {isMuted ? <IoMdVolumeOff size={24} /> : <IoMdVolumeHigh size={24} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-white">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <select
                                    value={playbackRate}
                                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                                    className="bg-transparent text-white"
                                >
                                    <option value="0.5">0.5x</option>
                                    <option value="1">1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                                <button onClick={handleFullscreenToggle}>
                                    {isFullscreen ? <RiFullscreenExitFill size={24} /> : <RiFullscreenFill size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video info and social features */}
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{videoInfo.title}</h1>
                        <LikeButton videoId={videoId} />
                    </div>
                    <p className="text-gray-600">{videoInfo.description}</p>
                    <div className="flex items-center space-x-4">
                        <img
                            src={videoInfo.uploader.avatar}
                            alt={videoInfo.uploader.username}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <h3 className="font-semibold">{videoInfo.uploader.username}</h3>
                            <p className="text-sm text-gray-500">{videoInfo.views} views</p>
                        </div>
                    </div>
                </div>

                {/* Comments section */}
                <div className="mt-8">
                    <CommentSection videoId={videoId} />
                </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:w-1/3">
                <PlaylistManager videoId={videoId} />
            </div>
        </div>
    );
};

export default VideoViewingPage;