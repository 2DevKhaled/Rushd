export const validateEmail = (email) => {
  if (!String(email || "").trim()) return "البريد الإلكتروني مطلوب";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) return "أدخل بريدًا إلكترونيًا صحيحًا";

  return "";
};
export const validatePassword = (password) => {
  if (!password) return "كلمة المرور مطلوبة";
  if (password.length < 8) return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  if (!/(?=.*[a-z])/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على حرف صغير";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على حرف كبير";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  }
  return "";
};

export const normalizeApiError = (error, fallbackMessage) => {
  const message = error?.response?.data?.message || "";

  const translations = {
    "User already exists": "هذا البريد الإلكتروني مستخدم بالفعل",
    "Invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    "Invild emial or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    "Not authorized , no token": "يجب تسجيل الدخول أولاً",
    "Not authorized, user not found": "انتهت الجلسة أو لم يعد الحساب موجودًا",
    "Token Failed": "انتهت الجلسة. سجل الدخول مرة أخرى.",
  };

  if (!message) return fallbackMessage;

  const normalized = message.trim();
  return translations[normalized] || normalized || fallbackMessage;
};

export const validateAvatar = (file) => {
  if (!file) return ""; // لانه اختياري
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return "الصورة يجب أن تكون بصيغة JPG أو PNG";
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "حجم الصورة يجب أن يكون أقل من 5MB";
  }
  return "";
};
