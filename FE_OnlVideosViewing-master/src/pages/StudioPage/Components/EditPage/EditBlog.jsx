import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiMiniSlash } from "react-icons/hi2";
import { TfiControlBackward } from "react-icons/tfi";
import { NavLink, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { MdLock, MdPublic } from "react-icons/md";
import { FaRegCopy, FaSpinner } from "react-icons/fa";
import Dropdown from "../../../../components/StudioPage/Dropdown";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import MultiselectDropdown from "../../../../components/StudioPage/MultiselectDropdown";
import { editBlog, getBlogInfo } from "../../../../redux/reducers/blogReducer";
import { getSignature, uploadSingleFile } from "../../../../redux/reducers/videoReducer";

const EditBlog = () => {

    const dispatch = useDispatch();
    const { blogId } = useParams();
    const navigate = useNavigate();
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    const userEmail = userInfo?.email;

    const { selectedBlog } = useSelector((state) => state.blog);

    const origin = window.location.origin;
    const linkBlog = `${origin}/${userEmail}/profile/blog-detail/${blogId}`;

    useEffect(() => {
        if (blogId) {
            dispatch(getBlogInfo(blogId));
        }
    }, [blogId, dispatch]);

    const [isUploading, setIsUploading] = useState(false);

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
    const [copyMessage, setCopyMessage] = useState("");

    const handleCopyLink = (event) => {
        event.preventDefault();

        navigator.clipboard.writeText(linkBlog)
            .then(() => {
                setCopyMessage("Link copied!");
                setTimeout(() => setCopyMessage(""), 2000);
            })
            .catch(err => console.error("Failed to copy:", err));
    };

    const maxTitle = 75;
    const maxContent = 500;

    const [titleLength, setTitleLength] = useState(0);
    const [contentLength, setContentLength] = useState(0);
    const [previewImage, setPreviewImage] = useState([]);

    const handleInputChange = (e, field, maxLength, setLength) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setLength(value.length);
            formik.setFieldValue(field, value);
        }
    };

    const handleCategoryChange = (val) => {
        setValueCategories(val);
        formik.setFieldValue("valueCategories", val);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = [...formik.values.blogImgs, ...files];

        if (newFiles.length > 3) {
            showNotification("error", "Lỗi", "Chỉ được chọn tối đa 3 ảnh!");
            return;
        }

        // Kiểm tra kích thước từng ảnh
        const invalidFiles = files.filter(file => file.size > 6 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            showNotification("warning", "Warning", "One or more images exceed 6MB.");
            return;
        }

        const newImages = files.map(file => URL.createObjectURL(file));
        setPreviewImage(prevImages => [...prevImages, ...newImages]);
        formik.setFieldValue("blogImgs", [...(formik.values.blogImgs || []), ...files]);
    };

    const handleRemoveImage = (index) => {
        setPreviewImage(prevImages => prevImages.filter((_, i) => i !== index));
        formik.setFieldValue("blogImgs", (formik.values.blogImgs || []).filter((_, i) => i !== index));
    };

    const initialFormValues = {
        title: selectedBlog?.title || '',
        content: selectedBlog?.content || '',
        blogImgs: selectedBlog?.blogImgs || [],
        valueCategories: selectedBlog?.categories || [],
    };

    const validationSchema = Yup.object({
        title: Yup.string()
            .max(maxTitle, `Title cannot exceed ${maxTitle} characters`)
            .required("Title is required"),
        content: Yup.string()
            .max(maxContent, `Content cannot exceed ${maxContent} characters`)
            .required("Content is required"),
        blogImgs: Yup.array()
            .min(1, "At least 1 image is required")
            .max(3, "You can upload up to 3 images"),
        // .nullable(),
        valueCategories: Yup.array()
            .of(Yup.string())
            .min(1, "Phải chọn ít nhất một danh mục")
            .required("Bắt buộc chọn danh mục"),
    });

    const formik = useFormik({
        initialValues: initialFormValues,
        enableReinitialize: true,
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await handleEditBlog(values);
            } catch (err) {
                console.error(err);
            }
        }
    });

    useEffect(() => {
        if (selectedBlog) {
            // Update display mode
            setValueDisplayMode(selectedBlog.isPrivate
                ? optionDisplayMode.find(option => option.value === 'Private')
                : optionDisplayMode.find(option => option.value === 'Public')
            );

            formik.setValues(initialFormValues);

            setTitleLength(selectedBlog.title?.length || 0);
            setContentLength(selectedBlog.content?.length || 0);

            // setValueCategories(selectedBlog.categories || []);

            if (selectedBlog.categories && selectedBlog.categories.length > 0) {
                setValueCategories(selectedBlog.categories);

                // console.log("selectedBlog.categories", selectedBlog.categories);
            }

            if (selectedBlog.blogImgs && selectedBlog.blogImgs.length > 0) {
                setPreviewImage(selectedBlog.blogImgs);
            }
        }
    }, [selectedBlog]);

    const handleEditBlog = async (values) => {
        setIsUploading(true);

        const { title, content, blogImgs, valueCategories } = values;

        const isPrivate = valueDisplayMode?.value === 'Private' ? true : false;

        try {
            let blogImgsUrl = [];

            for (let file of blogImgs) {
                if (typeof file === 'string') {
                    blogImgsUrl.push(file);
                    // console.log("Giữ nguyên!!");
                } else {
                    const signatureImg = await dispatch(getSignature("OnlVideosViewing/BE/blogs")).unwrap();
                    const uploaded = await dispatch(uploadSingleFile({
                        file,
                        folder: "OnlVideosViewing/BE/blogs",
                        resourceType: "image",
                        signatureData: signatureImg,
                    })).unwrap();
                    blogImgsUrl.push(uploaded);

                    // console.log("Upload image!!");
                }
            }

            const metadata = {
                blogId: selectedBlog._id,
                title,
                content,
                blogImgs: blogImgsUrl || undefined,
                categories: valueCategories,
                isPrivate,
            };

            // console.log("metadata", metadata);

            await dispatch(editBlog({ blogId, metadata })).unwrap();
            showNotification("success", "Blog edited successfully!", "Congratulations on successfully editing your Blog!!");
            navigate("/studio/content-management/blogs");
        } catch (error) {
            console.error("❌ Lỗi khi upload hoặc lưu metadata:", error);
            showNotification("error", "Lỗi khi upload hoặc lưu metadata", error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <div className="title flex items-center gap-1.5">
                <NavLink to={`/studio/content-management/blogs`} className="font-semibold flex items-center gap-1 hover:text-fourthColor"><TfiControlBackward className="size-4" /> <span className="text-xs">Blogs List</span></NavLink>
                <span> <HiMiniSlash /> </span>
                <p className="text-xs font-semibold">Blog Edit</p>
            </div>
            <div className="content-edit my-5">
                <form onSubmit={formik.handleSubmit} action="" className="border-1.5 theme-border py-2.5 px-3 rounded-xl flex flex-col-reverse gap-2">
                    <div className="flex items-start gap-4 my-2">
                        <div className="form-left w-3/5 flex flex-col justify-center gap-1 mt-0.5">
                            <div className="title-blog relative bg-inherit">
                                <input
                                    type="text"
                                    name="title"
                                    className={`peer form-edit h-10 ${formik.touched.title && formik.errors.title ? "ring-red-500 focus:ring-red-500" : theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"}`}
                                    placeholder="Name"
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title}
                                    onChange={(e) => handleInputChange(e, "title", maxTitle, setTitleLength)}
                                />
                                <label
                                    htmlFor="title"
                                    className={`label-edit theme-bg-first peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 ${formik.touched.title && formik.errors.title ? "peer-placeholder-shown:text-red-500" : "peer-placeholder-shown:theme-text-first"}`}
                                >Title</label>
                                <div className="flex items-center justify-between h-6 mt-1">
                                    <div className="">
                                        {formik.touched.title && formik.errors.title && (
                                            <p className="text-red-500 text-xs">{formik.errors.title}</p>
                                        )}
                                    </div>
                                    <p className={`text-xs ${titleLength >= maxTitle ? "text-red-500" : ""}`}>
                                        {titleLength}/{maxTitle}
                                    </p>
                                </div>
                            </div>

                            <div className="content-blog relative bg-inherit">
                                <textarea
                                    type="text"
                                    id="content"
                                    name="content"
                                    className={`peer form-edit px-3 py-1.5 h-32 overflow-y-auto ${formik.touched.content && formik.errors.content ? "ring-red-500 focus:ring-red-500" : theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"}`}
                                    placeholder="Content"
                                    onBlur={formik.handleBlur}
                                    value={formik.values.content}
                                    onChange={(e) => handleInputChange(e, "content", maxContent, setContentLength)}
                                />
                                <label
                                    htmlFor="content"
                                    className={`label-edit theme-bg-first peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 ${formik.touched.content && formik.errors.content ? "peer-placeholder-shown:text-red-500" : "peer-placeholder-shown:theme-text-first"}`}
                                >Content</label>
                                <div className="flex items-center justify-between h-6">
                                    <div className="">
                                        {formik.touched.content && formik.errors.content && (
                                            <p className="text-red-500 text-xs">{formik.errors.content}</p>
                                        )}
                                    </div>
                                    <p className={`text-xs ${contentLength >= maxContent} ? "text-red-500" : ""}`}>
                                        {contentLength}/{maxContent}
                                    </p>
                                </div>
                            </div>

                            <div className="blog-images mb-2">
                                <div className="border-1.5 flex flex-col theme-border rounded-md px-2.5 py-2">
                                    <div className="flex items-center justify-between">
                                        <div className="">
                                            <label htmlFor="image" className="ml-0.25 font-semibold text-sm">Image</label>
                                            <p className="text-xs">Blog image là hình ảnh tĩnh đại diện cho blog. Max size: 6 MB</p>
                                        </div>
                                        <label htmlFor="image" className="cursor-pointer btn-1 px-2.5 py-2 text-xs font-medium">
                                            Choose Image
                                        </label>
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <div className="flex flex-wrap gap-3 mt-1">
                                        {previewImage.map((img, index) => (
                                            <div key={index} className="relative w-fit mt-1.5">
                                                <img
                                                    src={img}
                                                    alt={`preview-${index}`}
                                                    className="w-36 h-24 object-cover rounded-md border shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-700 duration-200"
                                                    title="Remove"
                                                >
                                                    <AiOutlineDelete className="size-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {formik.touched.blogImgs && formik.errors.blogImgs && (
                                        <p className="text-red-500 text-xs mx-0.25 mt-0.5">{formik.errors.blogImgs}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-right w-2/5 flex flex-col justify-center gap-2">
                            <div className="category border-1.5 flex flex-col gap-2 theme-border rounded-md px-2.5 py-2">
                                <div className="ml-0.25">
                                    <label className="text-sm font-semibold">Category</label>
                                    <p className="text-xs">Chọn danh mục phù hợp với bài viết của bạn.</p>
                                </div>
                                <div className="w-5/6">
                                    <MultiselectDropdown
                                        options={optionCategories}
                                        selected={valueCategories}
                                        setSelected={handleCategoryChange}
                                        name="valueCategories"
                                        setFieldValue={formik.setFieldValue}
                                        isEditMode={true}
                                        editValues={selectedBlog?.categories || []}
                                    />

                                    {formik.touched.valueCategories && formik.errors.valueCategories && (
                                        <div className="text-red-500 text-xs mt-1 ml-0.5">{formik.errors.valueCategories}</div>
                                    )}
                                </div>
                            </div>

                            <div className="display-mode border-1.5 flex flex-col gap-2 theme-border rounded-md px-2.5 py-2">
                                <div className="ml-0.25">
                                    <label className="text-sm font-semibold">Display Mode</label>
                                    <p className="text-xs">Chọn hình thức hiển thị cho bài viết.</p>
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
                    <div className="flex justify-between items-center gap-2 border-b-1.5 theme-border pb-2">
                        <div className="border themeBorder rounded-md">
                            <div className="video-link py-1 px-2.5 flex items-center justify-between gap-2">
                                <p className="text-xs font-medium">Link :</p>
                                <div className="flex items-center justify-between gap-0.5">
                                    <a href={linkBlog} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-fourthColor">{linkBlog}</a>
                                    <div className="flex items-center gap-1">
                                        <button onClick={handleCopyLink} type="button" className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><FaRegCopy className="size-4 themeText" /></button>
                                        {copyMessage && <span className="text-green-500 text-xs">{copyMessage}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`btn-1 text-xs px-3 py-2 transition text-white ${isUploading ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <FaSpinner className="animate-spin" />
                                    Editing...
                                </span>
                            ) : (
                                "Edit Blog"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBlog;