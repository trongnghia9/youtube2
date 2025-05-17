import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BodyOpeningPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const [displayText, setDisplayText] = useState("");
    const textRef = useRef(0);
    const isTextLoadedRef = useRef(false);

    const description = `MeTube is an online video platform where people can watch, share, and create videos. It has a huge collection of videos, including music, tutorials, entertainment, and more. Users can find videos on almost any topic and connect with others by liking, commenting, and subscribing to channels. MeTube makes it easy for everyone to enjoy and share content from around the world.`;

    useEffect(() => {
        if (isTextLoadedRef.current) return;

        setIsVisible(true);

        const interval = setInterval(() => {
            const currentIndex = textRef.current;
            if (currentIndex < description.length) {
                textRef.current = currentIndex + 1;
                setDisplayText(description.substring(0, textRef.current));
            } else {
                clearInterval(interval);
                isTextLoadedRef.current = true;
            }
        }, 30);

        return () => clearInterval(interval);
    }, []);

    // Hàm làm nổi bật từ "MeTube" trong văn bản
    const highlightMeTube = (text) => {
        const parts = text.split("MeTube"); // Tách văn bản thành 2 phần (trước và sau "MeTube")
        return parts.map((part, index) => {
            if (index === 0) {
                // Nếu là phần đầu tiên thì chỉ trả về đoạn văn bản trước "MeTube"
                return <span key={`part-${index}`}>{part}</span>;
            } else {
                // Nếu là phần sau "MeTube", thêm "MeTube" vào và làm nổi bật
                return (
                    <span key={`part-${index}`} className="theme-text-first">
                        <span className="theme-text-fourth font-medium">MeTube</span>
                        {part}
                    </span>
                );
            }
        });
    };

    const handleTryMeTube = () => {
        navigate("/");
    }

    return (
        <div className="theme-second flex-grow overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="p-2.5 sm:p-10 md:p-15 lg:p-20 flex flex-col-reverse lg:flex-row justify-center items-center">
                    <div className="body-content-left sm:w-11/12 lg:w-1/2 px-5 sm:px-0 mb-5 lg:mb-0">
                        <div className={`body-content-left__title transition-all duration-1500 ease-out 
                            ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`}>
                            <h1 className="theme-text-third text-2xl sm:text-4xl font-medium underline">Introducing MeTube</h1>
                        </div>
                        <div className="body-content-left__description lg:w-4/5 my-4 ml-0.5">
                            <p className="text-firstColor">
                                {highlightMeTube(displayText)}
                            </p>
                        </div>
                        <div className={`body-content-left__btn-interactive ml-0.5 flex transition-all duration-2500 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`}>
                            <div className="btn-try">
                                <button className="btn-2" onClick={handleTryMeTube}>Try MeTube</button>
                            </div>
                            <div className="btn-aboutUs ml-2">
                                <button className="btn-3">About Us</button>
                            </div>
                        </div>
                    </div>
                    <div className={`body-content-right w-11/12 lg:w-1/2 mb-5 lg:mb-0 transition-all duration-1500 ease-out
                        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}>
                        <div className="body-content-right__video">
                            <img
                                src="https://res.cloudinary.com/dci95w73h/image/upload/v1737475486/OnlVideosViewing/FE/Background/Metube_kt7up2.gif"
                                alt="intro_img"
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyOpeningPage;
