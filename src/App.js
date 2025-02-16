import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import LandingPage from "./screens/LandingPage/LandingPage";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import MyNotes from "./screens/MyNotes/MyNotes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen/RegisterScreen";
import CreateNote from "./screens/CreateNote/createNote";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import Profile from "./screens/ProfileScreen/ProfileScreen";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth); // Detects token removal

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/mynotes" /> : <LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Protected Routes (Accessible only when authenticated) */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/mynotes" element={<MyNotes />} />
            <Route path="/createnotes" element={<CreateNote />} />
            <Route path="/myprofile" element = {<Profile />} />
          </Route>

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
