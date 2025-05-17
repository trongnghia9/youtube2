import { Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import { MdLock, MdPublic } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useOutletContext } from "react-router-dom";
import { deletePlaylist, getPlaylistByUserId } from "../../../redux/reducers/playlistReducer";

const PlaylistsManagement = () => {

    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    const userId = userInfo?.channel?._id;

    // console.log(userId);

    const dispatch = useDispatch();

    const { playlists, loading, error } = useSelector((state) => state.playlist);

    useEffect(() => {
        if (userId) {
            dispatch(getPlaylistByUserId(userId));
        }
    }, [userId, dispatch]);

    const [allPlaylists, setAllPlaylists] = useState(playlists);

    // console.log("AllPlaylists:", allPlaylists);

    const alignCenter = {
        onHeaderCell: () => ({
            style: {
                textAlign: 'center',
                fontSize: '12px',
                background: theme === "dark" ? "#1A2D42" : "#D4D8DD",
                color: theme === "dark" ? "#D4D8DD" : "#1A2D42",
            },
        }),
        onCell: () => ({
            style: {
                padding: '8px',
                textAlign: 'center',
                fontSize: '12.5px',
                fontWeight: '500',
                background: theme === "dark" ? "#252525" : "#FFFFFF",
                color: theme === "dark" ? "#EDEDED" : "#252525",
            },
        }),
    };

    const confirmDelete = async (playlistId) => {
        try {
            const result = await dispatch(deletePlaylist(playlistId)).unwrap();

            console.log("📄 Playlist deleted:", result);

            const updatedPlaylists = allPlaylists.filter((playlist) => playlist._id !== playlistId);
            setAllPlaylists(updatedPlaylists);

            showNotification("success", "Deleted Playlist", `The playlist titled "${result.playlistDeleted.titlePlaylist}" has been removed.`);
        } catch (err) {
            showNotification("error", "Failed to delete playlist", err.message);
        }
    };

    const cancelDelete = (e) => {
        showNotification("error", "Cancelled", "The playlist has not been deleted.");
    };

    useEffect(() => {
        setAllPlaylists(Array.isArray(playlists) ? playlists : []);
    }, [playlists]);

    const dataSource = allPlaylists?.map((playlist) => {
        const sortedVideos = [...playlist.videos].sort(
            (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
        );
        const latestVideoThumbnail = sortedVideos.length > 0 ? sortedVideos[0].video.thumbnail : null;

        return {
            key: playlist._id,
            playlistId: playlist._id,
            name: playlist.titlePlaylist,
            description: playlist.description,
            thumbnail: latestVideoThumbnail,
            videoCount: playlist.videos.length,
            displayMode: !playlist.isPrivate,
            dateCreated: new Date(playlist.createdAt).toLocaleDateString(),
            dateUpdated: new Date(playlist.updatedAt).toLocaleDateString(),
            action: playlist._id,
        };
    });

    const columns = [
        {
            title: 'Playlist', width: 200, dataIndex: 'playlist', ...alignCenter, render: (_, record) => {
                return (
                    <div className="flex items-center gap-2.5">
                        <div className="w-1/3 overflow-hidden rounded-md">
                            <img src={record.thumbnail} alt="playlist" className="w-full h-20 object-cover hover:scale-105 duration-300" />
                        </div>
                        <div className="w-2/3 flex flex-col text-start">
                            <p className="line-clamp-1">{record.name}</p>
                            <p className="text-xs font-normal theme-text-first opacity-85 line-clamp-2">{record.description}</p>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Display Mode', width: 100, dataIndex: 'displayMode', key: 'displayMode', ...alignCenter, render: (displayMode) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        {displayMode ? <MdPublic className="size-5 theme-text-first" /> : <MdLock className="size-5 theme-text-first" />}
                        <p className="text-xs">{displayMode ? "Public" : "Private"}</p>
                    </div>
                )
            }
        },
        { title: 'Date posted', width: 100, dataIndex: 'dateCreated', key: 'dateCreated', ...alignCenter },
        { title: 'Date updated', width: 100, dataIndex: 'dateUpdated', key: 'dateUpdated', ...alignCenter },
        { title: 'Video count', width: 100, dataIndex: 'videoCount', key: 'videoCount', ...alignCenter },
        {
            width: 100, ...alignCenter, render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <NavLink to={`/studio/content-management/playlist/${record.playlistId}/edit`} className="btn-1 py-1.5 px-2 text-xs"><AiOutlineEdit className="size-5" /></NavLink>
                        <Popconfirm
                            icon={<></>}
                            title={
                                <div className="flex items-center gap-1.5">
                                    <IoWarningOutline className="size-5 text-yellow-500" />
                                    <p className="text-xs">Delete Playlist</p>
                                </div>
                            }
                            description={
                                <div className="w-11.75/12 mx-auto">
                                    <p className="text-xs">Are you sure you want to delete this playlist?</p>
                                </div>
                            }
                            onConfirm={() => confirmDelete(record.playlistId)}
                            onCancel={cancelDelete}
                            okText="Yes"
                            cancelText="No"
                            overlayClassName="custom-popconfirm"
                        >
                            <button className="btn-1 py-1.5 px-2 text-xs"><AiOutlineDelete className="size-5" /></button>
                        </Popconfirm>
                    </div>
                )
            }
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        columnWidth: 50,
    };

    return (
        <div className={`custom-table ${theme === "dark" ? "dark-theme" : "light-theme"} rounded-md`}>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowClassName={(record) => selectedRowKeys.includes(record.key) ? 'selected-row' : ''}
                className="custom-table border theme-border"
            />
        </div>
    );
};

export default PlaylistsManagement;