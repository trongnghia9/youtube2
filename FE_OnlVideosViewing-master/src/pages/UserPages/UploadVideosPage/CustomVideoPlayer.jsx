import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoMdPause, IoMdPlay, IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';
import { RiFullscreenExitFill, RiFullscreenFill, RiResetLeftFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoInfo, combineFullVideo, updateVideoView } from '../../../redux/reducers/videoReducer';
import { isVideoOffline, getOfflineVideo } from '../../../services/offlineStorage';
import { message } from 'antd';

const baseURL = import.meta.env.VITE_BACKEND_BASEURL;

const CustomVideoPlayer = () => {
    const { videoId } = useParams();
    const dispatch = useDispatch();

    const { videoInfo, videoUrls, loading } = useSelector((state) => state.video);
    const { isLoggedIn, userInfo } = useSelector((state) => state.auth.userLogin);
    const channelId = userInfo?.channel?._id;

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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isEnded, setIsEnded] = useState(false);
    const [isSingleUrl, setIsSingleUrl] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [offlineVideoUrl, setOfflineVideoUrl] = useState(null);

    const videoContainerRef = useRef(null);
    const chunkVideoRef = useRef(null);
    const finalVideoRef = useRef(null);
    const hasFetched = useRef(false);
    const hasIncrementedView = useRef(false);

    useEffect(() => {
        checkOfflineStatus();
    }, [videoId]);

    const checkOfflineStatus = async () => {
        try {
            const offline = await isVideoOffline(videoId);
            setIsOffline(offline);
            
            if (offline) {
                const offlineVideo = await getOfflineVideo(videoId);
                if (offlineVideo) {
                    const url = URL.createObjectURL(offlineVideo.videoBlob);
                    setOfflineVideoUrl(url);
                    setDuration(offlineVideo.metadata.duration);
                    setThumbnailUrl(offlineVideo.metadata.thumbnail);
                    setIsSingleUrl(true);
                }
            } else {
                loadOnlineVideo();
            }
        } catch (error) {
            console.error('Error checking offline status:', error);
            loadOnlineVideo();
        }
    };

    const loadOnlineVideo = () => {
        if (videoId && !hasFetched.current) {
            hasFetched.current = true;
            dispatch(fetchVideoInfo(videoId))
                .unwrap()
                .then((data) => {
                    setDuration(data.duration);
                    setThumbnailUrl(data.thumbnail);

                    if (data.url.length === 1) {
                        setIsSingleUrl(true);
                        setInitialVideoUrl(data.url[0]);
                        setFinalVideoUrl(null);
                    } else {
                        setIsSingleUrl(false);
                        setInitialVideoUrl(data.url[0]);
                        dispatch(combineFullVideo(videoId))
                            .unwrap()
                            .then(({ folderName, fileName }) => {
                                const streamUrl = `${baseURL}/video/stream-video?folderName=${folderName}&fileName=${fileName}`;
                                setFinalVideoUrl(streamUrl);
                            })
                            .catch((err) => {
                                console.error('Error combining video:', err);
                                message.error('Failed to load video');
                            });
                    }
                })
                .catch((err) => {
                    console.error('Error loading video:', err);
                    message.error('Failed to load video');
                });
        }
    };

    // Khi finalVideoUrl có, chuyển currentTime và ẩn video chunk
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
    }, [finalVideoUrl, duration, volume, isMuted]);
    
    useEffect(() => {
        const currentVideo = finalVideoUrl ? finalVideoRef.current : chunkVideoRef.current;
        if (!currentVideo || !duration) return;
    
        const lastWatchedKey = `watchedTime_${videoId}_${channelId}`;
        let watchedTime = parseFloat(localStorage.getItem(lastWatchedKey)) || 0;
    
        let stopTracking = false; // ✅ flag để dừng theo dõi trong session hiện tại
    
        const interval = setInterval(() => {
            if (stopTracking || currentVideo.paused || currentVideo.ended) return;
    
            watchedTime += 1;
            localStorage.setItem(lastWatchedKey, watchedTime.toString());
    
            const percentageWatched = (watchedTime / duration) * 100;
    
            if (percentageWatched >= 10 && !hasIncrementedView.current) {
                hasIncrementedView.current = true;

                // axios.post(`${baseURL}/video/update-view`, {
                //     videoId: videoId,
                //     channelId: channelId
                // })
                // .then((response) => {
                //     console.log(response.data.message);
                //     localStorage.removeItem(lastWatchedKey);
                // })
                // .catch((error) => {
                //     console.error('Lỗi khi cập nhật view:', error);
                // });
    
                dispatch(updateVideoView({
                    videoId,
                    channelId
                }))
                .unwrap()
                .then((res) => {
                    console.log('View updated:', res);
                    localStorage.removeItem(lastWatchedKey);
                    stopTracking = true; // ✅ Ngừng theo dõi trong session hiện tại
                })
                .catch((err) => {
                    console.error('Lỗi khi cập nhật view:', err);
                });
            }
        }, 1000);
    
        return () => clearInterval(interval);
    }, [videoId, finalVideoUrl, duration, channelId, dispatch]);      

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

    useEffect(() => {
        return () => {
            if (offlineVideoUrl) {
                URL.revokeObjectURL(offlineVideoUrl);
            }
        };
    }, [offlineVideoUrl]);

    return (
        <div className="relative w-full" ref={videoContainerRef}>
            {isOffline ? (
                <video
                    ref={chunkVideoRef}
                    className="w-full"
                    src={offlineVideoUrl}
                    poster={thumbnailUrl}
                    controls={false}
                    onEnded={() => setIsEnded(true)}
                />
            ) : (
                <>
                    <video
                        ref={chunkVideoRef}
                        className={`w-full ${finalVideoUrl ? 'hidden' : ''}`}
                        src={initialVideoUrl}
                        poster={thumbnailUrl}
                        controls={false}
                        onEnded={() => setIsEnded(true)}
                    />
                    {finalVideoUrl && (
                        <video
                            ref={finalVideoRef}
                            className="w-full"
                            src={finalVideoUrl}
                            controls={false}
                            onEnded={() => setIsEnded(true)}
                        />
                    )}
                </>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-[#0f0f0f75] bg-opacity-80 backdrop-blur-sm transition-all duration-300 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 z-30">
                <div className="relative w-full h-1 rounded bg-gray-300">
                    <input
                        type="range"
                        className="absolute w-full accent-red-600 h-1 z-10 cursor-pointer"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                    />
                    {!isSingleUrl && !finalVideoUrl && (
                        <div
                            className="absolute top-0 h-1 z-20 bg-yellow-400 opacity-50 pointer-events-none rounded"
                            style={{
                                left: `${(30 / duration) * 100}%`,
                                right: 0,
                            }}
                        />
                    )}
                </div>

                <div className="flex justify-between items-center text-white mt-3">
                    <div className="flex gap-4 items-center">
                        {!isEnded ? (
                            <button onClick={handlePlayPause} className="text-xl hover:text-red-500 transition">
                                {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                            </button>
                        ) : (
                            <button onClick={handleReplay} className="text-xl hover:text-red-500 transition">
                                <RiResetLeftFill />
                            </button>
                        )}
                        <button onClick={handleMuteToggle} className="text-xl hover:text-red-500 transition">
                            {isMuted || volume === 0 ? <IoMdVolumeOff size={22} /> : <IoMdVolumeHigh size={22} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="accent-red-600 h-1 w-24 cursor-pointer"
                        />
                        <span className="text-sm text-gray-400">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex gap-2 items-center">
                        <select
                            value={playbackRate}
                            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                            className="bg-[#1f1f1f] text-sm rounded px-2 py-1 text-white border border-gray-600"
                        >
                            {[0.25, 0.5, 1, 1.25, 1.5, 2].map((rate) => (
                                <option key={rate} value={rate}>{rate}x</option>
                            ))}
                        </select>
                        <button onClick={handleFullscreenToggle} className="text-xl hover:text-red-500 transition">
                            {isFullscreen ? <RiFullscreenExitFill /> : <RiFullscreenFill />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomVideoPlayer;