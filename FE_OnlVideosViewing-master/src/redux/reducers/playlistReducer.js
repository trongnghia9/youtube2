import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

const formatError = (err) => ({
  message: err.response?.data?.message || err.message || "Unknown error",
  code: err.response?.status || 500,
});

export const getPlaylistByUserId = createAsyncThunk(
  "playlist/getPlaylistByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`playlist/get-playlist/${userId}`);
      return response.data.playlists;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const getPlaylistByChannelId = createAsyncThunk(
  "playlist/getPlaylistByChannelId",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `playlist/get-playlist-of-channel/${channelId}`
      );
      return response.data.playlists;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const getPlaylistInfo = createAsyncThunk(
  "playlist/getPlaylistInfo",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/playlist/get-playlist-info/${playlistId}`
      );
      return response.data.playlist;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (
    { title, description, isPrivate, videoId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/playlist/create-playlist", {
        title,
        description,
        isPrivate,
        videoId,
        userId,
      });
      return response.data.playlist;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/playlist/${playlistId}/add-video`, {
        playlistId,
        videoId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/playlist/${playlistId}/remove-video`, {
        playlistId,
        videoId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const editPlaylist = createAsyncThunk(
  "playlist/editPlaylist",
  async ({ playlistId, title, description, isPrivate }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/playlist/edit-playlist/${playlistId}`, {
        title,
        description,
        isPrivate,
      });
      return response.data.playlist;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/playlist/delete-playlist/${playlistId}`
      );
      return {
        playlistDeleted: response.data.playlist,
        message: response.data.message,
      };
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

const initialState = {
  playlists: [],
  currentPlaylist: null,
  loading: false,
  error: null,
};

const playlistReducer = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylistByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(getPlaylistByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPlaylistByChannelId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistByChannelId.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(getPlaylistByChannelId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPlaylistInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylist = action.payload;
      })
      .addCase(getPlaylistInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.playlists.push(action.payload);
      })

      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        const { playlistId, videoId } = action.meta.arg;

        const playlist = state.playlists.find((p) => p._id === playlistId);
        if (playlist) {
          if (!playlist.videos.includes(videoId)) {
            playlist.videos.push(videoId);
          }
        }

        if (state.currentPlaylist && state.currentPlaylist._id === playlistId) {
          if (!state.currentPlaylist.videos.includes(videoId)) {
            state.currentPlaylist.videos.push(videoId);
          }
        }
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        const updatedPlaylist = action.payload.playlist;
        const index = state.playlists.findIndex(
          (p) => p._id === updatedPlaylist._id
        );
        if (index !== -1) {
          state.playlists[index] = updatedPlaylist;
        }
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(editPlaylist.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.playlists.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.playlists[index] = updated;
        }
        if (state.currentPlaylist && state.currentPlaylist._id === updated._id) {
          state.currentPlaylist = updated;
        }
      })
      .addCase(editPlaylist.rejected, (state, action) => {
        state.error = action.payload;
      });      
  },
});

export default playlistReducer.reducer;
