import React, { useContext, useEffect, useState } from "react";
import { message, Popconfirm, Table } from "antd";
import { MdLock, MdPublic } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import { NavLink, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, getAllBlogsByUserId } from "../../../redux/reducers/blogReducer";

const BlogsManagement = () => {

    const dispatch = useDispatch();
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    const userId = userInfo?.channel?._id;

    // console.log("userId", userId);

    const { allBlogs, loading, error } = useSelector((state) => state.blog);

    // console.log(allBlogs);

    useEffect(() => {
        if (userId) {
            dispatch(getAllBlogsByUserId(userId));
        }
    }, [userId, dispatch]);

    const [blogs, setBlogs] = useState(allBlogs);

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

    const confirmDelete = async (blogId) => {
        try {
            const result = await dispatch(deleteBlog(blogId)).unwrap();

            console.log("📄 Blog deleted:", result);

            const updatedBlogs = blogs.filter((blog) => blog._id !== blogId);
            setBlogs(updatedBlogs);

            showNotification("success", "Deleted Blog", `The blog titled "${result.blogDeleted.title}" has been removed.`);
        } catch (err) {
            showNotification("error", "Failed to delete blog", err.message);
        }
    };

    const cancelDelete = (e) => {
        showNotification("error", "Cancelled", "The blog has not been deleted.");
    };

    useEffect(() => {
        setBlogs(Array.isArray(allBlogs) ? allBlogs : []);
    }, [allBlogs]);

    const columns = [
        {
            title: 'Blogs', width: 200, dataIndex: 'blog', ...alignCenter, render: (_, record) => {
                return (
                    <div className="w-full flex items-center gap-2.5">
                        <div className="w-1/3 h-24 relative">
                            {record.blogImgs?.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`blog_img_${index}`}
                                    className="absolute rounded-md object-cover w-28 h-20 shadow-md"
                                    style={{
                                        bottom: `${index * 4}px`,
                                        left: `${index * 8}px`,
                                        zIndex: 20 - index,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="w-64 h-24 flex flex-col justify-center text-start pl-4">
                            <p className="line-clamp-1">{record.title}</p>
                            <p className="text-xs font-normal theme-text-first opacity-85 line-clamp-2">{record.content}</p>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Display Mode', width: 75, dataIndex: 'displayMode', key: 'displayMode', ...alignCenter, render: (displayMode) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        {displayMode ? <MdPublic className="size-5 theme-text-first" /> : <MdLock className="size-5 theme-text-first" />}
                        <p className="text-xs">{displayMode ? "Public" : "Private"}</p>
                    </div>
                )
            }
        },
        { title: 'Date posted', width: 75, dataIndex: 'datePosted', key: 'datePosted', ...alignCenter },
        { title: 'Comments', width: 50, dataIndex: 'comments', key: 'comments', ...alignCenter },
        { title: 'Likes (%)', width: 75, dataIndex: 'likes', key: 'likes', ...alignCenter },
        {
            width: 75, ...alignCenter, render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <NavLink to={`/studio/content-management/blog/${record.blogId}/edit`} className="btn-1 py-1.5 px-2 text-xs"><AiOutlineEdit className="size-5" /></NavLink>
                        <Popconfirm
                            icon={<></>}
                            title={
                                <div className="flex items-center gap-1.5">
                                    <IoWarningOutline className="size-5 text-yellow-500" />
                                    <p className="text-xs">Delete Blog</p>
                                </div>
                            }
                            description={
                                <div className="w-11.75/12 mx-auto">
                                    <p className="text-xs">Are you sure you want to delete this blog?</p>
                                </div>
                            }
                            onConfirm={() => confirmDelete(record.blogId)}
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

    const dataSource = blogs?.map((blog) => {
        return {
            key: blog._id,
            blogId: blog._id,
            title: blog.title,
            content: blog.content,
            blogImgs: blog.blogImgs || [],
            displayMode: !blog.isPrivate,
            datePosted: new Date(blog.createdAt).toLocaleDateString(),
            comments: blog.comments,
            likes: blog.likes,
        }
    });

    return (
        <div className={`custom-table ${theme === "dark" ? "dark-theme" : "light-theme"} rounded-md`}>
            <Table
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
                pagination={false}
                // rowClassName={(record) => selectedRowKeys.includes(record.key) ? 'selected-row' : ''}
                className="custom-table border theme-border"
            />
        </div>
    );
};

export default BlogsManagement;