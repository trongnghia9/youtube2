import { MoreOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React, { useEffect, useState } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import PlaylistModal from "../UserPages/PlaylistModal";

const PopoverPlaylistViewing = ({ theme, userId, playlistId, videoId, openId, onOpenChange }) => {

    // console.log(videoId);

    const dispatch = useDispatch();
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
                        <button
                            className="btn-event__4 gap-0.5"
                            // onClick={handleOpenModal}
                        >
                            <MdOutlinePlaylistAdd className="icon-setting" /> Remove from playlist
                        </button>
                    </div>
                }
                trigger="click"
                open={openId === videoId}
                onOpenChange={(newOpen) => onOpenChange(videoId, newOpen)}
            >
                <button className="">
                    <MoreOutlined className="" />
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

export default PopoverPlaylistViewing;