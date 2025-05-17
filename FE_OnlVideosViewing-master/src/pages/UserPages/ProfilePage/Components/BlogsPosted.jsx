import React, { useContext, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { TfiCommentAlt } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { formatNumber } from "../../../../utils/formatNumber";
import { ThemeContext } from "../../../../services/ThemeContext";

const blogs = [
    {
        blogId: "1",
        title: "Bí quyết học lập trình hiệu quả",
        description: "Hướng dẫn cách học lập trình từ cơ bản đến nâng cao một cách hiệu quả nhất.",
        url: "https://picsum.photos/id/1/400/300",
        uploadDate: "2025-02-10",
        tags: ["Node.js", "Lập trình", "Back-end"],
        uploader: "Dev Academy",
        avatarUploader: "https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png",
        comments: 230,
        likes: 1200,
        dislikes: 15,
        shares: 30,
    },
    ...Array.from({ length: 9 }, (_, i) => ({
        blogId: `${i + 2}`,
        title: `Title cho video số ${i + 2}`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse quod, minus ipsum ducimus repellat nostrum. Sequi dicta ipsam illo officiis expedita necessitatibus aperiam vero vel magnam eaque? Laborum nesciunt, obcaecati perspiciatis ipsam enim distinctio quis aspernatur beatae quidem, asperiores libero số ${i + 2}.`,
        url: `https://picsum.photos/id/${i + 2}/400/300`,
        uploadDate: `2025-02-${10 + (i % 20)}`,
        tags: ["Học tập", "Thử thách", "Mẹo hay"],
        uploader: `Uploader ${i + 2}`,
        avatarUploader: `https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png`,
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 10000),
        dislikes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 20),
    })),
];

const BlogsPosted = () => {

    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="p-4 mx-auto">
            <div className="flex flex-col gap-3">
                <div className="flex justify-end w-11/12 mx-auto pb-4 border-b-1.5 theme-border">
                    <NavLink to={`/studio/create-blog`} className="btn-1 text-sm py-1.5 px-3.5">Create Blog</NavLink>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 computerScreen:grid-cols-5 gap-4">
                    {blogs.map((blog) => (
                        <NavLink to={`/vietductn281103@gmail.com/profile/blog-detail/${blog.blogId}`} key={blog.blogId} className="relative group">
                            {/* Background Layer */}
                            <div className="absolute inset-0 theme-first rounded-2.5xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Card Content */}
                            <div className="relative sm:p-6 flex flex-col shadow-lg rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform group-hover:scale-95 theme-card-second">
                                <div className="p-4 relative z-10">
                                    <div className="blog-header">
                                        <div className="blog-image rounded-1.5xl overflow-hidden">
                                            <img src={blog.url} alt="img_blog" className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-110" />
                                        </div>
                                    </div>
                                    <div className="blog-body mt-4 mb-6">
                                        <div className="blog-title">
                                            <p className="font-medium text-3.5xl line-clamp-3">{blog.title}</p>
                                        </div>
                                        <div className="blog-description mt-2 px-0.5">
                                            <p className="text-base line-clamp-4">{blog.description}</p>
                                            <div className="mt-1 flex gap-2">
                                                {blog.tags.map((tag, index) => (
                                                    <div key={index} className="">
                                                        <span className="text-sm theme-text-first hover:theme-text-second hover:cursor-pointer duration-200 ease-in-out">#{tag}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog-footer flex flex-col gap-6">
                                        <div className="blog-info flex items-center justify-start gap-4">
                                            <NavLink className="blog-avatar" to={`/${blog.uploader}`}>
                                                <img src="https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png" alt="avatar" className="avatar" />
                                            </NavLink>
                                            <NavLink className="blog-uploader" to={`/${blog.uploader}`}>
                                                <p className="text-sm font-medium hover:theme-text-first hover:cursor-pointer duration-300 ease-in-out">{blog.uploader}</p>
                                            </NavLink>
                                            <div className="blog-uploadDate">
                                                <p className="text-sm font-normal">{blog.uploadDate}</p>
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
        </div>
    )
}

export default BlogsPosted;