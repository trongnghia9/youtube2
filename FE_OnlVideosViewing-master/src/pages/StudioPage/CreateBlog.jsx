import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import Dropdown from "../../components/StudioPage/Dropdown";
import { MdLock, MdPublic } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import MultiselectDropdown from "../../components/StudioPage/MultiselectDropdown";
import { createBlog } from "../../redux/reducers/blogReducer";
import { getSignature, uploadSingleFile } from "../../redux/reducers/videoReducer";

const CreateBlog = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    const userId = userInfo?.channel?._id;

    // console.log("userId: ", userId);

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

    const maxTitle = 75;
    const maxContent = 500;

    const [titleLength, setTitleLength] = useState(0);
    const [contentLength, setContentLength] = useState(0);
    const [previewImage, setPreviewImage] = useState([]);

    const validationSchema = Yup.object({
        title: Yup.string()
            .max(maxTitle, `Title cannot exceed ${maxTitle} characters"`)
            .required("Title is required"),
        content: Yup.string()
            .max(maxContent, `Content cannot exceed ${maxContent} characters`)
            .required("Content is required"),
        blogImgs: Yup.array()
            .max(3, "Chỉ được chọn tối đa 3 ảnh")
            .of(
                Yup.mixed()
                    .test("fileSize", "Ảnh phải nhỏ hơn 6MB", (file) => file && file.size <= 6 * 1024 * 1024)
                    .test("fileType", "Chỉ chấp nhận ảnh", (file) => file && file.type.startsWith("image/"))
            ),
        valueCategories: Yup.array()
            .of(Yup.string())
            .min(1, "Phải chọn ít nhất một danh mục")
            .required("Bắt buộc chọn danh mục"),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            blogImgs: [],
            valueCategories: [],
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await handleCreateBlog(values);
            } catch (err) {
                console.error("Lỗi lấy duration:", err);
            }
        }
    });

    const handleInputChange = (e, field, maxLength, setLength) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setLength(value.length);
            formik.setFieldValue(field, value);
        }
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = [...formik.values.blogImgs, ...files];

        if (newFiles.length > 3) {
            showNotification("error", "Lỗi", "Chỉ được chọn tối đa 3 ảnh!");
            return;
        }

        formik.setFieldValue("blogImgs", newFiles);
        setPreviewImage(newFiles.map(file => URL.createObjectURL(file)));
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedBlogImgs = formik.values.blogImgs.filter((_, index) => index !== indexToRemove);
        const updatedPreviewImages = previewImage.filter((_, index) => index !== indexToRemove);

        formik.setFieldValue("blogImgs", updatedBlogImgs);
        setPreviewImage(updatedPreviewImages);
    };

    const handleCategoryChange = (val) => {
        setValueCategories(val);
        formik.setFieldValue("valueCategories", val);
    };

    const handleCreateBlog = async (values) => {
        setIsUploading(true);

        const { title, content, blogImgs, valueCategories } = values;

        const isPrivate = valueDisplayMode?.value === 'Private' ? true : false;

        try {
            let blogImgsUrl = [];
            for (let file of blogImgs) {
                const signatureImg = await dispatch(getSignature("OnlVideosViewing/BE/blogs")).unwrap();
                const uploaded = await dispatch(uploadSingleFile({
                    file,
                    folder: "OnlVideosViewing/BE/blogs",
                    resourceType: "image",
                    signatureData: signatureImg,
                })).unwrap();

                // console.log("✅ Image uploaded:", uploaded);

                blogImgsUrl.push(uploaded);
            }

            const metadata = {
                userId,
                title,
                content,
                blogImgs: blogImgsUrl || undefined,
                categories: valueCategories,
                isPrivate,
            };

            await dispatch(createBlog(metadata)).unwrap();
            showNotification("success", "Blog created successfully!", "Congratulations on successfully creating new Blog!!");
            navigate("/studio/content-management/blogs");
        } catch (error) {
            console.error("❌ Lỗi khi upload hoặc lưu metadata:", error);
            showNotification("error", "Lỗi khi upload hoặc lưu metadata", error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="m-2">
            <div className="theme-first rounded-lg p-2 flex flex-col gap-2">
                <div className="title mx-2 border-b-1.5 theme-border">
                    <p className="text-xl font-semibold">Create Blog</p>
                </div>

                <div className="m-2 w-auto">
                    <form onSubmit={formik.handleSubmit} action="" className="border-1.5 theme-border py-2.5 px-3 rounded-xl flex flex-col-reverse gap-2">
                        <div className="flex items-start gap-4 my-2">
                            <div className="form-left w-3/5 flex flex-col justify-center gap-1 mt-0.5">
                                <div className="title-blog relative bg-inherit">
                                    <input
                                        type="text"
                                        name="title"
                                        className={`peer form-edit h-10
                                            ${formik.touched.title && formik.errors.title ? "ring-red-500 focus:ring-red-500" :
                                                theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"
                                            }
                                        `}
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
                                        className={`peer form-edit px-3 py-1.5 h-32 overflow-y-auto
                                            ${formik.touched.content && formik.errors.content ? "ring-red-500 focus:ring-red-500" :
                                                theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"
                                            }
                                        `}
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

                                        {formik.touched.image && formik.errors.image && (
                                            <p className="text-red-500 text-xs mx-0.25 mt-0.5">{formik.errors.image}</p>
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
                                    "Create Blog"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;