const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "الاسم الكامل مطلوب"], trim: true },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: [true, "كلمة المرور مطلوبة"] },
    role: {
      type: String,
      enum: {
        values: ["jobseeker", "employer"],
        message: "نوع الحساب غير صحيح",
      },
      required: [true, "نوع الحساب مطلوب"],
    },
    avatar: String,
    resume: String,
    // For Empyloyer
    companyName: String,
    companyDescription: String,
    companyLogo: String,
  },
  { timestamps: true },
);
// Encrypt password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
// Match Entered Password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User" , userSchema); 
