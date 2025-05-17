import React, { useState } from "react";
import { Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import PlaylistModal from "./PlaylistModal";

const PopoverPlaylist = ({ theme, videoId, userId, openId, onOpenChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        onOpenChange(videoId, false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Popover
                content={
                    <div className="flex flex-col gap-1">
                        <button className="btn-event__4 gap-0.5">
                            <IoBookmarkOutline className="icon-setting" /> Save
                        </button>
                        <button
                            className="btn-event__4 gap-0.5"
                            onClick={handleOpenModal}
                        >
                            <MdOutlinePlaylistAdd className="icon-setting" /> Add Playlist
                        </button>
                    </div>
                }
                trigger="click"
                open={openId === videoId}
                onOpenChange={(newOpen) => onOpenChange(videoId, newOpen)}
            >
                <button className="btn-event__1 px-1 py-0 rounded-full">
                    <MoreOutlined />
                </button>
            </Popover>

            <PlaylistModal 
                theme={theme}
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                videoId={videoId}
                userId={userId}
            />
        </>
    );
};

export default PopoverPlaylist;