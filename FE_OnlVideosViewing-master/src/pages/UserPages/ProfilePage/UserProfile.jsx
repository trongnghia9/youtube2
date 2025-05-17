import React, { useContext, useEffect, useState } from "react";
import { AiOutlineFundView } from "react-icons/ai";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { RiUserFollowLine } from "react-icons/ri";
import { NavLink, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle } from "../../../redux/reducers/authReducer";
import { formatNumber } from "../../../utils/formatNumber";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";
import { formatVideoDuration } from "../../../utils/formatVideoDuration";

const avatarDefault = "https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png";
const bannerChannel = "https://res.cloudinary.com/dci95w73h/image/upload/v1706888435/f6updpuz5ac4y1ypwdqz.jpg";

const UserProfile = () => {

    const dispatch = useDispatch();

    const { theme } = useOutletContext();

    const { isLoggedIn, userInfo } = useSelector((state) => state.auth.userLogin);

    const navigate = useNavigate();

    // console.log(userInfo);

    const location = useLocation();
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(loginGoogle());
        }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        } else if (location.pathname === `/${userInfo.email}/profile`) {
            navigate(`/${userInfo.email}/profile/videos-posted`);
        }
    }, [isLoggedIn, navigate, location.pathname, userInfo.email]); 

    const MenuChannel = [
        { title: "Videos", path: `/${userInfo.email}/profile/videos-posted` },
        { title: "Shorts", path: `/${userInfo.email}/profile/shorts-posted` },
        { title: "Playlist", path: `/${userInfo.email}/profile/playlists` },
        { title: "Blogs", path: `/${userInfo.email}/profile/blogs` },
        { title: "History", path: `/${userInfo.email}/profile/viewing-history` },
    ];

    const isEditOrDetailPage = /\/(blog-detail)/.test(location.pathname);

    return (
        <div className="">
            <div className="mb-4">
                <div className="relative">
                    <div className="cover-photo max-w-7xl mx-auto overflow-hidden rounded-b-2xl">
                        <img src={userInfo?.channel?.bannerChannel ? userInfo.channel.bannerChannel : bannerChannel} alt="thumbnail" className="w-full h-44 md:h-64 object-cover hover:scale-105 duration-300 ease-in-out" />
                    </div>
                    <div className="absolute top-4/5 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-11/12 sm:w-3/4 mx-auto mb-4">
                        <div className="flex items-start justify-center gap-4 xl:gap-0">
                            <div className="avatar-channel w-1/4 md:w-1/5 2xl:w-1/6 flex justify-center">
                                <img src={userInfo?.channel?.avatarChannel ? userInfo.channel.avatarChannel : avatarDefault} alt="avatar" className="avatar size-20 xl:size-36" />
                            </div>
                            <div className="info w-3/4 md:w-1/2 theme-card-second p-2.5 md:p-4 border-1.5 rounded-2xl">
                                <div className="flex flex-col gap-y-1">
                                    <p className="font-semibold text-2xl md:text-3xl">{userInfo?.channel?.nameChannel}</p>
                                    <div className="ml-0.25">
                                        <div className="flex flex-col gap-y-1">
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-sm">Tìm hiểu thêm về kênh </p>
                                                <button className="text-xs underline theme-text-first" onClick={() => setShowDetails(!showDetails)}>
                                                    Chi tiết
                                                </button>
                                            </div>
                                            <div className={`overflow-hidden ${showDetails ? "max-h-40 opacity-100 mx-0.5 mt-0.5 mb-2" : "max-h-0 opacity-0"} duration-600 ease-in-out`}>
                                                <div className="flex flex-col gap-y-2">
                                                    <div className="description">
                                                        <p className="text-xs line-clamp-2">{userInfo?.channel.description}</p>
                                                    </div>
                                                    <div className="followed flex items-center">
                                                        <RiUserFollowLine className="icon-setting" />
                                                        <p className="text-xs"><span className="font-semibold">{userInfo?.channel?.subscribersCount}</span> subscribers</p>
                                                    </div>
                                                    <div className="videos flex items-center">
                                                        <MdOutlineVideoLibrary className="icon-setting" />
                                                        <p className="text-xs">
                                                            <span className="font-semibold">{userInfo?.channel.videoTotal}</span> videos
                                                        </p>
                                                    </div>
                                                    <div className="views flex items-center">
                                                        <AiOutlineFundView className="icon-setting" />
                                                        <p className="text-xs">
                                                            <span className="font-semibold">{userInfo?.channel.viewTotal}</span> views
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="button-action md:ml-0.25 flex flex-wrap gap-2">
                                        <NavLink to={`/premium`} className="btn-1 text-xs py-1.5 px-4 rounded-md">Premium</NavLink>
                                        <NavLink to={`/studio/edit-profile/${userInfo?.channel?._id}`} className="btn-2 text-xs py-1.5 px-4 rounded-md">Edit Profile</NavLink>
                                        <NavLink to={`/studio/content-management/videos`} className="btn-2 text-xs py-1.5 px-4 rounded-md">Video Management</NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!isEditOrDetailPage && (
                    <div className={`w-11/12 sm:w-3/4 mx-auto duration-600 ease-in-out ${showDetails ? "mt-56" : "mt-40 md:mt-36"}`}>
                        <header className="sm:mx-4 xl:mx-40">
                            <div className="flex items-center justify-between md:w-4/5 lg:w-2/3 gap-1">
                                {MenuChannel.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <div className="w-1/5" key={index}>
                                            <NavLink
                                                to={item.path}
                                                className={`flex items-center justify-center gap-x-4 h-10 px-2.5 rounded-t-lg text-base ${isActive ? "theme-third" : "theme-text-first"} hover:bg-thirdColor hover:text-fifthColor transition-all duration-300 ease-in-out`}
                                            >
                                                <span className="text-sm font-medium truncate">{item.title}</span>
                                            </NavLink>
                                        </div>
                                    );
                                })}
                            </div>
                        </header>
                    </div>
                )}
                <div className={`mx-2 md:w-11/12 md:mx-auto lg:w-11.75/12 theme-third rounded-lg ${!isEditOrDetailPage ? "" : `${showDetails ? "mt-56" : "mt-40 md:mt-32"} duration-600 ease-in-out`}`}>
                    <Outlet context={{ theme, userInfo, isLoggedIn, formatNumber, formatTimeAgo, formatVideoDuration }} />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;