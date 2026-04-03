import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import FacultyLogin from "./pages/FacultyLogin";
import MentorLogin from "./pages/MentorLogin";
import StudentLogin from "./pages/StudentLogin";
import Index from "./pages/Index";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Sections from "./pages/Sections";
import Mentors from "./pages/Mentors";
import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import Announcements from "./pages/Announcements";
import ArchivePage from "./pages/Archive";
import Profile from "./pages/Profile";
import Timetable from "./pages/Timetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login/student" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/login" element={<Navigate to="/login/student" replace />} />
      <Route path="/login/admin" element={user ? <Navigate to="/dashboard" replace /> : <AdminLogin />} />
      <Route path="/login/faculty" element={user ? <Navigate to="/dashboard" replace /> : <FacultyLogin />} />
      <Route path="/login/mentor" element={user ? <Navigate to="/dashboard" replace /> : <MentorLogin />} />
      <Route path="/login/mentors" element={user ? <Navigate to="/dashboard" replace /> : <MentorLogin />} />
      <Route path="/login/student_mentor" element={user ? <Navigate to="/dashboard" replace /> : <MentorLogin />} />
      <Route path="/login/student" element={user ? <Navigate to="/dashboard" replace /> : <StudentLogin />} />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timetable" element={<Timetable />} />
      </Route>
      <Route
        path="/admin"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login/admin" replace />}
      />
      <Route
        path="/student"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login/student" replace />}
      />
      <Route
        path="/faculty"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login/faculty" replace />}
      />
      <Route
        path="/mentor"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login/mentor" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
