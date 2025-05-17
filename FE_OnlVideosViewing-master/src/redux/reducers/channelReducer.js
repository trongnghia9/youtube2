import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

const formatError = (err) => ({
  message: err.response?.data?.message || err.message || "Unknown error",
  code: err.response?.status || 500,
});

export const saveProfile = createAsyncThunk(
  "video/saveProfile",
  async ({ channelId, metadata }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/channel/edit-profile/${channelId}`,
        metadata,
        { withCredentials: true }
      );
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

export const getChannelByName = createAsyncThunk(
  "channel/getChannelByName",
  async (nameChannel, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/channel/get-channel-by-name/${encodeURIComponent(nameChannel)}`,
        {
          // encodeURIComponent giúp mã hóa (encode) một chuỗi khi có kí tự đặc biết || dấu cách.
          withCredentials: true,
        }
      );
      console.log("📡 Channel data fetched:", response.data);
      return response.data.channel;
    } catch (error) {
      console.error(
        "❌ Error fetching channel:",
        error.response?.data || error.message
      );
      return rejectWithValue(formatError(error));
    }
  }
);

export const subscribeChannel = createAsyncThunk(
  "channel/subscribeChannel",
  async ({ channelId, userId, socket }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/channel/subscribe/${channelId}`, { userId }, { withCredentials: true });

      if (socket) {
        socket.emit("subscribe-channel", { channelId, userId });
      }

      return { channelId, userId };
    } catch (error) {
      return rejectWithValue(formatError(error));
    }
  }
);

export const unsubscribeChannel = createAsyncThunk(
  "channel/unsubscribeChannel",
  async ({ channelId, userId, socket }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/channel/unsubscribe/${channelId}`, {
        data: { userId },
        withCredentials: true,
      });

      if (socket) {
        socket.emit("unsubscribe-channel", { channelId, userId });
      }

      return { channelId, userId };
    } catch (error) {
      return rejectWithValue(formatError(error));
    }
  }
);

const initialState = {
  channelInfo: null,
  loading: false,
  error: null,
};

const channelReducer = createSlice({
  name: "channel",
  initialState,
  reducers: {
    clearChannelInfo: (state) => {
      state.channelInfo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChannelByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelByName.fulfilled, (state, action) => {
        state.loading = false;
        state.channelInfo = action.payload;
      })
      .addCase(getChannelByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearChannelInfo } = channelReducer.actions;

export default channelReducer.reducer;
