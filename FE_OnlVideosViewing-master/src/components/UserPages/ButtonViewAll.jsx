import { CaretRightOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { ThemeContext } from "../../services/ThemeContext";
import { useNavigate } from "react-router-dom";

const ButtonViewAll = ({ nameChannel }) => {

    const { theme } = useContext(ThemeContext);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${nameChannel}/videos`);
    };

    return (
        <div className="">
            <button onClick={handleClick} className={`relative inline-flex items-center justify-center px-3 py-1.5 overflow-hidden font-medium transition duration-300 ease-out border-1.5 rounded-lg shadow-md group ${theme === "dark" ? " text-fifthColor border-fifthColor" : "text-firstColor border-firstColor"}`}>

                <CaretRightOutlined className="text-2xl absolute inset-0 flex items-center justify-center w-full h-full text-fifthColor duration-300 -translate-x-full bg-thirdColor group-hover:translate-x-0 ease" />

                <span className={`absolute flex items-center text-base font-semibold justify-center w-full h-full transition-all duration-300 transform group-hover:translate-x-full ease ${theme === "dark" ? "text-fifthColor" : "text-firstColor"}`}>View All</span> 
                
                <span className="relative text-base font-semibold invisible">View All</span>
            </button>
        </div>
    )
}

export default ButtonViewAll;