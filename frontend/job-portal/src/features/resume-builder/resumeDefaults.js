export const emptyResume = {
  title: "سيرة ذاتية جديدة",
  public: false,
  template: "classic",
  accentColor: "#111827",
  professionalSummary: "",
  skills: [],
  languages: [],
  personalInfo: {
    image: "",
    fullName: "",
    profession: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  experience: [],
  projects: [],
  education: [],
};

export const resumeTemplates = [
  { id: "classic", label: "كلاسيكي" },
  { id: "modern", label: "حديث" },
  { id: "minimal", label: "بسيط" },
];

export const accentColors = ["#1c1710", "#9b6b24", "#d6a84f", "#f6d38b", "#4b3a1c", "#7c5a1f"];
