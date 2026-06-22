export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_ME: "/api/auth/me",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/user/profile",
    DELETE_RESUME: "/api/user/resume",
  },
  ADMIN: {
    GET_EMPLOYERS: "/api/admin/employers",
    UPDATE_EMPLOYER_STATUS: (id) => `/api/admin/employers/${id}/status`,
  },
  DASHBOARD: {
    OVERVIEW: "/api/analytics/overview",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  JOBS: {
    GET_ALL_JOBS: "/api/jobs",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    POST_JOB: "/api/jobs",
    GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-employer",
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_JOB_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    SAVE_JOB: (id) => `/api/saved-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/saved-jobs/${id}`,
    GET_SAVED_JOBS: "/api/saved-jobs/my",
    GET_ALL: "/api/jobs",
    GET_ONE: (id) => `/api/jobs/${id}`,
    CREATE: "/api/jobs",
    UPDATE: (id) => `/api/jobs/${id}`,
    DELETE: (id) => `/api/jobs/${id}`,
    EMPLOYER_JOBS: "/api/jobs/get-jobs-employer",
    TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
  },
  APPLICATIONS: {
    APPLY_TO_JOB: (id) => `/api/applications/${id}`,
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    GET_MY_APPLICATIONS: "/api/applications/my",
    GET_APPLICATION_BY_ID: (id) => `/api/applications/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
    APPLY: (jobId) => `/api/applications/${jobId}`,
    MY: "/api/applications/my",
    FOR_JOB: (jobId) => `/api/applications/job/${jobId}`,
    GET_ONE: (id) => `/api/applications/${id}`,
  },
  SAVED_JOBS: {
    SAVE: (jobId) => `/api/saved-jobs/${jobId}`,
    UNSAVE: (jobId) => `/api/saved-jobs/${jobId}`,
    MY: "/api/saved-jobs/my",
  },
  NOTIFICATIONS: {
    MY: "/api/notifications",
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
  },
  ANALYTICS: {
    OVERVIEW: "/api/analytics/overview",
  },
  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
  },
  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },
  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
  },
  RESUMES: {
    CREATE: "/api/resumes/create",
    GET_MY: "/api/resumes/my",
    GET_ONE: (id) => `/api/resumes/get/${id}`,
    GET_PUBLIC: (id) => `/api/resumes/public/${id}`,
    UPDATE: "/api/resumes/update",
    DELETE: (id) => `/api/resumes/delete/${id}`,
  },
  RESUME_AI: {
    ENHANCE_PRO_SUMMARY: "/api/resume-ai/enhance-pro-summary",
    ENHANCE_JOB_DESCRIPTION: "/api/resume-ai/enhance-job-description",
    UPLOAD_RESUME: "/api/resume-ai/upload-resume",
  },
};
