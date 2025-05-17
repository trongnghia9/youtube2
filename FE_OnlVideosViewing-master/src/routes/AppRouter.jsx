import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import OpeningLayout from "../layouts/OpeningLayout";
import AdminLayouts from "../layouts/AdminLayout";

import NotFound from "../pages/NotFoundPage/NotFound";
import HomePage from "../pages/UserPages/HomePage";
import Shorts from "../pages/UserPages/Shorts";
import Discover from "../pages/UserPages/Discover";
import Channels from "../pages/UserPages/Channels";
import Setting from "../pages/UserPages/Setting";
import VideosModerationPage from "../pages/AdminPage/VideosModerationPage";
import VideoLayout from "../layouts/VideoLayout";
import ChannelInfo from "../pages/ChannelPage/ChannelInfo";
import HomeChannel from "../pages/ChannelPage/Components/HomeChannel/HomeChannel";
import VideoList from "../pages/ChannelPage/Components/VideoList";
import Blogs from "../pages/ChannelPage/Components/Blogs";

import ProtectedRoute from "../pages/NotFoundPage/ProtectedRoute";

import UserProfile from "../pages/UserPages/ProfilePage/UserProfile";
import VideosPosted from "../pages/UserPages/ProfilePage/Components/VideosPosted";
import BlogsPosted from "../pages/UserPages/ProfilePage/Components/BlogsPosted";
import StudioLayout from "../layouts/StudioLayout";
import ContentManagement from "../pages/StudioPage/ContentManagement";
import VideosManagement from "../pages/StudioPage/Components/VideosManagement";
import BlogsManagement from "../pages/StudioPage/Components/BlogsManagement";
import EditVideo from "../pages/StudioPage/Components/EditPage/EditVideo";
import EditBlog from "../pages/StudioPage/Components/EditPage/EditBlog";
import CreateVideo from "../pages/StudioPage/CreateVideo";
import EditProfile from "../pages/StudioPage/EditProfile";
import BlogDetail from "../pages/UserPages/ProfilePage/Components/BlogDetail";
import BlogDetailOfChannel from "../pages/ChannelPage/Components/BlogDetailOfChannel";
import AccountManagement from "../pages/AdminPage/AccountManagement";
import LoginPage from "../pages/LoginPage/LoginPage";

import { SocketContext } from "../services/SocketContext";
import PlayList from "../pages/ChannelPage/Components/PlayList";
import MyPlaylist from "../pages/UserPages/ProfilePage/Components/MyPlaylist";
import PlaylistsManagement from "../pages/StudioPage/Components/PlaylistsManagement";
import EditPlaylist from "../pages/StudioPage/Components/EditPage/EditPlaylist";
import CreateBlog from "../pages/StudioPage/CreateBlog";
import CreateShort from "../pages/StudioPage/CreateShort";
import ShortVideosManagement from "../pages/StudioPage/Components/ShortVideosManagement";
import PremiumPurchasePage from "../pages/PremiumPurchasePage/PremiumPurchasePage";
import ViewHistory from "../pages/UserPages/ProfilePage/Components/ViewHistory";

const AppRouter = () => {

    const { socket, isConnected, isLoggedIn, userInfo } = useContext(SocketContext);

    // console.log(socket);

    // console.log(isConnected);

    useEffect(() => {
        if (socket && userInfo?.channel?._id) {
            console.log("📤 Emitting user-login with ID:", userInfo.channel._id);
            socket.emit("user-login", { userId: userInfo.channel._id });
        }
    }, [socket, userInfo?.channel?._id]);

    return (
        <Routes>
            <Route path="/opening" element={<OpeningLayout />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<UserLayout />}>
                <Route path="" element={<HomePage />} />
                <Route path="shorts" element={<Shorts />} />
                <Route path="discover" element={<Discover />} />
                <Route path="channels" element={<Channels />} />
                <Route path="setting" element={<Setting />} />
                <Route path="video-viewing/:videoId" element={<VideoLayout />} />

                {/* <Route path=":channelId" element={<ChannelInfo />} > */}
                <Route path=":nameChannel" element={<ChannelInfo />} >
                    <Route path="" element={<HomeChannel />} />
                    <Route path="videos" element={<VideoList />} />
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="blog-detail/:blogId" element={<BlogDetailOfChannel />} />
                    <Route path="playlists" element={<PlayList />} />
                </Route>

                <Route path="/:email/profile" element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                }>
                    <Route path="videos-posted" element={<VideosPosted />} />
                    <Route path="blogs" element={<BlogsPosted />} />
                    <Route path="blog-detail/:blogId" element={<BlogDetail />} />
                    <Route path="playlists" element={<MyPlaylist />} />
                    <Route path="viewing-history" element={<ViewHistory />} />
                </Route>

                <Route path="/premium" element={<PremiumPurchasePage />} />
            </Route>

            <Route path="/studio" element={
                <ProtectedRoute>
                    <StudioLayout />
                </ProtectedRoute>
            }>
                <Route path="content-management" element={<ContentManagement />} >
                    <Route path="videos" element={<VideosManagement />} />
                    <Route path="video/:videoId/edit" element={<EditVideo />} />
                    <Route path="shorts" element={<ShortVideosManagement />} />
                    <Route path="blogs" element={<BlogsManagement />} />
                    <Route path="blog/:blogId/edit" element={<EditBlog />} />
                    <Route path="playlists" element={<PlaylistsManagement />} />
                    <Route path="playlist/:playlistId/edit" element={<EditPlaylist />} />
                </Route>
                <Route path="create-video" element={<CreateVideo />} />
                <Route path="create-short" element={<CreateShort />} />
                <Route path="create-blog" element={<CreateBlog />} />
                <Route path="edit-profile/:channelId" element={<EditProfile />} />
                <Route path="setting" element={<Setting />} />
            </Route>

            <Route path="/admin" element={<AdminLayouts />}>
                <Route path="accounts-management" element={<AccountManagement />} />
                <Route path="videos-moderation" element={<VideosModerationPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;