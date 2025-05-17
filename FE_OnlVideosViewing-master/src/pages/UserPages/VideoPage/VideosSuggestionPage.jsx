import React, { useContext } from "react";
import { ThemeContext } from "../../../services/ThemeContext";
import { NavLink } from "react-router-dom";
import { Tabs } from "antd";
import { IoCloseOutline, IoPlayCircleSharp } from "react-icons/io5";
import { MdMoreHoriz, MdMoreVert, MdPublic } from "react-icons/md";
import { FaPlay } from "react-icons/fa6";
import PlaylistVideo from "./VideoSuggestion/PlaylistVideo";
import VideoOfChannel from "./VideoSuggestion/VideoOfChannel";
import ViewHistory from "./VideoSuggestion/ViewingHistory";

const videos = [
    {
        videoId: "1",
        title: "Cách lập trình Node.js cơ bản",
        description: "Hướng dẫn lập trình Node.js cho người mới bắt đầu.",
        url: "https://picsum.photos/id/1/400/300",
        // url: "https://drive.google.com/file/d/14vZDvYzgHyQR56AZBhb-7L3TtW-PQT9E/preview",
        category: "Giáo dục",
        uploadDate: "2025-02-10",
        tags: ["Node.js", "Lập trình", "Back-end"],
        views: 15000,
        rating: 4.8,
        duration: "15:30",
        uploader: "Dev Academy",
        avatarUploader: "https://picsum.photos/id/1/50/50",
        comments: 230,
        likes: 1200,
        dislikes: 15,
        relatedVideos: ["2", "3", "4"],
        playlist: "Lập trình Node.js",
        language: "Tiếng Việt",
        lastUpdated: "2025-02-11",
    },
    ...Array.from({ length: 9 }, (_, i) => ({
        videoId: `${i + 2}`,
        title: `Lorem Ipsum is industry số ${i + 2
            }`,
        description: `Mô tả cho video số ${i + 2}.`,
        url: `https://picsum.photos/id/${i + 2}/400/300`,
        // url: `https://drive.google.com/file/d/15-i8sZlF_rmmmVPzMbwbbrI6uZzuND-_/preview`, 
        category: ["Giáo dục", "Giải trí", "Công nghệ"][i % 3],
        uploadDate: `2025-02-${10 + (i % 20)}`,
        tags: ["Học tập", "Thử thách", "Mẹo hay"],
        views: Math.floor(Math.random() * 50000) + 1000,
        rating: (Math.random() * 2 + 3).toFixed(1),
        duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(
            Math.random() * 60
        )}`,
        uploader: `Uploader ${i + 2}`,
        avatarUploader: `https://picsum.photos/id/${i + 2}/50/50`,
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 10000),
        dislikes: Math.floor(Math.random() * 500),
        relatedVideos: [
            `${((i + 1) % 50) + 1}`,
            `${((i + 2) % 50) + 1}`,
            `${((i + 3) % 50) + 1}`,
        ],
        playlist: `Playlist ${i % 5}`,
        language: ["Tiếng Việt", "English", "Español"][i % 3],
        lastUpdated: `2025-02-${10 + (i % 20)}`,
    })),
];

const imgUrl = 'https://lh3.googleusercontent.com/d/1SrwB7Ob4eULt0hwPQ5CbVjIzxUlQIYwC';

const VideosSuggestionPage = ({ theme, videoId, videoInfo, channelId, channelName, playlistId, userInfo, isLoggedIn, formatNumber, formatTimeAgo, loopMode, toggleLoopMode }) => {

    // console.log("Video info:", videoInfo);

    // console.log(playlistId);

    const tabVideoSuggestion = [
        {
            label: 'Related',
            key: '1',
            children: (
                <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                    <div className="p-0.5">
                        <div className="">
                            {videos.map((video) => (
                                <div key={video.videoId} className="flex mx-1 my-1.5 border-b-0.5 rounded-lg gap-2 p-1 theme-bg-first">
                                    <NavLink to={`/video-viewing/${video.videoId}`} className={`w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/2`}>
                                        <div className="rounded-md overflow-hidden aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:w-full lg:h-full">
                                            <img className="w-full h-auto object-cover hover:scale-105 duration-300" src={video.url} alt={video.title} />
                                        </div>
                                    </NavLink>
                                    <div className="w-2/3 sm:w-3/4 md:w-4/5 lg:w-1/2">
                                        <NavLink to={`/video-viewing/${video.videoId}`}>
                                            <h2 className="text-sm font-semibold themeText">{video.title}</h2>
                                        </NavLink>
                                        <NavLink to={`/${video.uploader}`}>
                                            <p className="text-xs font-normal themeText opacity-90 mb-1">{video.uploader}</p>
                                        </NavLink>
                                        <div className="flex items-center lg:justify-between">
                                            <p className="text-xs themeText flex gap-1">{formatNumber(video.views)} <span className="block lg:hidden xl:block">views</span></p>
                                            <span className="mx-2 lg:hidden">•</span>
                                            <p className="text-xs italic truncate themeText">{video.uploadDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: 'Channel',
            key: '2',
            children: (
                <VideoOfChannel theme={theme} channelId={channelId} channelName={channelName} videoId={videoId} userInfo={userInfo} formatNumber={formatNumber} formatTimeAgo={formatTimeAgo} />
            ),
            // disabled: true,
        },
        playlistId ? {
            label: 'Playlist',
            key: '3',
            children: (
                <PlaylistVideo theme={theme} playlistId={playlistId} videoId={videoId} userInfo={userInfo} formatTimeAgo={formatTimeAgo} loopMode={loopMode} toggleLoopMode={toggleLoopMode}/>
            ),
        } : {
            label: 'History',
            key: '3',
            children: (
                <ViewHistory theme={theme} userInfo={userInfo} formatNumber={formatNumber} formatTimeAgo={formatTimeAgo} />
            ),
        }
    ];

    return (
        <div className="tab-video-suggestion">
            <Tabs
                defaultActiveKey={playlistId ? '3' : '1'}
                items={tabVideoSuggestion}
                className="theme-bg-third rounded-lg theme-border border-1.5"
            />
        </div>
    );
};

export default VideosSuggestionPage;