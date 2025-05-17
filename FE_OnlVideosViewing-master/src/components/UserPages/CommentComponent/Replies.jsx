import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getRepliesByParentCommentId, replyToCommentInVideo } from "../../../redux/reducers/commentReducer";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";

const Replies = ({ videoId, userId, parentCommentId, formatTimeAgo, likes, showNotification }) => {

    // console.log("parentCommentId", parentCommentId);

    const dispatch = useDispatch();

    const repliesData = useSelector(
        (state) => state.comment.repliesByParentId[parentCommentId]
    );

    // console.log("repliesData", repliesData);

    const arrayReplies = repliesData?.data;

    const [allReplies, setAllReplies] = useState(arrayReplies);

    useEffect(() => {
        if (!repliesData) {
            dispatch(getRepliesByParentCommentId({ parentCommentId, page: 1 }));
        }
    }, [dispatch, parentCommentId]);

    const handleLoadMore = () => {
        if (repliesData?.hasMore) {
            dispatch(
                getRepliesByParentCommentId({
                    parentCommentId,
                    page: repliesData.page + 1,
                })
            );
        }
    };

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

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (replyText.trim() && replyingToCommentId) {
            try {
                const res = await dispatch(replyToCommentInVideo({
                    videoId,
                    parentCommentId: replyingToCommentId,
                    content: replyText.trim(),
                    userId,
                })).unwrap(); // unwrap để lấy data từ thunk

                if (res?.reply) {
                    // setAllReplies((prev) => [res.reply, ...prev]);  // Trên cùng
                    setAllReplies((prev) => [...prev, res.reply]);  // Dưới cùng 

                    const nameChannel = res.reply?.parentComment?.postedBy?.nameChannel || "người dùng";
                    showNotification(
                        "success",
                        "Comment Reply Successfully!!",
                        `Congratulations on successfully replying to ${nameChannel}'s comment!!!`
                    );
                }

                setReplyText("");
                setShowReplyForm(false);
                setReplyingToCommentId(null);
            } catch (error) {
                console.error("Failed to send reply:", error);
                showNotification("error", "Failed to send reply", "Please try again later.");
            }
        }
    };

    useEffect(() => {
        setAllReplies(Array.isArray(repliesData?.data) ? repliesData?.data : []);
    }, [repliesData]);

    if (!repliesData) return null;

    return (
        <div className="mb-2 flex flex-col">
            {allReplies.map((reply) => (
                <div key={reply._id} className="flex items-start my-1.5">
                    <NavLink className="w-16 flex justify-center">
                        <img src={reply.postedBy?.avatarChannel} alt="" className="avatar" />
                    </NavLink>
                    <div className="flex-1 w-full">
                        <div className="flex items-baseline gap-2">
                            <NavLink to={`/${reply.postedBy?.nameChannel}`}>
                                <p className="themeText font-semibold btn-event__4 rounded-lg text-xs">{reply.postedBy?.nameChannel}</p>
                            </NavLink>
                            <span className="themeText text-xs italic">{formatTimeAgo(reply.updatedAt)}</span>
                        </div>
                        <p className="themeText mt-1 ml-0. text-xs inline-block"><span className="font-semibold text-teal-700">@{reply.parentComment?.postedBy?.nameChannel}</span> {reply.content}</p>
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
                            <button className="cursor-pointer underline" onClick={() => handleOpenReply(reply._id)}>Reply</button>
                        </div>

                        {replyingToCommentId === reply._id && (
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
                                        <button type="button" className="themeText font-medium mr-2 px-2 text-xs" onClick={handleCloseReply}>Cancel</button>
                                        <button type="submit" className="btn-event__4 font-medium px-3 py-1.5 rounded-3xl text-xs">Reply</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                    </div>
                </div>
            ))}
            {repliesData.hasMore && (
                <button
                    onClick={handleLoadMore}
                    className="text-blue-500 text-xs mt-2 hover:underline"
                >
                    Xem thêm phản hồi
                </button>
            )}
        </div>
    );
};

export default Replies;