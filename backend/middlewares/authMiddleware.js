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
      next();
    } else {
      res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
    }
  } catch (error) {
    res.status(401).json({ message: "انتهت الجلسة. سجل الدخول مرة أخرى." });
  }
};
module.exports = { protect };
