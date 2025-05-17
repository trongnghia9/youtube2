import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../apis/config";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
const baseURL = import.meta.env.VITE_BACKEND_BASEURL;

const formatError = (err) => ({
  message: err.response?.data?.message || err.message || "Unknown error",
  code: err.response?.status || 500,
});

// 📌 1. Get Signature
export const getSignature = createAsyncThunk(
  "video/getSignature",
  async (folder, { rejectWithValue }) => {
    try {
      const res = await api.post("/video/generate-signature", { folder });
      return res.data;
    } catch (err) {
      console.error("[getSignature] Error:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 2. Upload Single File (<25MB)
export const uploadSingleFile = createAsyncThunk(
  "video/uploadSingleFile",
  async (
    { file, folder, resourceType, signatureData },
    { dispatch, rejectWithValue }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("folder", folder);

    // console.log("✉️ Uploading with:", {
    //   api_key: apiKey,
    //   timestamp: signatureData.timestamp,
    //   signature: signatureData.signature,
    //   folder,
    // });

    try {
      let hasProgressStarted = false;
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);

            if (!hasProgressStarted && percent === 100) return;

            hasProgressStarted = true;
            dispatch(setUploadProgress(percent));
          },
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("[uploadSingleFile] Error uploading:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 3. Upload Large Video (chunked)
export const uploadLargeVideo = createAsyncThunk(
  "video/uploadLargeVideo",
  async ({ file }, { dispatch, rejectWithValue }) => {
    if (!file) {
      throw new Error("File is missing in uploadLargeVideo");
    }

    const chunkSize = 6 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let uploadedSize = 0;
    let uploadedUrl = null;

    const uploadChunk = async (chunkIndex) => {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const { data: signatureData } = await api.post(
        "/video/generate-signature",
        {
          folder: "OnlVideosViewing/BE/videos",
        }
      );

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("api_key", apiKey);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);
      formData.append("folder", "OnlVideosViewing/BE/videos");

      const headers = {
        "X-Unique-Upload-Id": uploadId,
        "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
      };

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData,
        { headers }
      );

      uploadedSize += chunk.size;
      const progress = Math.round((uploadedSize / file.size) * 100);
      dispatch(setUploadProgress(progress));

      return res.data.secure_url || null;
    };

    try {
      let currentIndex = 0;
      while (currentIndex < totalChunks) {
        const batch = [];
        for (
          let i = 0;
          i < 3 && currentIndex < totalChunks;
          i++, currentIndex++
        ) {
          batch.push(uploadChunk(currentIndex));
        }

        const results = await Promise.allSettled(batch);
        for (const result of results) {
          if (result.status === "rejected") {
            console.error(`[uploadLargeVideo] Chunk failed:`, result.reason);
            throw result.reason;
          }
          if (result.value) uploadedUrl = result.value;
        }
      }
      // dispatch(setUploadProgress(100));
      return uploadedUrl;
    } catch (err) {
      console.error("[uploadLargeVideo] Upload failed:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 4. Upload video to backend to be sliced
export const uploadVideoToBackend = createAsyncThunk(
  "video/uploadToBackend",
  async ({ file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("videoFile", file);
      formData.append("folder", `${Date.now()}`);

      const res = await api.post("/video/get-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      console.error("[uploadVideoToBackend] Error:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 5. Lấy danh sách file video đã slice
export const getSlicedParts = createAsyncThunk(
  "video/getSlicedParts",
  async ({ folder, savedName }, { rejectWithValue }) => {
    try {
      const res = await api.post("/video/get-list-video-sliced", {
        folder,
        savedName,
      });
      return res.data.videoParts.map((part) => part.filename);
    } catch (err) {
      console.error("[getSlicedParts] Error:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 6. Tải từng blob từ backend
export const fetchVideoPartBlob = async (folder, filename) => {
  const res = await api.get("/video/get-part", {
    params: { folder, name: filename },
    responseType: "blob",
  });
  return res.data;
};

// 📌 7. Upload toàn bộ phần slice lên Cloudinary
export const uploadSlicedVideos = createAsyncThunk(
  "video/uploadSlicedVideos",
  async ({ folder, filenames }, { dispatch, rejectWithValue }) => {
    try {
      const uploadedUrls = [];

      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];

        const blob = await fetchVideoPartBlob(folder, filename);
        const file = new File([blob], filename, { type: "video/mp4" });

        const videoUrl = await dispatch(uploadLargeVideo({ file })).unwrap();
        uploadedUrls.push(videoUrl);

        await api.post("/video/delete-sliced-videos", {
          folder,
          filenames: [filename],
        });
      }

      return uploadedUrls;
    } catch (err) {
      console.error("[uploadSlicedVideos] Upload failed:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 8. Save metadata (Cloudinary URLs) to database
export const saveVideoMetadata = createAsyncThunk(
  "video/saveVideoMetadata",
  async (metadata, { rejectWithValue }) => {
    try {
      const response = await api.post("/video/upload-video", metadata);
      console.log("📄 Metadata saved:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lưu metadata:",
        error.response?.data || error.message
      );
      return rejectWithValue(formatError(error));
    }
  }
);

// 📌 9. Xóa folder chứa file đã slice
export const deleteFolder = createAsyncThunk(
  "video/deleteFolder",
  async (folder, { rejectWithValue }) => {
    try {
      await api.post("/video/cleanup-folder", { folder });
    } catch (err) {
      console.error("[deleteFolder] Error:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 Get All Video
export const getAllVideos = createAsyncThunk(
  "video/getAllVideos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/video/get-all-videos");
      return res.data;
    } catch (err) {
      console.error("[getAllVideos] Error:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

// 📌 Get All Videos of a Channel by channelId
export const getAllVideosOfChannel = createAsyncThunk(
  "video/getAllVideosOfChannel",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/video/get-all-videos-of-channel/${channelId}`);
      return res.data;
    } catch (err) {
      console.error("[getAllVideosOfChannel] Error:", err);
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Unknown error",
        code: err.response?.status || 500,
      });
    }
  }
);

// 📌 Get All Videos of a User by userId
export const getAllVideosOfUser = createAsyncThunk(
  "video/getAllVideosOfUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/video/get-all-videos-of-user/${userId}`);
      return res.data;
    } catch (err) {
      console.error("[getAllVideosOfUser] Error:", err);
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Unknown error",
        code: err.response?.status || 500,
      });
    }
  }
);

// 📌 Get Video Info
export const fetchVideoInfo = createAsyncThunk(
  "video/fetchVideoInfo",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/video/get-video-info/${videoId}`);
      return res.data;
    } catch (err) {
      console.error("[fetchVideoInfo] Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// 📌 Combine Video
export const combineFullVideo = createAsyncThunk(
  "video/combineFullVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/video/combine-video`, { videoId });
      return res.data;
    } catch (err) {
      console.error("[combineFullVideo] Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// 📌 Update View
export const updateVideoView = createAsyncThunk(
  "video/updateView",
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/video/update-view`, {
        videoId,
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete video by videoId
export const deleteVideoById = createAsyncThunk(
  "video/deleteVideoById",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/video/delete-video/${videoId}`);
      return {
        videoDeleted: response.data.video,
        message: response.data.message,
      };
    } catch (err) {
      console.error("[deleteVideoById] Error:", err);
      return rejectWithValue(formatError(err));
    }
  }
);

const videoReducer = createSlice({
  name: "video",
  initialState: {
    uploading: false,
    progress: 0,
    error: null,
    uploadedUrls: [],
    progress: 0,
    isUploaded: false,

    allVideos: [],
    videoInfo: null,
    videoUrls: [],
    loading: false,
  },
  reducers: {
    setUploadProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetIsUploaded: (state) => {
      state.isUploaded = false;
    },

    setVideoInfo: (state, action) => {
      state.videoInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload video
      .addCase(uploadLargeVideo.pending, (state) => {
        state.uploading = true;
        state.isUploaded = false; // reset
      })
      .addCase(uploadLargeVideo.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedUrls.push(action.payload);
        state.isUploaded = true; // đánh dấu đã upload xong
      })
      .addCase(uploadLargeVideo.rejected, (state, action) => {
        state.uploading = false;
        state.error =
          action.payload?.message || action.error?.message || "Unknown error";
        state.isUploaded = false; // upload thất bại
      })
      .addCase(uploadSingleFile.pending, (state) => {
        state.uploading = true;
        state.isUploaded = false; // Reset khi bắt đầu upload
      })
      .addCase(uploadSingleFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedUrls.push(action.payload);
        state.isUploaded = true; // Đánh dấu đã upload xong
      })
      .addCase(uploadSingleFile.rejected, (state, action) => {
        state.uploading = false;
        state.error =
          action.payload?.message || action.error?.message || "Unknown error";
        state.isUploaded = false;
      })
      .addCase(saveVideoMetadata.fulfilled, (state, action) => {
        state.isUploaded = true; // ✅ Quan trọng!
      })

      // Get All Videos
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.allVideos = action.payload.videos; // 🆕 cập nhật state
        state.loading = false;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Get All Videos of Channel
      .addCase(getAllVideosOfChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVideosOfChannel.fulfilled, (state, action) => {
        state.allVideos = action.payload.videos; // cập nhật danh sách video từ kênh
        state.loading = false;
      })
      .addCase(getAllVideosOfChannel.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })      

      // Get All Videos of User
      .addCase(getAllVideosOfUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVideosOfUser.fulfilled, (state, action) => {
        state.allVideos = action.payload.videos; // Cập nhật video người dùng
        state.loading = false;
      })
      .addCase(getAllVideosOfUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Get Video Info
      .addCase(fetchVideoInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideoInfo.fulfilled, (state, action) => {
        state.videoInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchVideoInfo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(combineFullVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(combineFullVideo.fulfilled, (state, action) => {
        state.videoUrls = action.payload;
        state.loading = false;
      })
      .addCase(combineFullVideo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update View
      .addCase(updateVideoView.pending, (state) => {
        state.updateViewLoading = true;
      })
      .addCase(updateVideoView.fulfilled, (state, action) => {
        state.updateViewLoading = false;
        state.updateViewSuccess = true;
      })
      .addCase(updateVideoView.rejected, (state, action) => {
        state.updateViewLoading = false;
        state.updateViewError = action.payload;
      });
  },
});

export const { setUploadProgress, resetIsUploaded, setVideoInfo } =
  videoReducer.actions;

export default videoReducer.reducer;
