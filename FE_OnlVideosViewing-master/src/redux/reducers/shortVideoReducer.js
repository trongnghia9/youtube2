import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

const formatError = (err) => ({
  message: err.response?.data?.message || err.message || "Unknown error",
  code: err.response?.status || 500,
});

// Thunk: Get all short videos
export const getAllShortVideos = createAsyncThunk(
  "shortVideo/getAllShortVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/short-video/get-all-short-videos");
      return response.data.shorts;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

// Thunk: Get short videos for a channel
export const getAllShortVideosForChannel = createAsyncThunk(
  "shortVideo/getAllShortVideosForChannel",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/short-video/get-all-short-videos-for-channel/${channelId}`);
      return response.data.shorts;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

// Thunk: Get short videos for a user
export const getAllShortVideosForUser = createAsyncThunk(
  "shortVideo/getAllShortVideosForUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/short-video/get-all-short-videos-for-user/${userId}`);
      return response.data.shorts;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

// Thunk: Upload short video
export const uploadShortVideo = createAsyncThunk(
  "shortVideo/uploadShortVideo",
  async (metadata, { rejectWithValue }) => {
    try {
      const response = await api.post("/short-video/create-short-video", metadata);
      return response.data;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

const shortVideoReducer = createSlice({
  name: "shortVideo",
  initialState: {
    shortVideos: [],
    loading: false,
    error: null,
    shortVideo: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all short videos
      .addCase(getAllShortVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shortVideos = [];
      })
      .addCase(getAllShortVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.shortVideos = action.payload;
        state.error = null;
      })
      .addCase(getAllShortVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.shortVideos = [];
      })

      // Get channel short videos
      .addCase(getAllShortVideosForChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shortVideos = [];
      })
      .addCase(getAllShortVideosForChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.shortVideos = action.payload;
        state.error = null;
      })
      .addCase(getAllShortVideosForChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.shortVideos = [];
      })

      // Get user short videos
      .addCase(getAllShortVideosForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shortVideos = [];
      })
      .addCase(getAllShortVideosForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.shortVideos = action.payload;
        state.error = null;
      })
      .addCase(getAllShortVideosForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.shortVideos = [];
      })

      // Upload short video
      .addCase(uploadShortVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shortVideo = null;
      })
      .addCase(uploadShortVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.shortVideo = action.payload.shortVideo;
        state.error = null;
      })
      .addCase(uploadShortVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.shortVideo = null;
      });
  },
});

export default shortVideoReducer.reducer;