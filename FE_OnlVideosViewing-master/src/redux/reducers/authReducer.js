import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../apis/config";

const DEFAULT_STATE = {
  userLogin: {
    isLoggedIn: false,
    userInfo: null,
  },
};

// Kiểm tra trạng thái đăng nhập từ cookie (gọi API /auth/login-success)
// export const checkLoginStatus = createAsyncThunk(
//     "auth/checkLoginStatus",
//     async (_, thunkAPI) => {
//         try {
//             const response = await api.get("/auth/login-success", { withCredentials: true });

//             if (response.data?.user) {
//                 return { isLoggedIn: true, userInfo: response.data.user };
//             } else {
//                 return thunkAPI.rejectWithValue("Not logged in");
//             }
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data || "Failed to check login status");
//         }
//     }
// );

export const authReducer = createSlice({
  name: "auth",
  initialState: DEFAULT_STATE,
  reducers: {
    logoutSuccess: (state) => {
      state.userLogin = { ...DEFAULT_STATE.userLogin };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.userLogin = { isLoggedIn: true, userInfo: action.payload.user };
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        console.error("Google Login Failed:", action.payload);
      })
      // .addCase(checkLoginStatus.fulfilled, (state, action) => {
      //     state.userLogin = { isLoggedIn: true, userInfo: action.payload.user };
      // })
      // .addCase(checkLoginStatus.rejected, (state) => {
      //     state.userLogin = { isLoggedIn: false, userInfo: null };
      // });

      // Delete video
      // .addCase(deleteVideoById.fulfilled, (state, action) => {
      //   const videoId = action.payload.videoId;
      //   if (state.userInfo?.channel?.videos) {
      //     state.userInfo.channel.videos = state.userInfo.channel.videos.filter(
      //       (video) => video._id !== videoId
      //     );
      //     console.log("Delete Video from channel", state.userInfo.channel.videos);
      //   }
      // })
      
      // .addCase(saveVideoMetadata.fulfilled, (state, action) => {
      //   const newVideo = action.payload.video;

      //   console.log("newVideo", newVideo);

      //   if (state.userInfo && state.userInfo.channel && state.userInfo.channel.videos) {
      //     state.userInfo.channel.videos.push(newVideo);
      //     console.log("Add Video to channel", state.userInfo.channel.videos);
      //   }
      // });
  },
});

export const { logoutSuccess } = authReducer.actions;
export default authReducer.reducer;

// Xử lý đăng nhập bằng Google
export const loginGoogle = createAsyncThunk(
  "auth/loginGoogle",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/auth/login-success", {
        withCredentials: true,
      });

      if (response.data?.user) {
        return { isLoggedIn: true, user: response.data.user };
      } else {
        return thunkAPI.rejectWithValue("Login failed");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Xử lý đăng xuất
export const logoutGoogle = () => async (dispatch) => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
    dispatch(logoutSuccess());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
