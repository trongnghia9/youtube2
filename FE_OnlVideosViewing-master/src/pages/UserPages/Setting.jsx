import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../services/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { MdGTranslate } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle } from "../../redux/reducers/authReducer";

const Setting = () => {

    const { theme, toggleTheme } = useContext(ThemeContext);
    const dispatch = useDispatch();

    const { isLoggedIn, userInfo } = useSelector((state) => state.auth.userLogin);

    // console.log(userInfo);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(loginGoogle());
        }
    }, [dispatch, isLoggedIn]);

    return (
        <div className="m-5 md:w-4/5 lg:w-2/3 theme-first p-4 rounded-lg">
            <div className="title border-b-1.5 theme-bg-first flex items-center justify-between">
                <NavLink to="/" >
                    <div className="flex items-center text-sm font-medium text-footer"><TiArrowBack className="text-2xl" /> <span>Back to Home</span></div>
                </NavLink>
                <p className="text-lg font-semibold">Setting</p>
            </div>
            <div className="my-4 flex flex-col gap-2">
                <div className="account">
                    <p className="text-xl font-semibold">Kênh Metube của bạn</p>
                    <p className="text-xs font-normal">Đây là sự hiện diện công khai của bạn trên Metube. Bạn cần có một kênh để tải video của riêng mình lên, bình luận về các video hoặc tạo danh sách phát.</p>
                    <div className="account-info my-4 border-1.5 theme-border rounded-xl px-2.5 py-3 inline-block">
                        {!isLoggedIn ? (
                            <p className="text-sm text-red-500 font-medium">Vui lòng đăng nhập để xây dựng kênh</p>
                        ) : (
                            <div className="">
                                <p className="text-sm font-medium">Kênh của bạn</p>
                                <div className="flex items-start gap-4 mt-2">
                                    <img src={userInfo.avatar.url} alt="" className="avatar size-20 rounded-full"/>
                                    <div className="my-auto">
                                        <p className="text-sm font-medium">{userInfo.username}</p>
                                        <p className="text-xs font-normal">{userInfo.email}</p>
                                        <NavLink to={`/studio/content-management/videos`} className={`text-xs font-medium text-cyan-600 no-underline hover:underline`}>
                                            Trạng thái và tính năng của Kênh
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="flex items-center gap-0.25">
                        {theme === "dark" ? <FaSun className="icon-setting" /> : <FaMoon className="icon-setting" />}
                        <span>{theme === "dark" ? "Light" : "Moon"}</span>
                    </button>

                    <button className="flex items-center"><MdGTranslate className="icon-setting" /> Translate</button>
                </div>
            </div>
        </div>
    )
}

export default Setting;