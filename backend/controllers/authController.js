const User = require("../models/User");
const jwt = require("jsonwebtoken");

const allowedRoles = ["jobseeker", "employer"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

const buildUserResponse = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  token: generateToken(user._id),
  companyName: user.companyName || "",
  companyDescription: user.companyDescription || "",
  companyLogo: user.companyLogo || "",
  resume: user.resume || "",
});

const validatePassword = (password) => {
  if (!password) return "كلمة المرور مطلوبة";
  if (password.length < 8) return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  if (!/[a-z]/.test(password)) return "كلمة المرور يجب أن تحتوي على حرف صغير";
  if (!/[A-Z]/.test(password)) return "كلمة المرور يجب أن تحتوي على حرف كبير";
  if (!/\d/.test(password)) return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  return "";
};

// @desc Register new user
exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password, avatar, role } = req.body;

    if (!name) {
      return res.status(400).json({ message: "الاسم الكامل مطلوب" });
    }

    if (!email) {
      return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "اختر نوع الحساب" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });

    const user = await User.create({ name, email, password, role, avatar });
    res.status(201).json(buildUserResponse(user));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });
    }

    res.status(500).json({ message: "تعذر إنشاء الحساب. حاول مرة أخرى." });
  }
};

// @desc Loign user
exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" });
    }

    if (!password) {
      return res.status(400).json({ message: "كلمة المرور مطلوبة" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }
    res.json(buildUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: "تعذر تسجيل الدخول. حاول مرة أخرى." });
  }
};
// @desc get logged-in user
exports.getMe = async (req, res) => {
  res.json(req.user);
};
