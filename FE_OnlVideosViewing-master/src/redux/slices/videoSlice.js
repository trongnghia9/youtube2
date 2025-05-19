import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoApi } from '../../apis/videoApi';

// Async thunks
export const advancedSearch = createAsyncThunk(
  'video/advancedSearch',
  async (params) => {
    const response = await videoApi.advancedSearch(params);
    return response;
  }
);

export const getFilteredVideos = createAsyncThunk(
  'video/getFilteredVideos',
  async (filters) => {
    const response = await videoApi.getFilteredVideos(filters);
    return response;
  }
);

export const downloadVideo = createAsyncThunk(
  'video/downloadVideo',
  async ({ videoId, quality }) => {
    const response = await videoApi.downloadVideo(videoId, quality);
    return response;
  }
);

export const createVideoNote = createAsyncThunk(
  'video/createVideoNote',
  async ({ videoId, note }) => {
    const response = await videoApi.saveVideoNote(videoId, note);
    return response;
  }
);

export const getVideoNotes = createAsyncThunk(
  'video/getVideoNotes',
  async (videoId) => {
    const response = await videoApi.getVideoNotes(videoId);
    return response;
  }
);

export const updateVideoNote = createAsyncThunk(
  'video/updateVideoNote',
  async ({ videoId, noteId, note }) => {
    const response = await videoApi.updateVideoNote(videoId, noteId, note);
    return response;
  }
);

export const deleteVideoNote = createAsyncThunk(
  'video/deleteVideoNote',
  async ({ videoId, noteId }) => {
    const response = await videoApi.deleteVideoNote(videoId, noteId);
    return response;
  }
);

const initialState = {
  searchResults: [],
  filteredVideos: [],
  notes: [],
  downloadProgress: 0,
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setDownloadProgress: (state, action) => {
      state.downloadProgress = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearFilteredVideos: (state) => {
      state.filteredVideos = [];
    },
    clearNotes: (state) => {
      state.notes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Advanced Search
      .addCase(advancedSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(advancedSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(advancedSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Filtered Videos
      .addCase(getFilteredVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilteredVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredVideos = action.payload;
      })
      .addCase(getFilteredVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Download Video
      .addCase(downloadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadVideo.fulfilled, (state) => {
        state.loading = false;
        state.downloadProgress = 100;
      })
      .addCase(downloadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Video Notes
      .addCase(createVideoNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(getVideoNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(updateVideoNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(deleteVideoNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note._id !== action.payload.noteId);
      });
  },
});

export const {
  setDownloadProgress,
  clearSearchResults,
  clearFilteredVideos,
  clearNotes,
} = videoSlice.actions;

export default videoSlice.reducer; 