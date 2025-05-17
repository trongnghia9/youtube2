import React, { useContext, useEffect, useState } from "react";
import HeaderStudio from "../components/StudioPage/HeaderStudio";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../services/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle } from "../redux/reducers/authReducer";
import Notification from "../components/StudioPage/Notification";

export default function StudioLayout({ children }) {

    const { theme } = useContext(ThemeContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, userInfo } = useSelector((state) => state.auth.userLogin);

    console.log(userInfo);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(loginGoogle());
        }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
    };

    const [notification, setNotification] = useState(null);

    const showNotification = (type, message, description) => {
        setNotification({ type, message, description });
    };

    return (
        <div className={`max-w-screen-2xl mx-auto h-screen flex flex-col md:flex-row to-transparent ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <HeaderStudio
                onToggle={handleToggleSidebar}
                isOpen={isSidebarOpen}
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                className="h-full"
            />
            <div className={`duration-300 ${isSidebarOpen ? 'lg:w-4/5 xl:w-5/6 2xl:w-10.5/12' : 'w-11.25/12'} h-screen overflow-y-auto mx-auto body-sidebar`}>
                <Outlet context={{ theme, isLoggedIn, userInfo, showNotification }} />
            </div>

            {notification && (
                <div className="fixed top-1/20 right-1/17 z-50">
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        description={notification.description}
                        duration={3000}
                        onClose={() => setNotification(null)}
                    />
                </div>
            )}
        </div>
    )
}