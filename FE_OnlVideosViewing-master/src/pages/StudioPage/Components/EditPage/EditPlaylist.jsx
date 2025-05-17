import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { editPlaylist, getPlaylistInfo } from "../../../../redux/reducers/playlistReducer";
import { MdLock, MdPublic } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dropdown from "../../../../components/StudioPage/Dropdown";
import { FaSpinner } from "react-icons/fa";

const EditPlaylist = () => {

    const dispatch = useDispatch();
    const { playlistId } = useParams();
    const { theme, userInfo, isLoggedIn, showNotification } = useOutletContext();

    // console.log(playlistId);

    const { currentPlaylist } = useSelector((state) => state.playlist);

    // console.log(currentPlaylist);

    const max_title = 50;
    const max_description = 100;
    const [titlePlaylistLength, setTitlePlaylistLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (playlistId) {
            dispatch(getPlaylistInfo(playlistId));
        }
    }, [playlistId, dispatch]);

    const optionDisplayMode = [
        {
            icon: <MdPublic className="size-5 themeText" />,
            value: 'Public',
            label: 'Public',
        },
        {
            icon: <MdLock className="size-5 themeText" />,
            value: 'Private',
            label: 'Private',
        }
    ]

    const [valueDisplayMode, setValueDisplayMode] = useState({
        label: 'Public',
        value: 'Public',
        icon: <MdPublic className="size-5 themeText" />
    });

    const handleInputChange = (e, field, maxLength, setLength) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setLength(value.length);
            formik.setFieldValue(field, value);
        }
    }; 
    
    const initialFormValues = {
        titlePlaylist: currentPlaylist?.titlePlaylist || '',
        description: currentPlaylist?.description || ''
    };    

    const validationSchema = Yup.object({
        titlePlaylist: Yup.string()
            .max(max_title, `Title playlist cannot exceed ${max_title} characters`)
            .required("Title playlist is required"),
        description: Yup.string()
            .max(max_description, `Description cannot exceed ${max_description} characters`)
            .required("Description is required"),
    });

    const formik = useFormik({
        initialValues: initialFormValues,
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await handleEditPlaylist(values);
            } catch (err) {
                console.error(err);
            }
        }
    });

    useEffect(() => {
        if (currentPlaylist) {
            // Update display mode
            setValueDisplayMode(currentPlaylist.isPrivate
                ? optionDisplayMode.find(option => option.value === 'Private')
                : optionDisplayMode.find(option => option.value === 'Public')
            );
    
            formik.setValues(initialFormValues);
    
            setTitlePlaylistLength(currentPlaylist.titlePlaylist?.length || 0);
            setDescriptionLength(currentPlaylist.description?.length || 0);
        }
    }, [currentPlaylist]);    

    const handleEditPlaylist = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            await dispatch(editPlaylist({
                playlistId: currentPlaylist._id,
                title: formik.values.titlePlaylist,
                description: formik.values.description,
                isPrivate: valueDisplayMode.value === "Private",
            }));
            showNotification("success", "Playlist updated successfully!", "Congratulations on successfully editing your Playlist!!");
        } catch (err) {
            console.error(err);
            showNotification("error", "Lỗi khi upload hoặc lưu metadata", err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="my-2">
            <div className="theme-first rounded-lg">
                <div className="m-2 w-3/5">
                    <form onSubmit={handleEditPlaylist} action="" className="border-1.5 theme-border pt-5 px-2.5 pb-2.5 rounded-xl flex flex-col gap-1">
                        <div className="flex flex-col space-y-1">
                            <div className="title-playlist relative bg-inherit">
                                <input
                                    type="text"
                                    name="titlePlaylist"
                                    className={`peer form-edit h-10 ${formik.touched.titlePlaylist && formik.errors.titlePlaylist ? "ring-red-500 focus:ring-red-500" : theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"}`}
                                    placeholder="Name"
                                    onBlur={formik.handleBlur}
                                    value={formik.values.titlePlaylist}
                                    onChange={(e) => handleInputChange(e, "titlePlaylist", max_title, setTitlePlaylistLength)}
                                />
                                <label
                                    htmlFor="nameChannel"
                                    className={`label-edit theme-bg-first peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 ${formik.touched.titlePlaylist && formik.errors.titlePlaylist ? "peer-placeholder-shown:text-red-500" : "peer-placeholder-shown:theme-text-first"}`}
                                >Title playlist</label>
                                <div className="flex items-center justify-between h-6 mt-1">
                                    <div className="">
                                        {formik.touched.titlePlaylist && formik.errors.titlePlaylist && (
                                            <p className="text-red-500 text-xs">{formik.errors.titlePlaylist}</p>
                                        )}
                                    </div>
                                    <p className={`text-xs ${titlePlaylistLength >= max_title ? "text-red-500" : ""}`}>
                                        {titlePlaylistLength}/{max_title}
                                    </p>
                                </div>
                            </div>

                            <div className="description relative bg-inherit">
                                <textarea
                                    type="text"
                                    id="inputDescription"
                                    name="inputDescription"
                                    className={`peer form-edit px-3 py-1.5 h-32 overflow-y-auto ${formik.touched.description && formik.errors.description ? "ring-red-500 focus:ring-red-500" : theme === "dark" ? "ring-fifthColor focus:ring-fifthColor" : "ring-firstColor focus:ring-firstColor"}`}
                                    placeholder="Description"
                                    onChange={(e) => handleInputChange(e, "description", max_description, setDescriptionLength)}
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
                        </div>
                        <div className="flex justify-between items-center border-t-1.5 theme-border pt-2 gap-2">
                            <div className="w-1/4">
                                <Dropdown
                                    options={optionDisplayMode}
                                    selected={valueDisplayMode}
                                    setSelected={setValueDisplayMode}
                                    placeholder="Select Option"
                                />
                            </div>

                            <div className="border-l-1.5 theme-border pl-2">
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
                                        "Edit Playlist"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default EditPlaylist;