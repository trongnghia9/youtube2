import { MoreOutlined } from "@ant-design/icons";
import { Popover, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import axios from "axios";
import { subscribeChannel, unsubscribeChannel } from "../../../redux/reducers/channelReducer";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../../components/StudioPage/Dropdown";
import { getCommentsByVideoId, postCommentVideo, replyToCommentInVideo } from "../../../redux/reducers/commentReducer";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import Replies from "../../../components/UserPages/CommentComponent/Replies";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";

const VideoInfo = ({ theme, videoId, userId, userInfo, videoInfo, socket, isConnected, formatNumber, formatTimeAgo, showNotification }) => {

    const dispatch = useDispatch();

    //* Video Info
    const channelId = videoInfo?.uploader?._id;

    const listSubscribes = videoInfo?.uploader?.subscribers;

    // console.log(listSubscribes);

    const [isSubscribedState, setIsSubscribedState] = useState(listSubscribes?.includes(userId));

    const [subscribersCount, setSubscribersCount] = useState(videoInfo?.uploader?.subscribersCount || 0);

    const [openMoreOptions, setOpenMoreOptions] = useState(false);
    const hideMoreOptions = () => {
        setOpenMoreOptions(false);
    };
    const handleOpenMoreOptionsChange = (newOpenMoreOptions) => {
        setOpenMoreOptions(newOpenMoreOptions);
    };

    const handleSubscribe = async () => {
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
        setIsSubscribedState(videoInfo?.uploader?.subscribers?.includes(userId));
    }, [videoInfo, userId]);

    useEffect(() => {
        setSubscribersCount(videoInfo?.uploader?.subscribersCount || 0);
    }, [videoInfo]);

    //* Comments

    const { comments, repliesByParentId, loading, error } = useSelector((state) => state.comment);

    // console.log("comments", comments);

    useEffect(() => {
        dispatch(getCommentsByVideoId(videoId));
    }, [dispatch, videoId]);

    const [allComments, setAllComments] = useState(comments);

    const optionComments = [
        { label: "Newest Comments", value: 'Newest Comments', },
        { label: "Most Liked Comments", value: 'Most Liked Comments', },
        { label: "Most Replied Comments", value: 'Most Replied Comments', },
    ]

    const [isOpenSelect, setIsOpenSelect] = useState(false);
    const [value, setValue] = useState(null);

    const onOptionClicked = (value) => {
        setValue(value);
        setIsOpenSelect(false);
    }

    const [commentText, setCommentText] = useState("");

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            dispatch(postCommentVideo({
                videoId,
                content: commentText.trim(),
                userId,
            })).unwrap();

            showNotification("success", "Comment Successfully!!", "Congratulations you have successfully commented!!!");
            // dispatch(getCommentsByVideoId(videoId));

            setAllComments((prevComments) => [...prevComments, { content: commentText.trim(), userId, videoId }]);

            setCommentText("");
        }
    };

    useEffect(() => {
        setAllComments(Array.isArray(comments) ? comments : []);
    }, [comments]);

    //* Replies

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyText, setReplyText] = useState("");

    const handleOpenReply = (commentId) => {
        setReplyingToCommentId(commentId);
        setShowReplyForm(true);
    };

    const handleCloseReply = (e) => {
        setReplyingToCommentId(null);
        setShowReplyForm(false);
    };

    const [openReplies, setOpenReplies] = useState(null);
    const [replyLoadingId, setReplyLoadingId] = useState(null);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (replyText.trim() && replyingToCommentId) {
            try {
                const parentComment = comments.find(comment => comment._id === replyingToCommentId);
                const nameChannel = parentComment?.postedBy?.nameChannel || "User";

                await dispatch(replyToCommentInVideo({
                    videoId,
                    parentCommentId: replyingToCommentId,
                    content: replyText.trim(),
                    userId,
                }));

                await dispatch(getCommentsByVideoId(videoId));
                setReplyText("");
                setShowReplyForm(false);
                setReplyingToCommentId(null);
                setOpenReplies(replyingToCommentId);
                showNotification("success", "Comment Reply Successfully!!", `Congratulations on successfully replying to ${nameChannel}'s comment!!!`);
            } catch (error) {
                console.error("Failed to send reply:", error);
                showNotification("error", "Failed to send reply", "Please try again later.");
            }
        }
    };

    const handleToggleReplies = (commentId, e) => {
        e.preventDefault();

        // Nếu đang mở => đóng ngay không cần loading
        if (openReplies === commentId) {
            setOpenReplies(null);
            return;
        }

        // Hiển thị loading
        setReplyLoadingId(commentId);

        // Chờ 500ms rồi mở reply
        setTimeout(() => {
            setOpenReplies(commentId);
            setReplyLoadingId(null);
        }, 500);
    };

    return (
        <div className="mx-1 my-4">
            <div className="video-info">
                <div className="video-title my-2">
                    <h1 className="text-2xl font-medium themeText line-clamp-2 lg:line-clamp-3">{videoInfo.title}</h1>
                </div>
                <div className="themeBg inline-block py-1 lg:px-2.5 rounded-lg">
                    <div className="flex gap-2.5 lg:gap-4">
                        <span className="font-medium themeText">{formatNumber(videoInfo.views)} views</span>
                        <span className="font-normal themeText">{formatTimeAgo(videoInfo.createdAt)}</span>
                    </div>
                </div>
                <div className="video-body-top flex flex-col gap-3 md:flex-row md:gap-0 items-center justify-between my-2 themeBg lg:p-2 rounded-lg">
                    <div className="w-full md:w-2/5 video-creater flex justify-between items-center gap-4">
                        <NavLink className="avatar-and-name flex items-center gap-2">
                            <img src={videoInfo?.uploader?.avatarChannel} alt="img_logo" className="avatar" />
                            <div className="flex flex-col items-start">
                                <h1 className="themeText font-semibold">{videoInfo?.uploader?.nameChannel}</h1>
                                <p className="themeText text-xs italic">{formatNumber(subscribersCount)} subscribers</p>
                            </div>
                        </NavLink>
                        <button className="btn-event__1 font-medium px-2.5 py-2 rounded-lg" onClick={handleSubscribe}>
                            {isSubscribedState ? "Hủy đăng kí" : "Đăng kí"}
                        </button>
                    </div>
                    <div className="w-full md:w-2/5 flex justify-between items-center gap-2">
                        <div className="video-status flex">
                            <button className="btn-event__2"><AiOutlineLike className="hover:scale-125 duration-150" /></button>
                            <button className="btn-event__3"><AiOutlineDislike className="hover:scale-125 duration-150" /></button>
                        </div>
                        <div className="options">
                            <Popover
                                content={
                                    <div className="flex flex-col gap-1">
                                        <button className="btn-event__4 gap-0.5"><IoBookmarkOutline className="icon-setting" /> Save</button>
                                        <button className="btn-event__4 gap-0.5"><MdOutlinePlaylistAdd className="icon-setting" /> Add Playlist</button>
                                    </div>
                                }
                                trigger="click"
                                open={openMoreOptions}
                                onOpenChange={handleOpenMoreOptionsChange}
                            >
                                <button type="primary" className="btn-3 p-0.5 border-1.5 themeBorder rounded-md"><MoreOutlined className="" /></button>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className="video-body-bottom">
                    <div className="video-des themeBg py-2.5 md:py-5 md:px-2.5 rounded-lg">
                        <p className="themeText line-clamp-2 xl:line-clamp-3">{videoInfo.description}</p>
                    </div>
                </div>
            </div>
            <div className="comments my-2 themeBg py-5 md:px-2 rounded-lg">
                {/* Comments */}
                <div className="space-y-4">
                    <div className="comments-top md:mx-2">
                        <div className="number-comments flex items-center justify-between gap-4">
                            <h2 className="w-1/2 md:w-1/4 text-lg font-bold themeText">962 Comments</h2>
                            <div className="w-1/2 md:w-1/3 select">
                                <Dropdown
                                    options={optionComments}
                                    selected={value}
                                    setSelected={setValue}
                                    placeholder="Select Option"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="comments-bottom">
                        <div className="user-comment flex items-start gap-2">
                            <div className="avatar-user w-1/6 lg:w-1/12 flex justify-center">
                                <img src={userInfo?.channel?.avatarChannel} alt="img_logo" className="avatar" />
                            </div>
                            <div className="input-comment w-5/6 lg:w-11/12 md:mr-2">
                                <form onSubmit={handleCommentSubmit} action="">
                                    <div className="mb-2.5">
                                        <textarea
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write your comment..."
                                            className={`w-full form-input overflow-hidden resize-none`}
                                            // resize-none : tránh kéo dài bằng tay
                                            onInput={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-end mr-0.5">
                                        <button className="btn-event__1 px-3 py-2 rounded-3xl">Comment</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="line h-0.1 bg-slate-400 w-11/12 mx-auto my-4"></div>
                        <div className="list-comments md:px-2">
                            <div className={`rounded-xl md:px-2 py-4 grid grid-cols-1 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                                {comments.map(comment => {
                                    return (
                                        <div key={comment._id} className="mb-2 py-2">
                                            <div className="flex items-start">
                                                <NavLink className="w-16 flex justify-center">
                                                    <img src={comment.postedBy?.avatarChannel} alt="" className="avatar" />
                                                </NavLink>
                                                <div className="flex-1 w-full">
                                                    <div className="flex items-baseline gap-2">
                                                        <NavLink to={`/${comment.postedBy?.nameChannel}`}>
                                                            <p className="themeText font-semibold btn-event__4 rounded-lg text-xs">{comment.postedBy?.nameChannel}</p>
                                                        </NavLink>
                                                        <span className="themeText text-xs italic">{formatTimeAgo(comment.createdAt)}</span>
                                                    </div>
                                                    <p className="themeText mt-1 ml-0. text-xs inline-block">{comment.content}</p>
                                                    <div className="flex items-center gap-2.5 mt-1 themeText text-xs ml-0.5">
                                                        <div className="flex items-center gap-0.5">
                                                            <button className="p-1">
                                                                <BiSolidLike className="hover:scale-110 duration-150 h-4.5 w-4.5 cursor-pointer text-blue-500" />
                                                            </button>
                                                            <p className="theme-text-first text-xs">1</p>
                                                        </div>
                                                        <div className="flex items-center gap-0.5">
                                                            <button className="p-1">
                                                                <BiSolidDislike className="hover:scale-110 duration-150 h-4.5 w-4.5 cursor-pointer" />
                                                            </button>
                                                            <p className="theme-text-first text-xs">1</p>
                                                        </div>
                                                        <div className="line h-4 w-0.5 bg-slate-400"></div>
                                                        <button className="cursor-pointer underline" onClick={() => handleOpenReply(comment._id)}>Reply</button>
                                                    </div>

                                                    {replyingToCommentId === comment._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="ml-6 mt-2 input-comment w-11/12"
                                                        >
                                                            <form onSubmit={handleReplySubmit}>
                                                                <textarea
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    placeholder="Write your reply..."
                                                                    className="w-full form-input overflow-hidden resize-none text-xs"
                                                                    onInput={(e) => {
                                                                        e.target.style.height = "auto";
                                                                        e.target.style.height = e.target.scrollHeight + "px";
                                                                    }}
                                                                />
                                                                <div className="flex justify-end mt-2 mr-0.5">
                                                                    <button type="button" className="text-xs themeText font-medium mr-2 px-2" onClick={handleCloseReply}>Cancel</button>
                                                                    <button type="submit" className="text-xs btn-event__4 font-medium px-3 py-1.5 rounded-3xl">Reply</button>
                                                                </div>
                                                            </form>
                                                        </motion.div>
                                                    )}

                                                    {comment.replyCount > 0 && (
                                                        <div className="mt-2 mx-1.5">
                                                            <button onClick={(e) => handleToggleReplies(comment._id, e)} className="pb-1 flex items-center gap-1.5 border-b-1.5">
                                                                <div className="border theme-border rounded-full">
                                                                    <MdOutlineKeyboardArrowDown className={`size-4 duration-500 cursor-pointer ${openReplies === comment._id ? "rotate-180" : ""}`} />
                                                                </div>
                                                                <span className="text-xs">{openReplies === comment._id ? "Ẩn bớt" : `Xem thêm ${comment.replyCount} bình luận`}</span>
                                                            </button>

                                                            {replyLoadingId === comment._id && (<div className="w-full h-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-2">Loading...</div>)}

                                                            {openReplies === comment._id && replyLoadingId === null && (
                                                                <AnimatePresence>
                                                                    {openReplies === comment._id && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="mt-2 px-1 border-b-1.5 theme-border max-h-96 overflow-auto transition-all duration-300 ease-in-out content-sidebar">
                                                                                <Replies videoId={videoId} userId={userId} parentCommentId={comment._id} formatTimeAgo={formatTimeAgo} showNotification={showNotification} />
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoInfo;