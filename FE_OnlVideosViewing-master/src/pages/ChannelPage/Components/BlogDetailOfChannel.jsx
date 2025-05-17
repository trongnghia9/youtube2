import React, { useEffect } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { renderContentWithLinks } from "../../../utils/renderContentWithLinks";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import { TfiControlBackward } from "react-icons/tfi";
import { HiMiniSlash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getBlogInfo } from "../../../redux/reducers/blogReducer";

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

const BlogDetailOfChannel = () => {

    const dispatch = useDispatch();
    const { blogId } = useParams();
    const { channelInfo, formatNumber, formatTimeAgo, formatVideoDuration } = useOutletContext();

    // console.log("blogId: ", blogId);

    const nameChannel = channelInfo?.nameChannel;

    const { selectedBlog, loading } = useSelector((state) => state.blog);

    // console.log("selectedBlog", selectedBlog);

    useEffect(() => {
        dispatch(getBlogInfo(blogId));
    }, [blogId, dispatch]);

    if (loading || !selectedBlog) {
        return <div className="p-4">Loading blog data...</div>;
    }

    return (
        <div className="p-4 flex flex-col theme-card-second gap-4 rounded-2xl">
            <div className="title flex items-center gap-1.5">
                <NavLink to={`/${nameChannel}/blogs`} className="font-semibold flex items-center gap-1 hover:text-thirdColor duration-300"><TfiControlBackward className="size-4" /> <span className="text-xs">Blogs</span></NavLink>
                <span> <HiMiniSlash /> </span>
                <p className="text-xs font-semibold">Blog Detail</p>
            </div>
            <div className="lg:w-2/3 border-0.5 p-2.5 theme-first rounded-2.5xl">
                <div className="flex flex-col gap-6">
                    <div className="user-info flex items-start gap-4 border-2 border-solid theme-border p-4 rounded-2xl">
                        <div className="w-1/6 sm:w-1/9 2xl:w-1/12 flex justify-center">
                            <img src={channelInfo?.avatarChannel} alt="avatar" className="avatar aspect-square object-cover" />
                        </div>
                        <div className="w-5/6 sm:w-8/9 2xl:w-11/12 flex flex-col gap-4">
                            <div className="user-name flex items-baseline justify-between border-b theme-border">
                                <p className="text-lg font-semibold">{nameChannel}</p>
                                <p className="text-xs font-normal">{formatTimeAgo(selectedBlog.updatedAt)}</p>
                            </div>
                            <div className="blog-img flex items-center justify-center overflow-hidden rounded-xl">
                                <div className="w-full h-80 relative">
                                    {selectedBlog.blogImgs?.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`blog_img_${index}`}
                                            className="absolute rounded-md object-cover w-11.25/12 h-72 shadow-md"
                                            style={{
                                                bottom: `${index * 0.75}rem`,
                                                left: `${index * 1}rem`,
                                                zIndex: 20 - index,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="blog-content my-1 flex flex-col gap-2">
                                <p className="text-2xl font-semibold line-clamp-2">{selectedBlog.title}</p>
                                <p className="text-sm font-normal line-clamp-4 whitespace-pre-line break-words">{renderContentWithLinks(selectedBlog.content)}</p>
                            </div>
                            <div className="blog-footer flex flex-col gap-6 mb-0.5">
                                <div className="blog-active border-t-0.5 border-solid theme-border pt-5 flex items-center justify-start gap-4 sm:gap-6">
                                    <div className="blog-likes flex items-center gap-2">
                                        <button className="btn-event__2 rounded-full p-1.25"><AiOutlineLike className="hover:scale-125 duration-150" /></button>
                                        <p className="text-sm">{formatNumber(selectedBlog.likes)}</p>
                                    </div>
                                    <div className="blog-dislikes flex items-center gap-2">
                                        <button className="btn-event__2 rounded-full p-1.25"><AiOutlineDislike className="hover:scale-125 duration-150" /></button>
                                        <p className="text-sm">{formatNumber(selectedBlog.dislikes)}</p>
                                    </div>
                                    {/* <div className="blog-comments flex items-center gap-2">
                                            <button className="btn-event__2 rounded-full p-1.25"><TfiCommentAlt className="hover:scale-125 duration-150" /></button>
                                            <p className="text-sm">{formatNumber(blog.comments)}</p>
                                        </div> */}
                                    <div className="blog-shares flex items-center gap-2">
                                        <button className="btn-event__2 rounded-full p-1.25"><PiShareFatLight className="hover:scale-125 duration-150" /></button>
                                        <p className="text-sm">{formatNumber(selectedBlog.shares)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Comments /> */}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailOfChannel;