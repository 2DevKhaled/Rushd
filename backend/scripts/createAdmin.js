require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  const name = String(process.env.ADMIN_NAME || "مدير النظام").trim();
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || password.length < 8) {
    throw new Error("أضف ADMIN_EMAIL وADMIN_PASSWORD (8 أحرف على الأقل) إلى ملف البيئة");
  }

  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.name = name;
    existingUser.password = password;
    existingUser.role = "admin";
    existingUser.accountStatus = "active";
    existingUser.approvedAt = new Date();
    existingUser.suspendedAt = null;
    existingUser.suspendedBy = null;
    await existingUser.save();
    console.log(`Admin updated: ${email}`);
    process.exit(0);
  }

  await User.create({ name, email, password, role: "admin", accountStatus: "active" });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
