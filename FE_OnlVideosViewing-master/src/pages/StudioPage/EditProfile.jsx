import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { loginGoogle } from "../../redux/reducers/authReducer";
import { saveProfile } from "../../redux/reducers/channelReducer";
import { getSignature, uploadSingleFile } from "../../redux/reducers/videoReducer";
import { FaSpinner } from "react-icons/fa";

const avatarDefault = "https://res.cloudinary.com/dci95w73h/image/upload/v1738690871/OnlVideosViewing/FE/Logo/j97_bnl4wx.png";

const EditProfile = () => {

    const dispatch = useDispatch();
    const { channelId } = useParams();

    // console.log(channelId);

    const { theme, isLoggedIn, userInfo, showNotification } = useOutletContext();

    console.log(userInfo?.channel);

    const max_name = 25;
    const max_description = 200;

    const [nameChannelLength, setNameChannelLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState(userInfo?.channel?.avatarChannel || avatarDefault);
    const [coverPreview, setCoverPreview] = useState(userInfo?.channel?.bannerChannel || avatarDefault);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue("avatarChannel", file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverPhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue("bannerChannel", file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleNameChannelChange = (e) => {
        const value = e.target.value;
        if (value.length <= max_name) {
            setNameChannelLength(value.length);
            formik.setFieldValue("nameChannel", value);
        }
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (value.length <= max_description) {
            setDescriptionLength(value.length);
            formik.setFieldValue("description", value);
        }
    };

    const validationSchema = Yup.object({
        nameChannel: Yup.string()
            .max(max_name, `Name Channel cannot exceed ${max_name} characters`)
            .required("Name Channel is required"),
        description: Yup.string()
            .max(max_description, `Description cannot exceed ${max_description} characters`)
            .required("Description is required"),
    });

    const formik = useFormik({
        initialValues: {
            nameChannel: userInfo?.channel?.nameChannel || "",
            description: userInfo?.channel?.description || "",
            avatarChannel: null,
            bannerChannel: null,
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await handleEditProfile(values);
            } catch (err) {
                console.error(err);
            }
        }
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleEditProfile = async (values) => {
        setIsUploading(true);

        const { nameChannel, description, avatarChannel, bannerChannel } = values;

        try {
            if (!avatarChannel && !bannerChannel &&
                values.nameChannel === userInfo.channel.nameChannel &&
                values.description === userInfo.channel.description) {
                showNotification("error", "No Changes Detected", "Please update at least one field before submitting.");
                return;
            }

            let avatarUrl = "";
            if (avatarChannel) {
                const signatureAvatar = await dispatch(getSignature("OnlVideosViewing/BE/avatars")).unwrap();
                avatarUrl = await dispatch(
                    uploadSingleFile({
                        file: avatarChannel,
                        folder: "OnlVideosViewing/BE/avatars",
                        resourceType: "image",
                        signatureData: signatureAvatar,
                    })
                ).unwrap();
            }

            let bannerUrl = "";
            if (bannerChannel) {
                const signatureBanner = await dispatch(getSignature("OnlVideosViewing/BE/banners")).unwrap();
                bannerUrl = await dispatch(
                    uploadSingleFile({
                        file: bannerChannel,
                        folder: "OnlVideosViewing/BE/banners",
                        resourceType: "image",
                        signatureData: signatureBanner,
                    })
                ).unwrap();
            }

            const metadata = {
                nameChannel,
                description,
                avatarUrl: avatarUrl || undefined,
                bannerUrl: bannerUrl || undefined,
            };

            await dispatch(saveProfile({ channelId, metadata })).unwrap();
            dispatch(loginGoogle());
            showNotification("success", "Profile edited successfully", "Congratulations on successfully editing your Profile!!");
        } catch (error) {
            console.error("❌ Lỗi khi upload hoặc lưu metadata:", error);
            showNotification("error", "Lỗi khi upload hoặc lưu metadata", error.message);

            const message = error?.response?.data?.message || error.message;

            if (message === "Tên người dùng đã tồn tại, vui lòng nhập tên khác") {
                formik.setFieldError("nameChannel", message);
            } else {
                showNotification("error", "Lỗi khi upload hoặc lưu metadata", message);
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="m-2">
            <div className="theme-first rounded-lg p-2 flex flex-col gap-4">
                <div className="title mx-2 border-b-1.5 theme-border">
                    <p className="text-xl font-semibold">Edit Profile</p>
                </div>

                <div className="m-2 w-3/5">
                    <form onSubmit={formik.handleSubmit} action="" className="border-1.5 theme-border p-2.5 rounded-xl flex flex-col-reverse gap-2">
                        <div className="flex items-start gap-4 my-2">
                            <div className="form-left flex flex-col justify-center gap-2.5">
                                <div className="name relative bg-inherit">
                                    <input
                                        type="text"
                                        name="nameChannel"
                                        className={`peer form-edit h-10
                                            ${formik.touched.nameChannel && formik.errors.nameChannel ? "ring-red-500 focus:ring-red-500" :
                                                theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"
                                            }
                                        `}
                                        placeholder="Name"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.nameChannel}
                                        onChange={handleNameChannelChange}
                                    />
                                    <label
                                        htmlFor="nameChannel"
                                        className={`label-edit theme-bg-first peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 ${formik.touched.description && formik.errors.description ? "peer-placeholder-shown:text-red-500" : "peer-placeholder-shown:theme-text-first"}`}
                                    >Name</label>
                                    <div className="flex items-center justify-between h-6 mt-1.5">
                                        <div className="">
                                            {formik.touched.nameChannel && formik.errors.nameChannel && (
                                                <p className="text-red-500 text-xs">{formik.errors.nameChannel}</p>
                                            )}
                                        </div>
                                        <p className={`text-xs ${nameChannelLength >= max_name ? "text-red-500" : ""}`}>
                                            {nameChannelLength}/{max_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="description relative bg-inherit">
                                    <textarea
                                        type="text"
                                        id="inputDescription"
                                        name="inputDescription"
                                        className={`peer form-edit px-3 py-1.5 h-32 overflow-y-auto
                                            ${formik.touched.description && formik.errors.description ? "ring-red-500 focus:ring-red-500" :
                                                theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"
                                            }
                                        `}
                                        placeholder="Description"
                                        onChange={handleDescriptionChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.description}
                                    />
                                    <label
                                        htmlFor="inputDescription"
                                        className={`label-edit theme-bg-first peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 ${formik.touched.description && formik.errors.description ? "peer-placeholder-shown:text-red-500" : "peer-placeholder-shown:theme-text-first"}`}
                                    >Description</label>
                                    <div className="flex items-center justify-between h-6">
                                        <div className="">
                                            {formik.touched.description && formik.errors.description && (
                                                <p className="text-red-500 text-xs">{formik.errors.description}</p>
                                            )}
                                        </div>
                                        <p className={`text-xs ${descriptionLength >= max_description ? "text-red-500" : ""}`}>
                                            {descriptionLength}/{max_description}
                                        </p>
                                    </div>
                                </div>

                                <div className="upload-avatar mb-2">
                                    <div className="border-1.5 flex flex-row-reverse gap-4 theme-border rounded-md px-2.5 py-2">
                                        <div className="w-1/2">
                                            <div className="flex flex-col items-start justify-start gap-2">
                                                <div className="">
                                                    <label htmlFor="avatar" className="ml-0.25 font-semibold text-sm">Avatar</label>
                                                    <p className="text-xs">Ảnh hồ sơ sẽ xuất hiện cùng với kênh của bạn trên YouTube tại những vị trí như bên cạnh bình luận và video của bạn. Max size: 6 MB</p>
                                                </div>
                                                <label htmlFor="avatar" className="cursor-pointer btn-1 px-2.5 py-2 text-xs font-medium">
                                                    Choose Avatar
                                                </label>
                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="avatar"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>

                                        <div className={`w-1/2 py-2.5 flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} rounded-xl`}>
                                            {avatarPreview && (
                                                <img src={avatarPreview} alt="Preview" className="size-36 object-cover rounded-full border shadow-sm" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="cover-photo">
                                    <div className="border-1.5 flex flex-row-reverse gap-4 theme-border rounded-md px-2.5 py-2">
                                        <div className="w-1/2">
                                            <div className="flex flex-col items-start justify-start gap-2">
                                                <div className="">
                                                    <label htmlFor="coverPhoto" className="ml-0.25 font-semibold text-sm">Cover Photo</label>
                                                    <p className="text-xs">Ảnh bìa là hình ảnh này sẽ xuất hiện ở phần đầu kênh của bạn. Max size: 6 MB</p>
                                                </div>
                                                <label htmlFor="coverPhoto" className="cursor-pointer btn-1 px-2.5 py-2 text-xs font-medium">
                                                    Choose Cover Photo
                                                </label>
                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="coverPhoto"
                                                className="hidden"
                                                onChange={handleCoverPhotoChange}
                                            />
                                        </div>

                                        <div className={`w-1/2 py-2.5 flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} rounded-xl`}>
                                            {coverPreview && (
                                                <img src={coverPreview} alt="Preview" className="w-[14.4rem] h-36 object-cover rounded-lg border shadow-sm" />
                                            )}
                                        </div>
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
                </div>
            </div>
        </div>
    )
}

export default EditProfile;