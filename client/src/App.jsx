import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import TaskFormPage from "./pages/TaskFormPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ConfirmAccount from "./pages/ConfirmAccount.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import NewPassword from "./pages/NewPassword.jsx";
import UpdateProfileForm from "./components/UpdateProfileForm.jsx";
import SideBar from "./layouts/SideBar.jsx";
import CategoryPage from "./pages/CategoryPage";
import ThemePage from "./pages/ThemePage";
import { CategoryProvider } from "./context/CategoryContext";
import { ThemeProvider } from "./context/ThemeContex.jsx";
import ContentPageForm from "./pages/ContentPageForm.jsx";
function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ThemeProvider>
          <BrowserRouter>
            <SideBar />
            <Routes>
              <Route path="/" element={<h1>Home Page</h1>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/validate-token" element={<NewPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/add-task" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/profile/update/:id"
                  element={<UpdateProfileForm />}
                />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/theme" element={<ThemePage />} />
                <Route
                  path="/content/add-content"
                  element={<ContentPageForm />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
