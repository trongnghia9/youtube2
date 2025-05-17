import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

const formatError = (err) => ({
    message: err.response?.data?.message || err.message || "Unknown error",
    code: err.response?.status || 500,
});

export const getViewHistoryByUserId = createAsyncThunk(
  "viewHistory/getByUserId",
  async ({ userId, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/view-history/get-all-view-history/${userId}`, {
        params: { page, limit },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Unknown error",
        code: err.response?.status || 500,
      });
    }
  }
);

const viewHistoryReducer = createSlice({
  name: "viewHistory",
  initialState: {
    viewHistory: [],
    total: 0,
    page: 1,
    limit: 5,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getViewHistoryByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getViewHistoryByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.viewHistory = action.payload.history;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getViewHistoryByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default viewHistoryReducer.reducer;