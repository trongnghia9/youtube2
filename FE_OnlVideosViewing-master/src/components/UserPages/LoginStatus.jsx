import { Drawer, Popover } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { LuBell, LuTrash, LuUserRound } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../services/ThemeContext";
import { PiBellSimpleRingingFill, PiBellSimpleZFill } from "react-icons/pi";
import { HiMiniArrowRightOnRectangle } from "react-icons/hi2";
import { TbBellCheck, TbCheckbox, TbReload } from "react-icons/tb";
// import { logoutSuccess } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { logoutGoogle } from "../../redux/reducers/authReducer";
import { deleteNotification, getNotifications, markNotificationAsRead } from "../../redux/reducers/notificationReducer";

import { formatTimeAgo } from "../../utils/formatTimeAgo";

const LoginStatus = ({ value }) => {

    const { theme, toggleTheme } = useContext(ThemeContext);

    const { socket, isConnected, isLoggedIn, userInfo } = value;

    // const { socket, isConnected, isLoggedIn, userInfo } = useContext(SocketContext);

    // console.log("Login status:", userInfo);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        dispatch(logoutGoogle());
        navigate("/");
        setOpenUser(false);
    };

    const { notifications } = useSelector((state) => state.notification);

    // console.log("Notifications:", notifications);

    const unreadCount = notifications.filter((noti) => !noti.isRead).length;

    useEffect(() => {
        if (userInfo?.channel?._id) {
            dispatch(getNotifications(userInfo.channel._id));
        }
    }, [dispatch, userInfo?.channel?._id]);

    useEffect(() => {
        if (!userInfo?.channel?._id || !socket) return;

        const handleSubNotification = ({ channelId, userId }) => {
            if (userInfo?.channel?._id === channelId || userInfo?.channel?._id === userId) {
                dispatch(getNotifications(userInfo.channel._id));
            }
        };

        socket.on("notification-sub-successful", handleSubNotification);

        return () => {
            socket.off("notification-sub-successful", handleSubNotification);
        };
    }, [dispatch, socket, userInfo?.channel?._id]);

    useEffect(() => {
        if (!userInfo?.channel?._id || !socket) return;

        const handleNewNotification = (data) => {
            if (data?.receiverId === userInfo.channel._id) {
                dispatch(getNotifications(userInfo.channel._id));
            }
        };

        socket.on("comment-video", handleNewNotification);

        return () => {
            socket.off("comment-video", handleNewNotification);
        };
    }, [socket, userInfo?.channel?._id, dispatch]);

    useEffect(() => {
        if (!userInfo?.channel?._id || !socket) return;

        const handleNewReplyNotification = (data) => {
            if (data?.receiverId === userInfo.channel._id) {
                dispatch(getNotifications(userInfo.channel._id));
            }
        };

        socket.on("reply-comment", handleNewReplyNotification);

        return () => {
            socket.off("reply-comment", handleNewReplyNotification);
        };
    }, [socket, userInfo?.channel?._id, dispatch]);

    // Popover User
    const [openUser, setOpenUser] = useState(false);
    const hideUser = () => {
        setOpenUser(false);
    };
    const handleOpenUserChange = (newOpen) => {
        setOpenUser(newOpen);
    };

    // Notification
    const [openNotification, setOpenNotification] = useState(false);
    const showDrawerNotification = () => {
        setOpenNotification(true);
    };
    const onCloseNotification = () => {
        setOpenNotification(false);
    };

    // Drawer Notification
    const [loadingNotification, setLoadingNotification] = useState(true);
    const showLoadingNotification = () => {
        setOpenNotification(true);
        setLoadingNotification(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoadingNotification(false);
        }, 500);
    };

    return (
        <>
            {!isLoggedIn ? (
                <div className="no-login">
                    <div className="right-header w-1/6 flex justify-between items-center gap-4">
                        <div className="header-login">
                            <button className="btn-1" onClick={handleLogin}>Login</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="login w-11/12 md:w-2/3 flex items-center gap-4">
                    <div className="header-notification flex justify-center w-1/2">
                        <button className="relative border-1.5 theme-border rounded-full p-0.5" onClick={showLoadingNotification}>
                            {unreadCount > 0 && (
                                <div className="w-4.5 h-4.5 bg-red-600 text-white opacity-95 text-xs rounded-full flex items-center justify-center absolute -top-1 -right-1.5">
                                    <span className="text-xs">{unreadCount}</span>
                                </div>
                            )}
                            {unreadCount === 0 ? <PiBellSimpleZFill className="text-2xl" /> : <PiBellSimpleRingingFill className="text-2xl animate-shake" />}
                        </button>
                        <Drawer
                            width={350}
                            closable={false}
                            mask={false}
                            destroyOnClose
                            title={
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <button className="flex items-center" onClick={onCloseNotification}>
                                            <HiMiniArrowRightOnRectangle className="icon-setting rounded-lg md:size-8 lg:size-8 mr-2 md:mr-4" />
                                        </button>
                                        <p className="text-base md:text-2xl lg:text-xl themeText">Notification</p>
                                    </div>
                                    <button className="" onClick={showLoadingNotification}><TbReload className="icon-setting rounded-lg md:size-8 lg:size-8 mr-2 md:mr-4" /></button>
                                </div>
                            }
                            onClose={onCloseNotification}
                            placement="right"
                            open={openNotification}
                            loading={loadingNotification}
                            headerStyle={{
                                padding: "1rem 20px",
                                background: theme === "dark" ? "#252525" : "#EDEDED",
                                color: theme === "dark" ? "#EDEDED" : "#8D9192",
                            }}
                            bodyStyle={{
                                padding: "0.65rem",
                                background: theme === "dark" ? "#111111" : "#FFFFFF",
                                color: theme === "dark" ? "#EDEDED" : "#252525",
                            }}
                        >
                            {notifications.length === 0 ? (
                                <p>No new notifications.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {notifications.map((noti, index) => (
                                        <li key={index} className={`h-20 p-2 rounded-md shadow-sm flex items-start gap-2 ${noti.isRead ? "theme-hover" : "theme-header-first"}`}>
                                            <NavLink to={`/${noti.senderName}`} className="w-2/12 h-full flex items-center justify-center">
                                                <img src={noti.senderAvatar} alt="avatar" className="avatar" />
                                            </NavLink>
                                            <div className="w-9/12 px-0.5 h-full flex flex-col justify-between">
                                                <p className="text-sm line-clamp-2">{noti.message}</p>
                                                <span className="text-xs text-gray-500">{formatTimeAgo(noti.updatedAt)}</span>
                                            </div>
                                            <div className="w-1/12 h-full flex flex-col items-center justify-between">
                                                <button className="" onClick={() => dispatch(deleteNotification(noti._id))}>
                                                    <LuTrash className="icon-setting mr-0" />
                                                </button>
                                                <button disabled={noti.isRead} className={`p-0.5 rounded-full ${noti.isRead ? "cursor-not-allowed opacity-50" : "theme-hover"}`} onClick={() => dispatch(markNotificationAsRead(noti._id))}>
                                                    {noti.isRead ? <TbBellCheck className="size-4" /> : <TbCheckbox className="size-4" />}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Drawer>
                    </div>
                    <div className="header-user flex justify-end w-1/2">
                        <Popover
                            content={
                                <div className="flex flex-col gap-1">
                                    <NavLink to={`/${userInfo.email}/profile/videos-posted`} className="btn-event__4 gap-0.5">
                                        <LuUserRound className="icon-setting mr-1.5" />
                                        Profile
                                    </NavLink>
                                    <button className="btn-event__4 gap-0.5" onClick={handleLogout}>
                                        <AiOutlineLogout className="icon-setting mr-1.5" />
                                        Logout
                                    </button>
                                </div>
                            }
                            trigger="click"
                            open={openUser}
                            onOpenChange={handleOpenUserChange}
                        >
                            <button className="" type="primary">
                                <img
                                    src={userInfo?.channel?.avatarChannel ? userInfo.channel.avatarChannel : userInfo.avatar.url}
                                    alt="avatar_default"
                                    className="avatar"
                                />
                            </button>
                        </Popover>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginStatus;