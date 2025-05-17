import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { CaretRightOutlined, MoreOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Popover } from "antd";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle, IoMdArrowDropright } from "react-icons/io";
import { MdOutlineArrowRight } from "react-icons/md";
import ButtonViewAll from '../../../../components/UserPages/ButtonViewAll';
import { TbPointFilled } from "react-icons/tb";

const VideosForEveryone = ({ nameChannel, videosForEveryone, formatNumber, formatTimeAgo, formatVideoDuration }) => {

    // console.log("videosForEveryone", videosForEveryone);

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
        slidesToShow: 5,
        slidesToScroll: 5,
        arrows: false,
        afterChange: (index) => setCurrentSlide(index),
        responsive: [
            {
                breakpoint: 1920,
                settings: { slidesToShow: 5, slidesToScroll: 5 },
            },
            {
                breakpoint: 1536,
                settings: { slidesToShow: 4, slidesToScroll: 4 },
            },
            {
                breakpoint: 1280,
                settings: { slidesToShow: 4, slidesToScroll: 4 },
            },
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
        <div className="">
            <div className="flex items-center gap-4 md:px-4">
                <div className="mx-2.5 mb-1">
                    <h2 className="text-xl font-semibold">Videos for everyone</h2>
                    <p className="text-sm font-normal">Videos for everyone of this channel.</p>
                </div>
                <ButtonViewAll nameChannel={nameChannel}/>
            </div>
            <div className="relative hidden sm:block sm:w-[calc(60rem-25rem)] md:w-[calc(64rem-25rem)] lg:w-[calc(80rem-25rem)] 2xl:w-[calc(100rem-25rem)] mx-0">
                <div className="w-full overflow-hidden">
                    {/* Nút Prev - Ẩn khi currentSlide === 0 */}
                    {currentSlide > 0 && (
                        <button onClick={() => sliderRef.current?.slickPrev()} className="absolute -left-2 top-1/3 z-10 text-3xl theme-text-first opacity-90 duration-300 ease-in-out">
                            <IoIosArrowDropleftCircle />
                        </button>
                    )}

                    <Slider ref={sliderRef} {...settings}>
                        {videosForEveryone.map((video) => (
                            <div className="p-2" key={video._id}>
                                <NavLink to={`/video-viewing/${video._id}`}>
                                    <div className="video-item border-0.5 rounded-xl theme-first">
                                        <div className="video-item__image">
                                            <div className="relative">
                                                <div className="w-full h-40 rounded-l-xl rounded-tr-xl overflow-hidden">
                                                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover hover:scale-105 duration-300 ease-in-out" />
                                                </div>
                                                <p className="absolute top-1/16 right-1/16 theme-first rounded-full px-2 py-1 text-xs">{formatVideoDuration(video.duration)}</p>
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
                                                        <p className="font-medium text-sm">{formatTimeAgo(video.createdAt)}</p>
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
            </div>
            <div className="block sm:hidden">
                {videosForEveryone.map((video) => (
                    <div className="p-2" key={video._id}>
                        <NavLink to={`/video-viewing/${video._id}`}>
                            <div className="video-item border-0.5 theme-first rounded-2xl">
                                <div className="video-item__image">
                                    <div className="relative">
                                        <img src={video.thumbnail} alt="" className="rounded-t-xl w-full h-52 object-cover" />
                                        <p className="absolute top-1/16 right-1/16 theme-first rounded-full px-2 py-1 text-xs">{formatVideoDuration(video.duration)}</p>
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
                                                <p className="font-medium text-sm">{formatTimeAgo(video.createdAt)}</p>
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

export default VideosForEveryone;