import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

// Hàm format lỗi
const formatError = (err) => ({
  message: err.response?.data?.message || err.message || "Unknown error",
  code: err.response?.status || 500,
});

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications/${receiverId}`);

      // console.log("Response data:", response.data);

      return response.data.notifications;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/${id}/read`);
      return id;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

const notificationReducer = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.notifications.find(
          (item) => item._id === id
        );
        if (notification) {
          notification.isRead = true;
        }
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload;
        state.notifications = state.notifications.filter(
          (item) => item._id !== id
        );
      });
  },
});

// export const {} = notificationReducer.actions;

export default notificationReducer.reducer;
