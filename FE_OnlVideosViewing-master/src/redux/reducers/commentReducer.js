import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

// Hàm format lỗi
const formatError = (err) => ({
  message: err.response?.data?.message || err.message || "Unknown error",
  code: err.response?.status || 500,
});

export const getCommentsByVideoId = createAsyncThunk(
  "comment/getCommentsByVideoId",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `comment/get-all-comments-by-video-id/${videoId}`
      );

      // console.log("Response data:", response.data);

      return response.data.comments;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const getRepliesByParentCommentId = createAsyncThunk(
  "comment/getRepliesByParentCommentId",
  async ({ parentCommentId, page }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `comment/get-comment-replies-by-parent-id/${parentCommentId}?page=${page}`
      );
      return {
        parentCommentId,
        replies: response.data.replies,
        hasMore: response.data.hasMore,
        totalReplies: response.data.totalReplies,
        page,
      };
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const postCommentVideo = createAsyncThunk(
  "comment/postCommentVideo",
  async ({ videoId, content, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/comment/post-comment", {
        videoId,
        content,
        userId,
      });

      return response.data.comment;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const replyToCommentInVideo = createAsyncThunk(
  "comment/replyToCommentInVideo",
  async (
    { videoId, parentCommentId, content, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/comment/reply-comment", {
        videoId,
        parentCommentId,
        content,
        userId,
      });

      console.log("Response data:", response.data);

      return {
        reply: response.data.comment,
        parentCommentId,
      };
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

const commentReducer = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    repliesByParentId: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsByVideoId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsByVideoId.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getCommentsByVideoId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRepliesByParentCommentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRepliesByParentCommentId.fulfilled, (state, action) => {
        state.loading = false;
        const { parentCommentId, replies, hasMore, page } = action.payload;

        if (!state.repliesByParentId[parentCommentId]) {
          state.repliesByParentId[parentCommentId] = {
            data: [],
            page: 1,
            hasMore: true,
          };
        }

        if (page === 1) {
          state.repliesByParentId[parentCommentId].data = replies;
        } else {
          state.repliesByParentId[parentCommentId].data.push(...replies);
        }

        state.repliesByParentId[parentCommentId].page = page;
        state.repliesByParentId[parentCommentId].hasMore = hasMore;
      })
      .addCase(getRepliesByParentCommentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(postCommentVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCommentVideo.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm comment mới vào đầu danh sách
        state.comments.unshift(action.payload);
      })
      .addCase(postCommentVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(replyToCommentInVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replyToCommentInVideo.fulfilled, (state, action) => {
        state.loading = false;

        const { reply, parentCommentId } = action.payload;

        // Nếu chưa có replies cho comment cha, khởi tạo
        if (!state.repliesByParentId[parentCommentId]) {
          state.repliesByParentId[parentCommentId] = {
            data: [],
            page: 1,
            hasMore: true,
          };
        }

        // Thêm reply mới vào danh sách
        state.repliesByParentId[parentCommentId].data.unshift(reply);
      })
      .addCase(replyToCommentInVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentReducer.reducer;
