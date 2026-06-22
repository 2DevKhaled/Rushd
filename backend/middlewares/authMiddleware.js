const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Middlewere to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "انتهت الجلسة أو لم يعد الحساب موجودًا" });
      }
      if (req.user.role === "employer" && req.user.accountStatus === "pending") {
        return res.status(403).json({
          code: "ACCOUNT_PENDING",
          message: "حساب صاحب العمل بانتظار موافقة الإدارة",
        });
      }
      if (req.user.accountStatus === "suspended") {
        return res.status(403).json({
          code: "ACCOUNT_SUSPENDED",
          message: "تم إيقاف الحساب من الإدارة",
        });
      }
      next();
    } else {
      res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
    }
  } catch (error) {
    res.status(401).json({ message: "انتهت الجلسة. سجل الدخول مرة أخرى." });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "ليس لديك صلاحية لتنفيذ هذا الإجراء" });
  }
  next();
};

module.exports = { protect, authorize };
