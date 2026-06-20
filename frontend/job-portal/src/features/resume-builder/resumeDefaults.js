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

export const accentColors = ["#032722", "#076d57", "#00b879", "#35b995", "#69d4b3", "#707d7a"];
