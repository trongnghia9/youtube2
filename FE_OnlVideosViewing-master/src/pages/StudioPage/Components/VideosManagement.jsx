import React, { useContext, useEffect, useState } from "react";
import { message, Popconfirm, Table } from "antd";
import { ThemeContext } from "../../../services/ThemeContext";
import { MdLock, MdPublic } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import { NavLink, useOutletContext } from "react-router-dom";
import { deleteVideoById, getAllVideosOfUser } from "../../../redux/reducers/videoReducer";
import { useDispatch, useSelector } from "react-redux";

const VideosManagement = () => {

    const dispatch = useDispatch();
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    const userId = userInfo?.channel?._id;

    // console.log(userId);

    const { allVideos, loading, error } = useSelector((state) => state.video);

    useEffect(() => {
        dispatch(getAllVideosOfUser(userId));
    }, [dispatch, userId]);

    const [videos, setVideos] = useState(allVideos);

    // console.log(videos);

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

    const confirmDelete = async (videoId) => {
        try {
            const result = await dispatch(deleteVideoById(videoId)).unwrap();

            console.log("📄 Video deleted:", result);

            const updatedVideos = videos.filter((video) => video._id !== videoId);
            setVideos(updatedVideos);

            showNotification("success", "Deleted Video", `The video titled ${result.videoDeleted.title} has been removed.`);
        } catch (err) {
            showNotification("error", "Failed to delete video", err.message);
        }
    };

    const cancelDelete = (e) => {
        showNotification("error", "Cancelled", "The video has not been deleted.");
    };

    useEffect(() => {
        setVideos(Array.isArray(allVideos) ? allVideos : []);
    }, [allVideos]);

    const dataSource = videos?.map((video, index) => ({
        key: video._id,
        videoId: video._id,
        thumbnail: video.thumbnail,
        title: video.title,
        description: video.description,
        displayMode: !video.isPrivate,
        datePosted: new Date(video.createdAt).toLocaleDateString(),
        views: video.views,
        comments: video.comments,
        likes: video.likes,
    }));

    const columns = [
        {
            title: 'Video', width: 275, dataIndex: 'video', ...alignCenter, render: (_, record) => {
                return (
                    <div className="flex items-center gap-2.5">
                        <div className="w-1/3 overflow-hidden rounded-md">
                            <img src={record.thumbnail} alt="video" className="w-full h-20 object-cover hover:scale-105 duration-300" />
                        </div>
                        <div className="w-2/3 flex flex-col text-start">
                            <p className="line-clamp-1">{record.title}</p>
                            <p className="text-xs font-normal theme-text-first opacity-85 line-clamp-2">{record.description}</p>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Display Mode', width: 100, dataIndex: 'displayMode', key: 'displayMode', ...alignCenter, render: (displayMode) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        {displayMode ? <MdPublic className="size-5 theme-text-first" /> : <MdLock className="size-5 theme-text-first" />}
                        <p className="text-xs">{displayMode ? "Public" : "Private"}</p>
                    </div>
                )
            }
        },
        { title: 'Date posted', width: 100, dataIndex: 'datePosted', key: 'datePosted', ...alignCenter },
        { title: 'Views', width: 50, dataIndex: 'views', key: 'views', ...alignCenter },
        { title: 'Comments', width: 50, dataIndex: 'comments', key: 'comments', ...alignCenter },
        { title: 'Likes (%)', width: 50, dataIndex: 'likes', key: 'likes', ...alignCenter },
        {
            width: 100, ...alignCenter, render: (_, record) => {

                // console.log(record.videoId);

                return (
                    <div className="flex items-center justify-center gap-2">
                        <NavLink to={`/studio/content-management/video/${record.videoId}/edit`} className="btn-1 py-1.5 px-2 text-xs"><AiOutlineEdit className="size-5" /></NavLink>
                        <Popconfirm
                            icon={<></>}
                            title={
                                <div className="flex items-center gap-1.5">
                                    <IoWarningOutline className="size-5 text-yellow-500" />
                                    <p className="text-xs">Delete Video</p>
                                </div>
                            }
                            description={
                                <div className="w-11.75/12 mx-auto">
                                    <p className="text-xs">Are you sure you want to delete this video?</p>
                                </div>
                            }
                            onConfirm={() => confirmDelete(record.videoId)}
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

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        columnWidth: 50,
    };

    return (
        <div className={`custom-table ${theme === "dark" ? "dark-theme" : "light-theme"} rounded-md`}>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowClassName={(record) => selectedRowKeys.includes(record.key) ? 'selected-row' : ''}
                // className={`shadow-lg transition-all ${theme === 'dark' ? 'themeBorderReverse' : 'themeBorder'} [&_.ant-table]:!bg-transparent ${theme === 'dark' ? '[&_.ant-table-cell-fix-left]:!bg-black [&_.ant-table-cell-fix-right]:!bg-black' : '[&_.ant-table-cell-fix-left]:!bg-white [&_.ant-table-cell-fix-right]:!bg-white'}`}
                className="custom-table border theme-border"
            />
        </div>
    );
}

export default VideosManagement;
