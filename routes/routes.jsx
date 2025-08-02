import { createBrowserRouter } from "react-router-dom";
import App from "../src/App";
import StudentDashboard from "../src/pages/StudentDashboard";
import TeacherDashboard from "../src/pages/TeacherDashboard";
import NotFound from "../src/pages/NotFound";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import ProtectedRoute from "../src/components/ProtectedRoute/ProtectedRoute";
import Landing from "../src/pages/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
       {
        path: "", 
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup", 
        element: <Signup />,
      },
      {
        path: "student-dashboard",
        element: (
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "teacher-dashboard", 
        element: (
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "*", 
        element: <NotFound />,
      },
    ],
  },
]);
