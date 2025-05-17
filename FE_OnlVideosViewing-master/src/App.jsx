import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { ThemeProvider } from "./services/ThemeContext";
import { SocketProvider } from "./services/SocketContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginGoogle } from "./redux/reducers/authReducer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginGoogle());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;