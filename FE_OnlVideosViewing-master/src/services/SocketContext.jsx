import { createContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { isLoggedIn, userInfo } = useSelector((state) => state.auth.userLogin);
    const userId = userInfo?.channel?._id;

    // Dùng useRef để giữ kết nối socket không đổi sau mỗi render
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                console.log("❌ User is not logged in, socket disconnected.");
            }
            return;
        }

        if (userId && !socketRef.current) {
            const newSocket = io(import.meta.env.VITE_BACKEND_BASEURL_NO_API, {
                withCredentials: true,
                query: { userId },
                transports: ["websocket"],
            });

            socketRef.current = newSocket;

            newSocket.on("connect", () => {
                console.log("✅ Socket connected:", newSocket.id);
                setIsConnected(true);
            });

            newSocket.on("disconnect", () => {
                console.log("❌ Socket disconnected");
                setIsConnected(false);
            });
        }

        // Cleanup khi unmount component hoặc userId thay đổi
        return () => {
            if (socketRef.current) {
                socketRef.current.off("connect");
                socketRef.current.off("disconnect");
                socketRef.current.disconnect();
                socketRef.current = null;
                console.log("🧹 Socket cleaned up");
            }
        };
    }, [userId]);

    // console.log("Is connected:", isConnected);

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                isConnected,
                isLoggedIn,
                userInfo,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};