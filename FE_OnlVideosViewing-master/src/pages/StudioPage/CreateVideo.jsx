import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dropdown from "../../components/StudioPage/Dropdown";
import { MdLock, MdPublic } from "react-icons/md";
import { FaRegCopy, FaSpinner } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

import {
    getSignature,
    uploadSingleFile,
    uploadVideoToBackend,
    getSlicedParts,
    uploadSlicedVideos,
    saveVideoMetadata,
    uploadLargeVideo,
    deleteFolder,
    setUploadProgress,
} from "../../redux/reducers/videoReducer";

import { addVideoToPlaylist, getPlaylistByUserId } from "../../redux/reducers/playlistReducer";

import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import UploadModal from "../../components/StudioPage/UploadModal";
import MultiselectDropdown from "../../components/StudioPage/MultiselectDropdown";

const CreateVideo = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    const channelId = userInfo?.channel?._id;
    // console.log(channelId);

    const dispatch = useDispatch();

    const { playlists, loading, error } = useSelector((state) => state.playlist);

    // console.log(playlists);

    useEffect(() => {
        if (channelId) {
            dispatch(getPlaylistByUserId(channelId));
        }
    }, [channelId, dispatch]);

    const optionPlayLists = playlists?.map((playlist) => ({
        label: playlist.titlePlaylist,
        value: playlist._id,
    })) || [];

    const [valuePlayLists, setValuePlayLists] = useState([]);

    // Select Category
    const optionCategories = [
        { label: "Game", value: "Game" },
        { label: "Education", value: "Education" },
        { label: "Music", value: "Music" },
        { label: "News", value: "News" },
        { label: "Sport", value: "Sport" },
        { label: "Travel", value: "Travel" },
        { label: "Film", value: "Film" },
    ];

    const [valueCategories, setValueCategories] = useState([]);

    // Select Display Mode
    const optionDisplayMode = [
        {
            icon: <MdPublic className="size-5 themeText" />,
            label: 'Public',
            value: 'Public',
        },
        {
            icon: <MdLock className="size-5 themeText" />,
            label: 'Private',
            value: 'Private',
        }
    ]

    const [valueDisplayMode, setValueDisplayMode] = useState({
        label: 'Public',
        value: 'Public',
        icon: <MdPublic className="size-5 themeText" />
    });

    // Function Copy
    // const [copyMessage, setCopyMessage] = useState("");

    // const handleCopyLink = (event) => {
    //     event.preventDefault();

    //     navigator.clipboard.writeText(linkVideo)
    //         .then(() => {
    //             setCopyMessage("Link copied!");
    //             setTimeout(() => setCopyMessage(""), 2000);
    //         })
    //         .catch(err => console.error("Failed to copy:", err));
    // };

    const maxTitle = 75;
    const maxDescription = 200;

    const [titleLength, setTitleLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);

    const [previewImage, setPreviewImage] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [videoName, setVideoName] = useState("");

    const getVideoDuration = (file) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                const roundedDuration = Math.floor(video.duration); // làm tròn xuống
                resolve(roundedDuration);
            };

            video.onerror = () => {
                reject("Không thể lấy thời lượng video");
            };

            video.src = URL.createObjectURL(file);
        });
    };

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
        video: Yup.mixed()
            .required('Vui lòng chọn video')
            .test(
                'fileSize',
                'Video phải nhỏ hơn 500MB',
                (value) => value && value.size <= 500 * 1024 * 1024
            )
            .test(
                'fileFormat',
                'Định dạng video không hợp lệ',
                (value) => value && ['video/mp4', 'video/webm', 'video/ogg'].includes(value.type)
            ),
        valueCategories: Yup.array()
            .of(Yup.string())
            .min(1, "Phải chọn ít nhất một danh mục")
            .required("Bắt buộc chọn danh mục"),
        valuePlayLists: Yup.array()
            .of(Yup.string())
            .test('max-playlists', 'Chỉ có thể chọn tối đa 1 playlist', (value) => value.length <= 1)
            .nullable(),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            image: null,
            video: null,
            valueCategories: [],
            valuePlayLists: [],
        },
        validationSchema,
        validateOnChange: true,  // Kiểm tra lỗi ngay khi nhập
        validateOnBlur: true,    // Kiểm tra lỗi khi rời khỏi ô nhập
        onSubmit: async (values) => {
            try {
                const duration = await getVideoDuration(values.video);
                await handleUpload(values, duration);
            } catch (err) {
                console.error("Lỗi lấy duration:", err);
            }
        }
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

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue("video", file);
            setPreviewVideo(URL.createObjectURL(file));
            setVideoName(file.name);
        }
    };

    const handleCategoryChange = (val) => {
        setValueCategories(val);
        formik.setFieldValue("valueCategories", val);
    };

    const handlePlaylistsChange = (val) => {
        setValuePlayLists(val);
        formik.setFieldValue("valuePlayLists", val);

        if (val.length > 1) {
            formik.setFieldError("valuePlayLists", "Chỉ có thể chọn tối đa 1 playlist");
        } else {
            formik.setFieldError("valuePlayLists", null);
        }
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (values, duration) => {
        setIsUploading(true);
        setIsModalOpen(true);
        dispatch(setUploadProgress(0));

        const { video, image, title, description, valueCategories, valuePlayLists } = values;

        const isPrivate = valueDisplayMode?.value === 'Private' ? true : false;

        try {
            if (!video) { showNotification('error', 'No Video', "You have not selected a video, please check"); return; }

            let thumbnailUrl = "";

            if (image) {
                const signatureImg = await dispatch(getSignature("OnlVideosViewing/BE/thumbnails/video")).unwrap();
                thumbnailUrl = await dispatch(
                    uploadSingleFile({
                        file: image,
                        folder: "OnlVideosViewing/BE/thumbnails/video",
                        resourceType: "image",
                        signatureData: signatureImg,
                    })
                ).unwrap();
            }

            const sizeMB = video.size / (1024 * 1024);
            let videoUrls = [];
            let folder = "";

            if (sizeMB < 25) {
                const signatureVideo = await dispatch(getSignature("OnlVideosViewing/BE/videos")).unwrap();
                const videoUrl = await dispatch(
                    uploadSingleFile({
                        file: video,
                        folder: "OnlVideosViewing/BE/videos",
                        resourceType: "video",
                        signatureData: signatureVideo,
                    })
                ).unwrap();
                videoUrls = [videoUrl];
            } else if (sizeMB < 100) {
                const result = await dispatch(uploadLargeVideo({ file: video })).unwrap();

                if (result) { videoUrls = [result]; }
                else { throw new Error("❌ Không nhận được secure_url từ uploadLargeVideo"); }
            } else {
                const slicedRes = await dispatch(uploadVideoToBackend({ file: video })).unwrap();
                folder = slicedRes.folder;

                const filenames = await dispatch(getSlicedParts({ folder, savedName: slicedRes.savedName, })).unwrap();

                videoUrls = await dispatch(uploadSlicedVideos({ folder, filenames, })).unwrap();
            }

            const metadata = {
                channelId,
                title,
                description,
                videoUrls,
                thumbnailUrl,
                duration,
                categories: valueCategories,
                playlists: valuePlayLists,
                isPrivate,
            };

            const savedVideo = await dispatch(saveVideoMetadata(metadata)).unwrap();
            const videoId = savedVideo.video._id;

            if (folder) { await dispatch(deleteFolder(folder)).unwrap(); }

            if (valuePlayLists && videoId) {
                dispatch(addVideoToPlaylist({ playlistId: valuePlayLists, videoId }));
            }

            showNotification("success", "Video uploaded successfully", "The video has been uploaded successfully.");
        } catch (error) {
            console.error("❌ Lỗi khi upload hoặc lưu metadata:", error);
            showNotification("error", "Lỗi khi upload hoặc lưu metadata", error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="m-2">
            <div className="theme-first rounded-lg p-2 flex flex-col">
                <div className="title mx-2 border-b-1.5 theme-border">
                    <p className="text-xl font-semibold">Create Video</p>
                </div>

                <body className="my-5 mx-2">
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
                                    <div className="w-4/5">
                                        <div className="w-3/4">
                                            <MultiselectDropdown
                                                options={optionPlayLists}
                                                selected={valuePlayLists}
                                                setSelected={handlePlaylistsChange}
                                                name="valuePlayLists"
                                                setFieldValue={formik.setFieldValue}
                                            />
                                        </div>

                                        {formik.touched.valuePlayLists && formik.errors.valuePlayLists && (
                                            <div className="text-red-500 text-xs mt-1 ml-0.5">{formik.errors.valuePlayLists}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-right w-2/5 flex flex-col justify-center gap-4">
                                <div className="video border-1.5 flex flex-col theme-border rounded-lg px-2.5 pt-2 pb-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="w-2/3">
                                            <label htmlFor="video" className="ml-0.25 font-semibold text-sm">Video</label>
                                            <p className="text-xs">Max size: 500 MB</p>
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
                                        onChange={handleVideoChange}
                                    />

                                    {previewVideo && (
                                        <div className="flex flex-col border-1.5 theme-border rounded-lg shadow-md my-2">
                                            <video key={previewVideo} controls className="w-full h-full rounded-t-md">
                                                <source src={previewVideo} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <div className="p-2.5">
                                                {videoName && (
                                                    <div className="flex flex-col gap-0.25">
                                                        <p className="text-sm font-medium">Selected file</p>
                                                        <span className="text-xs font-normal">{videoName}</span>
                                                    </div>
                                                )}
                                                {/* <div className="video-link flex flex-col py-2">
                                                    <p className="text-sm font-medium">Đường liên kết của video</p>
                                                    <div className="flex items-center justify-between">
                                                        <a href={linkVideo} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-fourthColor">{linkVideo}</a>
                                                        <div className="flex items-center gap-1">
                                                            {copyMessage && <span className="text-green-500 text-xs">{copyMessage}</span>}
                                                            <button onClick={handleCopyLink} type="button" className="p-1 hover:bg-fourthColor rounded-md hover:duration-300"><FaRegCopy className="size-3.5 themeText" /></button>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    )}


                                    {formik.touched.video && formik.errors.video && (
                                        <p className="text-red-500 text-xs ml-0.5 mt-0.5">{formik.errors.video}</p>
                                    )}
                                </div>

                                <div className="category border-1.5 flex flex-col gap-2 theme-border rounded-md px-2.5 py-2">
                                    <div className="ml-0.25">
                                        <label className="text-sm font-semibold">Category</label>
                                    </div>
                                    <div className="w-5/6">
                                        <MultiselectDropdown
                                            options={optionCategories}
                                            selected={valueCategories}
                                            setSelected={handleCategoryChange}
                                            name="valueCategories"
                                            setFieldValue={formik.setFieldValue}
                                        />

                                        {formik.touched.valueCategories && formik.errors.valueCategories && (
                                            <div className="text-red-500 text-xs mt-1 ml-0.5">{formik.errors.valueCategories}</div>
                                        )}
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
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`btn-1 text-xs px-3 py-2 transition text-white ${isUploading ? "cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {isUploading ? (
                                    <span className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin" />
                                        Uploading...
                                    </span>
                                ) : (
                                    "Upload Video"
                                )}
                            </button>
                        </div>
                    </form>
                </body>
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message="Video đã được tải lên thành công!"
            />
        </div>
    );
}

export default CreateVideo;