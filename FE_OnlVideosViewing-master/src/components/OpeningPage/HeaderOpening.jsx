import React, { useContext, useState } from "react";
import { Button, Drawer, Popover } from 'antd';
import Search from "antd/es/input/Search";
import { MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../services/ThemeContext";

const HeaderOpening = () => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const handleTryMeTube = () => {
        navigate("/");
    }

    return (
        <div className="theme-header-second border-b-1.5">
            <div className="max-w-7xl mx-auto">
                <div className="hidden lg:block">
                    <header className="mx-10 py-2 flex justify-between items-center">
                        <div className="left-header w-1/6 flex justify-between items-center">
                            <div className="header-icon">
                                <img src="https://res.cloudinary.com/dci95w73h/image/upload/v1738316604/OnlVideosViewing/FE/Logo/ImageApp_ntdlhd_fga1fc.png" alt="img_logo" className="w-1/4 rounded-full" />
                            </div>
                        </div>
                        <div className="right-header w-2/6 flex justify-between items-center">
                            <div className="header-login">
                                <button className="btn-1">
                                    Login
                                </button>
                            </div>
                            <div className="header-register">
                                <button className="btn-1">
                                    Register
                                </button>
                            </div>
                            <div className="header-try">
                                <button className="btn-2" onClick={handleTryMeTube}>
                                    Try <span className="underline">MeTube</span>
                                </button>
                            </div>
                        </div>
                    </header>
                </div>
                <div className="screen-smaller-lg mx-10 my-2.5 block lg:hidden">
                    <div className="flex justify-between items-center">
                        <div className="left-header w-2/3 sm:w-1/3 flex justify-between items-center">
                            <div className="header-icon">
                                <img src="https://res.cloudinary.com/dci95w73h/image/upload/v1738316604/OnlVideosViewing/FE/Logo/ImageApp_ntdlhd_fga1fc.png" alt="img_logo" className="w-1/4 rounded-full" />
                            </div>
                        </div>
                        <button type="primary" onClick={showDrawer} className="btn-icon">
                            <MenuFoldOutlined className="sm:text-2xl" />
                        </button>
                    </div>
                    <Drawer title="Header" onClose={onClose} open={open} width={165}>
                        <div className="grid grid-rows-3 gap-2">
                            <div className="header-login">
                                <button className="btn-1">
                                    Login
                                </button>
                            </div>
                            <div className="header-register">
                                <button className="btn-1">
                                    Register
                                </button>
                            </div>
                            <div className="header-try">
                                <button className="btn-2" onClick={handleTryMeTube}>
                                    Try <span className="underline">MeTube</span>
                                </button>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    )
}

export default HeaderOpening