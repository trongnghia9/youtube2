import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiMiniSlash } from "react-icons/hi2";
import { IoPlayBackOutline, IoReturnDownBack, IoReturnDownBackSharp } from "react-icons/io5";
import { TfiControlBackward } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../../../services/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdLock, MdPublic } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import Dropdown from "../../../../components/StudioPage/Dropdown";
import { AiOutlineDelete } from "react-icons/ai";

const videoUrlCloudinary = `https://res.cloudinary.com/dci95w73h/video/upload/v1741158983/videos/ysuluqc1mx77nqdtybvh.mp4`;
const linkVideo = `http://localhost:5173/video-viewing/2`;

const EditVideo = () => {

    const { theme } = useContext(ThemeContext);

    // Select Playlist
    const optionPlayLists = [
        {
            value: 'Music'
        },
        {
            value: 'Film'
        },
        {
            value: 'Game'
        }
    ]

    const [valuePlayLists, setValuePlayLists] = useState(null);

    // Select Display Mode
    const optionDisplayMode = [
        {
            icon: <MdPublic className="size-5 themeText" />,
            value: 'Public',
        },
        {
            icon: <MdLock className="size-5 themeText" />,
            value: 'Private',
        }
    ]

    const [valueDisplayMode, setValueDisplayMode] = useState(null);

    // Function Copy
    const [copyMessage, setCopyMessage] = useState("");

    const handleCopyLink = (event) => {
        event.preventDefault();

        navigator.clipboard.writeText(linkVideo)
            .then(() => {
                setCopyMessage("Link copied!");
                setTimeout(() => setCopyMessage(""), 2000);
            })
            .catch(err => console.error("Failed to copy:", err));
    };

    const maxTitle = 75;
    const maxDescription = 200;

    const [titleLength, setTitleLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);

    const [previewImage, setPreviewImage] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [videoName, setVideoName] = useState("");

    const validationSchema = Yup.object({
        title: Yup.string()
            .max(75, "Title cannot exceed 75 characters")
            .required("Title is required"),
        description: Yup.string()
            .max(400, "Description cannot exceed 400 characters")
            .required("Description is required"),
        image: Yup.mixed()
            .test("fileSize", "Image size must be less than 6MB", (file) => {
                return file ? file.size <= 6 * 1024 * 1024 : true;
            }),
        // video: Yup.mixed()
        //     .test("fileSize", "Video size must be less than 100MB", (file) => {
        //         return file ? file.size <= 100 * 1024 * 1024 : true;
        //     }),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            image: null,
            video: null,
        },
        validationSchema,
        validateOnChange: true,  // Kiểm tra lỗi ngay khi nhập
        validateOnBlur: true,    // Kiểm tra lỗi khi rời khỏi ô nhập
        onSubmit: (values) => {
            console.log("Form Data:", values);
        },
    });

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitleLength(value.length);
        formik.setFieldValue("title", value);
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescriptionLength(value.length);
        formik.setFieldValue("description", value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue("image", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue("image", null);
        setPreviewImage(null);
    };

    // const handleVideoChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         formik.setFieldValue("video", file);
    //         setPreviewVideo(URL.createObjectURL(file));
    //         setVideoName(file.name);
    //     }
    // };

    return (
        <div>
            <div className="title flex items-center gap-1.5">
                <NavLink to={`/studio/content-management/videos`} className="font-semibold flex items-center gap-1 hover:text-fourthColor"><TfiControlBackward className="size-4" /> <span className="text-xs">Videos List</span></NavLink>
                <span> <HiMiniSlash /> </span>
                <p className="text-xs font-semibold">Video Edit</p>
            </div>
            <div className="content-edit my-5">
                <form onSubmit={formik.handleSubmit} className="border-1.5 theme-border p-2.5 rounded-xl flex flex-col-reverse gap-2">
                    <div className="flex items-start gap-4 my-2">

                        <div className="form-left w-3/5 flex flex-col justify-center gap-2">
                            <div className="title relative bg-inherit">
                                <textarea
                                    type="text"
                                    name="title"
                                    className={`peer form-edit px-3 py-1.5 h-14 overflow-y-auto ${theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"}`}
                                    placeholder="Title"
                                    onChange={handleTitleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title}
                                />
                                <label
                                    htmlFor="title"
                                    className={`label-edit peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-placeholder-shown:theme-text-first peer-placeholder-shown:theme-bg-first peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 theme-first peer-focus:theme-text-first peer-focus:theme-bg-first`}
                                >Title</label>
                                <div className="flex items-center justify-between h-6">
                                    <div className="">
                                        {formik.touched.title && formik.errors.title && (
                                            <p className="text-red-500 text-xs">{formik.errors.title}</p>
                                        )}
                                    </div>
                                    <p className="text-xs">
                                        {titleLength}/{maxTitle}
                                    </p>
                                </div>
                            </div>

                            <div className="description relative bg-inherit">
                                <textarea
                                    type="text"
                                    id="description"
                                    name="description"
                                    className={`peer form-edit px-3 py-1.5 h-32 overflow-y-auto ${theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"}`}
                                    placeholder="Description"
                                    onChange={handleDescriptionChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                />
                                <label
                                    htmlFor="description"
                                    className={`label-edit peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-placeholder-shown:theme-text-first peer-placeholder-shown:theme-bg-first peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 theme-first peer-focus:theme-text-first peer-focus:theme-bg-first`}
                                >Description</label>
                                <div className="flex items-center justify-between h-6">
                                    <div className="">
                                        {formik.touched.description && formik.errors.description && (
                                            <p className="text-red-500 text-xs">{formik.errors.description}</p>
                                        )}
                                    </div>
                                    <p className="text-xs">
                                        {descriptionLength}/{maxDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="thumbnail mb-2">
                                <div className="border-1.5 flex flex-col theme-border rounded-md px-2.5 py-2">
                                    <div className="flex items-center justify-between">
                                        <div className="">
                                            <label htmlFor="image" className="ml-0.25 font-semibold text-sm">Image</label>
                                            <p className="text-xs">Thumbnail là hình ảnh tĩnh đại diện cho video. Max size: 6 MB</p>
                                        </div>
                                        <label htmlFor="image" className="cursor-pointer btn-1 px-2.5 py-2 text-xs font-medium">
                                            Choose Image
                                        </label>
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <div className="flex">
                                        {previewImage && (
                                            <div className="relative w-fit my-1.5">
                                                <img src={previewImage} alt="Preview" className="w-[14.22225rem] h-32 object-cover rounded-md border shadow-sm" />
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-700 duration-200">
                                                    <AiOutlineDelete className="size-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {formik.touched.image && formik.errors.image && (
                                        <p className="text-red-500 text-xs mx-0.25 mt-0.5">{formik.errors.image}</p>
                                    )}
                                </div>
                            </div>

                            <div className="playlists border-1.5 flex flex-col gap-2 theme-border rounded-md px-2.5 py-2">
                                <div className="ml-0.25">
                                    <label htmlFor="" className="text-sm font-semibold">Playlists</label>
                                    <p className="text-xs">Thêm video của bạn vào danh sách phát để sắp xếp nội dung cho người xem</p>
                                </div>
                                <div className="w-1/3">
                                    <Dropdown
                                        options={optionPlayLists}
                                        selected={valuePlayLists}
                                        setSelected={setValuePlayLists}
                                        placeholder="Select Option"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-right w-2/5 flex flex-col justify-center gap-4">
                            <div className="video border-1.5 flex flex-col gap-2 theme-border rounded-lg px-2.5 pt-2 pb-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="w-2/3">
                                        <label htmlFor="video" className="ml-0.25 font-semibold text-sm">Video</label>
                                        <p className="text-xs">Max size: 100 MB</p>
                                    </div>
                                    <div className="w-1/3 text-end">
                                        <label htmlFor="video" className="cursor-pointer btn-1 px-2.5 py-2 text-xs font-medium">
                                            Choose Video
                                        </label>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    accept="video/*"
                                    id="video"
                                    className="hidden"
                                    // onChange={handleVideoChange}
                                />

                                <div className="video border themeBorder rounded-md">
                                    <div className="flex flex-col gap-1">
                                        <video controls className="w-full h-full rounded-t-md">
                                            <source src={videoUrlCloudinary} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <div className="video-link p-2.5">
                                            <p className="text-sm font-medium">Đường liên kết của video</p>
                                            <div className="flex items-center justify-between">
                                                <a href={linkVideo} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-fourthColor">{linkVideo}</a>
                                                <div className="flex items-center gap-1">
                                                    {copyMessage && <span className="text-green-500 text-xs">{copyMessage}</span>}
                                                    <button onClick={handleCopyLink} type="button" className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><FaRegCopy className="size-4 themeText" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="display-mode border-1.5 flex flex-col gap-2 theme-border rounded-md px-2.5 py-2">
                                <div className="ml-0.25">
                                    <label className="text-sm font-semibold">Display Mode</label>
                                </div>
                                <div className="w-2/5">
                                    <Dropdown
                                        options={optionDisplayMode}
                                        selected={valueDisplayMode}
                                        setSelected={setValueDisplayMode}
                                        placeholder="Select Option"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 border-b-1.5 theme-border pb-2">
                        <button type="button" className="btn-2 px-2.5 py-2 text-xs">Cancel Change</button>
                        <button type="submit" className="btn-1 px-2.5 py-2 text-xs">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditVideo;