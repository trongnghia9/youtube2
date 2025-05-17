import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

const formatError = (err) => ({
    message: err.response?.data?.message || err.message || "Unknown error",
    code: err.response?.status || 500,
});

export const getAllBlogsByChannelId = createAsyncThunk(
    "blog/getAllBlogsByChannelId",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/blog/get-all-blogs-by-channel-id/${channelId}`);
            return response.data.blogs;
        } catch (err) {
            return rejectWithValue(formatError(err));
        }
    }
);

export const getAllBlogsByUserId = createAsyncThunk(
    "blog/getAllBlogsByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/blog/get-all-blogs-by-user-id/${userId}`);
            return response.data.blogs;
        } catch (err) {
            return rejectWithValue(formatError(err));
        }
    }
);

export const getBlogInfo = createAsyncThunk(
    "blog/getBlogInfo",
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/blog/get-blog-info/${blogId}`);
            return response.data.blog;
        } catch (err) {
            return rejectWithValue(formatError(err));
        }
    }
);

export const createBlog = createAsyncThunk(
    "blog/createBlog",
    async (blogData, { rejectWithValue }) => {
        try {
            const response = await api.post("/blog/create-blog", blogData);
            return response.data.blog;
        } catch (err) {
            return rejectWithValue(formatError(err));
        }
    }
);

export const editBlog = createAsyncThunk(
    "blog/editBlog",
    async ({ blogId, metadata }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/blog/edit-blog/${blogId}`, metadata);
            return response.data.blog;
        } catch (err) {
            return rejectWithValue(formatError(err));
        }
    }
);

export const deleteBlog = createAsyncThunk(
    "blog/deleteBlog",
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/blog/delete-blog/${blogId}`);
            return { blogDeleted: response.data.blog, message: response.data.message };
        } catch (err) {
            return rejectWithValue(formatError(err));
        }
    }
);

const initialState = {
    allBlogs: [],
    selectedBlog: null,
    loading: false,
    error: null,
};

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.allBlogs.unshift(action.payload);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllBlogsByChannelId
            .addCase(getAllBlogsByChannelId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBlogsByChannelId.fulfilled, (state, action) => {
                state.loading = false;
                state.allBlogs = action.payload;
            })
            .addCase(getAllBlogsByChannelId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllBlogsByUserId
            .addCase(getAllBlogsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBlogsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.allBlogs = action.payload;
            })
            .addCase(getAllBlogsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getBlogInfo
            .addCase(getBlogInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBlogInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBlog = action.payload;
            })
            .addCase(getBlogInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.selectedBlog = null;
            })

            // editBlog
            .addCase(editBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editBlog.fulfilled, (state, action) => {
                state.loading = false;
    
                // Cập nhật blog trong danh sách allBlogs nếu tồn tại
                const index = state.allBlogs.findIndex(blog => blog._id === action.payload._id);
                if (index !== -1) {
                    state.allBlogs[index] = action.payload;
                }

                // Cập nhật selectedBlog nếu đang được chỉnh sửa
                if (state.selectedBlog && state.selectedBlog._id === action.payload._id) {
                    state.selectedBlog = action.payload;
                }
            })
            .addCase(editBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteBlog
            .addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.allBlogs = state.allBlogs.filter(blog => blog._id !== action.payload.blogId);

                // Nếu selectedBlog là blog vừa bị xóa, đặt lại null
                if (state.selectedBlog && state.selectedBlog._id === action.payload.blogId) {
                    state.selectedBlog = null;
                }
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default blogSlice.reducer;