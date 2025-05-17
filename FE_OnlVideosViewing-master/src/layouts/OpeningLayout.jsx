import React, { useContext } from "react";

import HeaderOpening from "../components/OpeningPage/HeaderOpening";
import FooterOpening from "../components/OpeningPage/FooterOpening";
import BodyOpeningPage from "../pages/OpeningPage/BodyOpeningPage";

import { ThemeContext } from "../services/ThemeContext";

const OpeningLayout = () => {

    const { theme } = useContext(ThemeContext);

    return (
        <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <HeaderOpening />
            <BodyOpeningPage />
            <div className="lines"></div>
            <FooterOpening />
        </div>
    );
};

export default OpeningLayout;