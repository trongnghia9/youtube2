import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useOutletContext } from "react-router-dom";
import { getPlaylistByChannelId } from "../../../redux/reducers/playlistReducer";

const PlayList = () => {

    const { channelInfo, formatNumber, formatTimeAgo, formatVideoDuration } = useOutletContext();

    const dispatch = useDispatch();
    const { playlists, loading, error } = useSelector((state) => state.playlist);

    // console.log("playlists", playlists);

    useEffect(() => {
        dispatch(getPlaylistByChannelId(channelInfo._id));
    }, [dispatch, channelInfo._id]);

    const newestVideos = useMemo(() => {
        const allVideos = [];

        playlists?.forEach((playlist) => {
            playlist.videos.forEach((videoObj) => {
                allVideos.push({
                    ...videoObj.video,
                    addedAt: videoObj.addedAt,
                    playlistTitle: playlist.titlePlaylist
                });
            });
        });

        return allVideos
            .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
            .slice(0, 5);
    }, [playlists]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="px-2 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.map((playlist) => {
                const firstVideoId = playlist.videos?.[0]?.video?._id;

                return (
                    <div key={playlist._id + Math.random()} className="w-5/6 h-48 mx-auto mb-4 relative flex items-center justify-center">
                        {newestVideos
                            .filter((video) => video.playlistTitle === playlist.titlePlaylist)
                            .map((video, index) => (
                                <div key={video._id + index} className={`absolute transform`} style={{ zIndex: 40 - index * 10, left: `${index * 0.25}rem`, transform: `translateY(${-2.5 + index * 0.25}rem)` }}>
                                    <div className="relative w-44 h-28 bg-gray-200 border border-gray-300 rounded-t-lg shadow-2xl overflow-hidden">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-1.5 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs font-bold text-white line-clamp-1">
                                            {video.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        <div className="w-full h-20 absolute z-50 text-left p-2 theme-header-third bottom-0 shadow-md rounded-b-lg">
                            <h2 className="font-medium line-clamp-1">
                                {playlist.titlePlaylist}
                            </h2>
                            <p className="text-sm line-clamp-1">
                                {playlist.description}
                            </p>
                            <div className="flex items-center text-xs mt-1">
                                <span>{formatTimeAgo(playlist.updatedAt)}</span>
                                <span className="mx-2">•</span>
                                <NavLink className="italic hover:underline" to={`/video-viewing/${firstVideoId}?playlistId=${playlist._id}`}>
                                    See playlist
                                </NavLink>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PlayList;