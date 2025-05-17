import React from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { TfiCommentAlt, TfiControlBackward } from "react-icons/tfi";
import { formatNumber } from "../../../../utils/formatNumber";
// import Comments from "../../../../components/UserPages/CommentComponent/Comments";
import { NavLink } from "react-router-dom";
import { HiMiniSlash } from "react-icons/hi2";

const blog = [
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
];

const BlogDetail = () => {
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="title flex items-center gap-1.5">
                <NavLink to={`/vietductn281103@gmail.com/profile/blogs`} className="font-semibold flex items-center gap-1 hover:text-thirdColor duration-300"><TfiControlBackward className="size-4" /> <span className="text-xs">Blogs</span></NavLink>
                <span> <HiMiniSlash /> </span>
                <p className="text-xs font-semibold">Blog Detail</p>
            </div>
            <div className="w-2/3 border-0.5 p-2.5 theme-card-second rounded-2xl">
                {blog.map((blog) => (
                    <div className="flex flex-col gap-6">
                        <div key={blog.blogId} className="user-info flex items-start gap-4 border-2 border-solid theme-border p-4 rounded-2xl">
                            <div className="w-1/9 flex justify-center">
                                <img src={blog.avatarUploader} alt="avatar" className="avatar w-auto h-auto xl:max-w-16 xl:max-h-16 aspect-square object-cover" />
                            </div>
                            <div className="w-8/9 flex flex-col gap-4">
                                <div className="user-name flex items-baseline justify-between border-b theme-border">
                                    <p className="text-lg font-semibold">{blog.uploader}</p>
                                    <p className="text-xs font-normal">{blog.uploadDate}</p>
                                </div>
                                <div className="blog-img flex items-center justify-center overflow-hidden rounded-xl">
                                    <img src={blog.url} alt="blog_img" className="w-4/5 h-1/2 object-contain hover:scale-105 duration-300 ease-in-out" />
                                </div>
                                <div className="blog-content my-1 flex flex-col gap-2">
                                    <p className="text-xl font-semibold line-clamp-2">{blog.title}</p>
                                    <p className="text-sm font-normal line-clamp-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur incidunt quos veniam sit perferendis nesciunt atque laudantium aliquid corrupti hic, fuga, reprehenderit iste eius error sapiente quod tempora animi sequi. Maiores vel explicabo ratione quia autem nihil modi. Asperiores, placeat quas fuga in debitis a officiis id totam voluptatum architecto reiciendis dolores ad ea quibusdam iure pariatur neque veritatis ratione tempora enim saepe corrupti? Beatae ex illum nulla ea nam, dolore minus nobis quia incidunt vero nemo eligendi. Repudiandae praesentium laudantium odit veniam nisi sit magnam maxime accusamus doloremque eius voluptas provident dignissimos atque fugit, corrupti iure unde, ratione vitae et veritatis! Adipisci, nemo totam. Omnis deserunt placeat voluptatem cupiditate hic vitae maxime voluptatum. Porro necessitatibus ducimus esse vitae laborum animi, aspernatur eius. Ea, ducimus eligendi, facere, ab accusantium quod cumque iusto reprehenderit consequuntur deserunt tenetur earum sit dolor accusamus fuga enim dolore dicta? Repellat iste numquam aspernatur est saepe!</p>
                                </div>
                                <div className="blog-footer flex flex-col gap-6">
                                    <div className="blog-active border-t-0.5 border-solid theme-border pt-5 flex items-center justify-start gap-4 sm:gap-6">
                                        <div className="blog-likes flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><AiOutlineLike className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.likes)}</p>
                                        </div>
                                        <div className="blog-dislikes flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><AiOutlineDislike className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.dislikes)}</p>
                                        </div>
                                        {/* <div className="blog-comments flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><TfiCommentAlt className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.comments)}</p>
                                        </div> */}
                                        <div className="blog-shares flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><PiShareFatLight className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.shares)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Comments /> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlogDetail;