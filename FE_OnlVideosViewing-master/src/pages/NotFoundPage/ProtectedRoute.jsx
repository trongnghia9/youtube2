import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../../apis/config";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/auth/login-success", { withCredentials: true });
                if (response.data?.user) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
