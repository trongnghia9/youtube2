import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import ButtonViewAll from "../../../../components/UserPages/ButtonViewAll";
import { TbPointFilled } from "react-icons/tb";
import { formatNumber } from "../../../../utils/formatNumber";

// Danh sách video mẫu
const videos = [
    {
        videoId: "1",
        title: "Cách lập trình Node.js cơ bản",
        url: "https://picsum.photos/id/1/400/300",
        uploader: "Dev Academy",
        avatarUploader: "https://picsum.photos/id/1/50/50",
        views: 15000,
        duration: "15:30",
        uploadDate: "2025-02-10",
    },
    ...Array.from({ length: 4 }, (_, i) => ({
        videoId: `${i + 2}`,
        title: `Video ${i + 2}`,
        url: `https://picsum.photos/id/${i + 2}/400/300`,
        uploader: `Uploader ${i + 2}`,
        avatarUploader: `https://picsum.photos/id/${i + 2}/50/50`,
        views: Math.floor(Math.random() * 50000) + 1000,
        duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(
            Math.random() * 60
        )}`,
        uploadDate: `2025-02-${10 + (i % 20)}`,
    })),
];

const VideosForMembers = () => {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalSlides, setTotalSlides] = useState(1);

    useEffect(() => {
        if (sliderRef.current) {
            setTotalSlides(sliderRef.current.innerSlider.state.slideCount);
        }
    }, []);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        afterChange: (index) => setCurrentSlide(index),
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3, slidesToScroll: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2, slidesToScroll: 2 },
            },
        ],
    };

    return (
        <div className="md:px-4">
            <div className="flex items-center gap-4">
                <div className="mx-2.5 mb-1">
                    <h2 className="text-xl font-semibold">Videos for members</h2>
                    <p className="text-sm font-normal line-clamp-1">Videos for members of this channel.</p>
                </div>
                <ButtonViewAll />
            </div>
            <div className="relative hidden md:block w-[calc(80rem-25rem)]">
                {/* Nút Prev - Ẩn khi currentSlide === 0 */}
                {currentSlide > 0 && (
                    <button onClick={() => sliderRef.current?.slickPrev()} className="absolute -left-2 top-1/3 z-10 text-3xl theme-text-first opacity-90 duration-300 ease-in-out">
                        <IoIosArrowDropleftCircle />
                    </button>
                )}

                <Slider ref={sliderRef} {...settings}>
                    {videos.map((video) => (
                        <div className="p-2" key={video.videoId}>
                            <NavLink to={`/video-viewing/${video.videoId}`}>
                                <div className="video-item theme-first border-0.5 rounded-xl">
                                    <div className="video-item__image">
                                        <div className="relative">
                                            <div className="rounded-l-xl rounded-tr-xl overflow-hidden">
                                                <img src={video.url} alt="" className="w-full h-full object-cover hover:scale-105 duration-300 ease-in-out" /> 
                                            </div>
                                            <p className="absolute top-1/16 right-1/16 theme-first rounded-full px-2 py-1 text-xs">{video.duration}</p>
                                        </div>
                                    </div>
                                    <div className="video-item__body px-3.5 pb-2.5">
                                        <div className="flex items-baseline justify-between">
                                            <div className="video-item__title mt-1.5">
                                                <p className="font-semibold text-xl line-clamp-1">
                                                    {video.title}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="video-item__info">
                                            <div className="flex justify-start items-baseline gap-2 my-0.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="video-item__views">
                                                        <p className="font-medium">{formatNumber(video.views)} <span className="text-sm font-normal">views</span></p>
                                                    </div>
                                                </div>
                                                <TbPointFilled className="text-ls" />
                                                <div className="video-item__upload-date">
                                                    <p className="font-medium text-sm">{video.uploadDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    ))}
                </Slider>

                {/* Nút Next - Ẩn khi currentSlide đã đến cuối */}
                {currentSlide + settings.slidesToShow < totalSlides && (
                    <button onClick={() => sliderRef.current?.slickNext()} className="absolute -right-2.5 top-1/3 z-10 text-3xl theme-text-first opacity-90 duration-300 ease-in-out"> 
                        <IoIosArrowDroprightCircle />
                    </button>
                )}
            </div>
            <div className="block md:hidden">
                {videos.map((video) => (
                    <div className="p-2" key={video.videoId}>
                        <NavLink to={`/video-viewing/${video.videoId}`}>
                            <div className="video-item border-0.5 theme-first rounded-2xl">
                                <div className="video-item__image">
                                    <div className="relative">
                                        <img src={video.url} alt="" className="rounded-t-xl w-full h-52 object-cover" />
                                        <p className="absolute top-1/16 right-1/16 theme-first rounded-full px-2 py-1 text-xs">{video.duration}</p>
                                    </div>
                                </div>
                                <div className="video-item__body px-3.5 pb-2.5">
                                    <div className="flex items-baseline justify-between">
                                        <div className="video-item__title mt-1.5">
                                            <p className="font-semibold text-xl line-clamp-1">
                                                {video.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="video-item__info">
                                        <div className="flex justify-start items-baseline gap-2 my-0.5">
                                            <div className="flex items-center gap-2">
                                                <div className="video-item__views">
                                                    <p className="font-medium">{video.views} <span className="text-sm font-normal">views</span></p>
                                                </div>
                                            </div>
                                            <TbPointFilled className="text-ls" />
                                            <div className="video-item__upload-date">
                                                <p className="font-medium text-sm">{video.uploadDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideosForMembers;
