import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import channelReducer from "./reducers/channelReducer";
import videoReducer from "./reducers/videoReducer";
import shortVideoReducer from "./reducers/shortVideoReducer";
import blogReducer from "./reducers/blogReducer";
import commentReducer from "./reducers/commentReducer";
import notificationReducer from "./reducers/notificationReducer";
import playlistReducer from "./reducers/playlistReducer";
import viewHistoryReducer from "./reducers/viewHistoryReducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        channel: channelReducer,
        video: videoReducer,
        shortVideo: shortVideoReducer,
        blog: blogReducer,
        comment: commentReducer,
        notification: notificationReducer,
        playlist: playlistReducer,
        viewHistory: viewHistoryReducer,
    },
});

// import rootReducer from "./reducers/rootReducer";
// import { createStore, applyMiddleware } from "redux";
// import { persistStore } from "redux-persist";
// import { thunk } from "redux-thunk";

// const reduxStore = () => {
//     const store = createStore(rootReducer, applyMiddleware(thunk));
//     const persistor = persistStore(store);

//     return { store, persistor };
// };

// export default reduxStore;