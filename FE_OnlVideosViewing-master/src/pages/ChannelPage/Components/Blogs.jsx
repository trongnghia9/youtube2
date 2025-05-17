import React, { useEffect } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { TfiCommentAlt } from "react-icons/tfi";
import { NavLink, useOutletContext } from "react-router-dom";
import { formatNumber } from "../../../utils/formatNumber";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { getAllBlogsByChannelId } from "../../../redux/reducers/blogReducer";

const Blogs = () => {

    const dispatch = useDispatch();
    const { channelInfo, formatNumber, formatTimeAgo, formatVideoDuration } = useOutletContext();

    const nameChannel = channelInfo?.nameChannel;

    // console.log(nameChannel);

    const { allBlogs, loading, error } = useSelector((state) => state.blog);

    // console.log(allBlogs);

    useEffect(() => {
        if (channelInfo) {
            dispatch(getAllBlogsByChannelId(channelInfo._id));
        }
    }, [channelInfo, dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 computerScreen:grid-cols-5 gap-4">
                {allBlogs.map((blog) => (
                    <NavLink key={blog._id} to={`/${nameChannel}/blog-detail/${blog._id}`} className="relative group">
                        {/* Background Layer */}
                        <div className="absolute inset-0 theme-first rounded-2.5xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Card Content */}
                        <div className="relative sm:p-6 lg:p-4 flex flex-col shadow-lg rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform group-hover:scale-95 theme-card-second">
                            <div className="p-2.5 relative z-10">
                                <div className="blog-header">
                                    <div className="blog-image rounded-1.5xl overflow-hidden">
                                        <img src={blog.blogImgs[0]} alt="img_blog" className="w-full h-52 object-cover transform transition-transform duration-500 ease-in-out hover:scale-110" />
                                    </div>
                                </div>
                                <div className="blog-body my-4">
                                    <div className="blog-title">
                                        <p className="font-medium text-2xl line-clamp-3">{blog.title}</p>
                                    </div>
                                    <div className="blog-content mt-2">
                                        <p className="text-sm line-clamp-4">{blog.content}</p>
                                        <div className="mt-1 flex gap-2">
                                            {blog.categories.map((category, index) => (
                                                <div key={`${category}-${index}`}>
                                                    <span className="text-sm theme-text-first hover:theme-text-second hover:cursor-pointer duration-200 ease-in-out">#{category}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="blog-footer flex flex-col gap-6">
                                    <div className="blog-info flex items-center justify-start gap-4">
                                        <div className="blog-avatar">
                                            <img src={channelInfo?.avatarChannel} alt="avatar" className="avatar" />
                                        </div>
                                        <div className="blog-uploader">
                                            <p className="text-xs font-medium hover:theme-text-first hover:cursor-pointer duration-300 ease-in-out">{nameChannel}</p>
                                        </div>
                                        <div className="blog-uploadDate">
                                            <p className="text-xs font-normal">{formatTimeAgo(blog.updatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="blog-active border-t-0.5 border-solid theme-border pt-5 flex items-center justify-start gap-4 sm:gap-6">
                                        <div className="blog-likes flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><AiOutlineLike className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.likes)}</p>
                                        </div>
                                        <div className="blog-dislikes flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><AiOutlineDislike className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.dislikes)}</p>
                                        </div>
                                        <div className="blog-comments flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><TfiCommentAlt className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.comments)}</p>
                                        </div>
                                        <div className="blog-shares flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><PiShareFatLight className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.shares)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Blogs;