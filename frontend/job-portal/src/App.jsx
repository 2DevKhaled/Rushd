import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobsDashboard from "./pages/JobSeeker/JobsDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import ProtectedRoute from "./routers/ProtectedRoute";
import EmployerDashboard from "./pages/Employer / EmployerDashboard";
import JobPostingForm from "./pages/Employer /JobPostingForm";
import ManageJobs from "./pages/Employer /ManageJobs";
import ApplicationsViewer from "./pages/Employer /ApplicationsViewer";
import EmployerProfilePage from "./pages/Employer /EmployerProfilePage";
import EditProfileDetails from "./pages/Employer /EditProfileDetails";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import InterviewDashboard from "./features/interview-prep/pages/Home/Dashboard";
import InterviewPrep from "./features/interview-prep/pages/InterviewPrep/InterviewPrep";
import ResumeBuilder from "./features/resume-builder/ResumeBuilder";
import ResumeDashboard from "./features/resume-builder/ResumeDashboard";
import ResumePublicPreview from "./features/resume-builder/ResumePublicPreview";
import AdminDashboard from "./pages/Admin/AdminDashboard";
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* Job Seeker Routes */}
            <Route path="/find-jobs" element={<JobsDashboard />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<JobSeekerDashboard />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/interview-prep" element={<InterviewDashboard />} />
              <Route path="/resume-builder" element={<ResumeDashboard />} />
              <Route
                path="/resume-builder/:resumeId"
                element={<ResumeBuilder />}
              />
              <Route
                path="/interview-prep/dashboard"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/interview-prep/:sessionId"
                element={<InterviewPrep />}
              />
            </Route>
            <Route
              path="/resume-builder/view/:resumeId"
              element={<ResumePublicPreview />}
            />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute requiredRole="employer" />}>
              <Route
                path="/employer-dashboard"
                element={<EmployerDashboard />}
              />
              <Route path="/post-job" element={<JobPostingForm />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
              <Route path="/applicants" element={<ApplicationsViewer />} />
              <Route
                path="/company-profile"
                element={<EmployerProfilePage />}
              />
              <Route
                path="/company-profile/edit"
                element={<EditProfileDetails />}
              />
            </Route>
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            {/* Catch all route */}
            <Route path="/*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
