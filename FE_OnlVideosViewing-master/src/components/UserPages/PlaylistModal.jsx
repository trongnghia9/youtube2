import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseOutline, IoCreate } from "react-icons/io5";
import { MdDoorBack, MdLock, MdPublic } from "react-icons/md";
import { Checkbox } from 'antd';
import Dropdown from "../../components/StudioPage/Dropdown";
import { addVideoToPlaylist, createPlaylist, getPlaylistByUserId, removeVideoFromPlaylist } from "../../redux/reducers/playlistReducer";
import Notification from "../StudioPage/Notification";

const PlaylistModal = ({ theme, isOpen, onClose, videoId, userId }) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(isOpen);
    const [creatingNew, setCreatingNew] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message, description) => {
        setNotification({ type, message, description });
    };

    const { playlists, loading, error } = useSelector((state) => state.playlist);

    // console.log("Playlists:", playlists);

    const [selectedPlaylists, setSelectedPlaylists] = useState([]);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (userId && showModal) {
            dispatch(getPlaylistByUserId(userId));
        }
    }, [userId, showModal, dispatch]);

    useEffect(() => {
        if (videoId && playlists.length > 0) {
            const preSelected = playlists
                .filter(playlist =>
                    playlist.videos?.some(v => v?.video?._id === videoId)
                )
                .map(p => p._id);

            setSelectedPlaylists(preSelected);
        }
    }, [videoId, playlists]);

    const handleClose = () => {
        setShowModal(false);
        onClose?.();
    };

    const onChangeCheckboxPlaylist = (e, playlistId) => {
        e.preventDefault();

        const isChecked = e.target.checked;

        setSelectedPlaylists((prevSelectedPlaylists) => {
            if (isChecked) {
                return [...prevSelectedPlaylists, playlistId];
            } else {
                return prevSelectedPlaylists.filter((id) => id !== playlistId);
            }
        });

        if (isChecked) {
            dispatch(addVideoToPlaylist({ playlistId, videoId }))
                .unwrap()
                .then(() => {
                    showNotification("success", "Added to Playlist", "The video has been added to the playlist.");
                    dispatch(getPlaylistByUserId(userId));
                })
                .catch((err) => {
                    showNotification("error", "Error Adding Video", err.message);
                });
        } else {
            dispatch(removeVideoFromPlaylist({ playlistId, videoId }))
                .unwrap()
                .then(() => {
                    showNotification("success", "Removed from Playlist", "The video has been removed from the playlist.");
                })
                .catch((err) => {
                    showNotification("error", "Error Removing Video", err.message);
                });
        }
    };

    const handleCreatePlaylist = (e) => {
        e.preventDefault();
    
        if (!title || !description || !valueDisplayMode) return;
    
        dispatch(createPlaylist({
            title,
            description,
            isPrivate: valueDisplayMode.value === "Private",
            videoId,
            userId,
        }))
            .unwrap()
            .then((newPlaylist) => {
                dispatch(addVideoToPlaylist({ playlistId: newPlaylist._id, videoId }))
                    .unwrap()
                    .then(() => {
                        showNotification("success", `Created & Added`, `Video added to playlist "${newPlaylist.titlePlaylist}"`);
                        dispatch(getPlaylistByUserId(userId));
                    })
                    .catch((err) => {
                        showNotification("error", "Video not added", err.message);
                    });
    
                setCreatingNew(false);
                setTitle("");
                setDescription("");
                setValueDisplayMode({
                    label: 'Public',
                    value: 'Public',
                    icon: <MdPublic className="size-5 themeText" />
                });                
    
                showNotification("success", `Create playlist ${title} successfully`, "Congratulations on creating a Playlist successfully!!");
            })
            .catch((err) => {
                console.error("Failed to create playlist:", err);
                showNotification("error", "Lỗi khi tạo Playlist", err.message);
            });
    };    

    const optionDisplayMode = [
        {
            icon: <MdPublic className="size-5 themeText" />,
            value: 'Public',
            label: 'Public',
        },
        {
            icon: <MdLock className="size-5 themeText" />,
            value: 'Private',
            label: 'Private',
        }
    ]

    const [valueDisplayMode, setValueDisplayMode] = useState({
        label: 'Public',
        value: 'Public',
        icon: <MdPublic className="size-5 themeText" />
    });

    return (
        <div className="">
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

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    >
                        <motion.div
                            className="theme-first rounded-2xl px-3 py-2.5 max-w-sm text-center shadow-xl w-64 h-80 overflow-y-auto"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center px-0.5 pb-2 mb-2 border-b-1.5">
                                <p className="font-semibold text-md">{creatingNew ? (
                                    <div className="flex items-center space-x-2.5">
                                        <button
                                            onClick={() => setCreatingNew(false)}
                                            className="border theme-border p-1 rounded-full"
                                        >
                                            <MdDoorBack className="text-lg" />
                                        </button>
                                        <span>Create Playlist</span>
                                    </div>
                                ) : "Playlist"}</p>
                                <button onClick={handleClose} className="border theme-border p-1 rounded-full">
                                    <IoCloseOutline className="text-lg" />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {!creatingNew ? (
                                    <motion.div
                                        key="playlistList"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-2"
                                    >
                                        {loading && <p>Loading playlists...</p>}
                                        {error && <p className="text-red-500">Error: {error.message}</p>}
                                        <div className="h-62 flex flex-col justify-between">
                                            {!loading && !error && playlists.length > 0 && (
                                                <ul className="text-left max-h-52 overflow-y-auto content-sidebar pr-1">
                                                    {playlists.map((playlist) => {
                                                        return (
                                                            <li
                                                                key={playlist._id}
                                                                className={`flex items-center justify-between py-1.5 px-2 mb-1 theme-border border-b-1.5 rounded-sm ${selectedPlaylists.includes(playlist._id) ? 'theme-hover' : 'theme-first'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedPlaylists.includes(playlist._id)}
                                                                        onChange={(e) => onChangeCheckboxPlaylist(e, playlist._id)}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <label className="text-xs">{playlist.titlePlaylist}</label>
                                                                </div>
                                                                <div className="w-1/6 flex justify-end">
                                                                    {playlist.isPrivate ? <MdPublic className="size-5 themeText" /> : <MdLock className="size-5 themeText" />}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                            <div className="pt-2.5">
                                                <button className="w-3/4 mx-auto flex items-center justify-center text-sm font-medium py-1.5 rounded-2xl btn-event__4" onClick={() => setCreatingNew(true)}>
                                                    <div className="border rounded-sm theme-border mr-2"><IoCreate className="size-5" /></div>
                                                    <span className="text-sm">Create Playlist</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="createForm"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <div className="h-62">
                                            <form onSubmit={handleCreatePlaylist} action="" className="h-full flex flex-col justify-between">
                                                <div className="flex flex-col space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Title"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        className="w-full border theme-border rounded-md text-sm form-input"
                                                    />
                                                    <textarea
                                                        placeholder="Description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="w-full border theme-border rounded-md text-sm resize-none form-input"
                                                        rows="2"
                                                    />
                                                    <div className="w-2/3">
                                                        <Dropdown
                                                            options={optionDisplayMode}
                                                            selected={valueDisplayMode}
                                                            setSelected={setValueDisplayMode}
                                                            placeholder="Select Option"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-3/4 mx-auto">
                                                    <button onClick={handleCreatePlaylist} className="w-full flex items-center justify-center text-sm font-medium py-1.5 rounded-2xl btn-event__4">Create</button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlaylistModal;