import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        const baseURL = import.meta.env.VITE_BACKEND_BASEURL;
        window.open(`${baseURL}/auth/google`, "_self");
    };

    return (
        <div>
            <button className="btn-1" onClick={handleLogin}>Google</button>
        </div>
    );
};

export default LoginPage;