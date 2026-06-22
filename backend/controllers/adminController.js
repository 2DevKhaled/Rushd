const mongoose = require("mongoose");
const User = require("../models/User");

const employerFields = "name email avatar companyName companyLogo accountStatus approvedAt suspendedAt createdAt updatedAt";

exports.getEmployers = async (req, res) => {
  try {
    const status = String(req.query.status || "").trim();
    const search = String(req.query.search || "").trim();
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const query = { role: "employer" };
    const conditions = [];

    if (["pending", "active", "suspended"].includes(status)) {
      conditions.push(
        status === "active"
          ? { $or: [{ accountStatus: "active" }, { accountStatus: { $exists: false } }] }
          : { accountStatus: status },
      );
    }
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      conditions.push({
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
          { companyName: { $regex: escapedSearch, $options: "i" } },
        ],
      });
    }
    if (conditions.length) query.$and = conditions;

    const [employers, total, statusCounts] = await Promise.all([
      User.find(query)
        .select(employerFields)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
      User.aggregate([
        { $match: { role: "employer" } },
        { $group: { _id: { $ifNull: ["$accountStatus", "active"] }, count: { $sum: 1 } } },
      ]),
    ]);

    const counts = { pending: 0, active: 0, suspended: 0 };
    statusCounts.forEach(({ _id, count }) => {
      if (Object.hasOwn(counts, _id)) counts[_id] = count;
    });

    res.json({ employers, total, page, pages: Math.ceil(total / limit), counts });
  } catch (error) {
    res.status(500).json({ message: "تعذر تحميل حسابات أصحاب العمل" });
  }
};

exports.updateEmployerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({ message: "يمكن اعتماد الحساب أو إيقافه فقط" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "معرّف الحساب غير صحيح" });
    }

    const update = { accountStatus: status };
    if (status === "active") {
      update.approvedAt = new Date();
      update.approvedBy = req.user._id;
      update.suspendedAt = null;
      update.suspendedBy = null;
    } else {
      update.suspendedAt = new Date();
      update.suspendedBy = req.user._id;
    }

    const employer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "employer" },
      update,
      { new: true, runValidators: true },
    ).select(employerFields);

    if (!employer) {
      return res.status(404).json({ message: "حساب صاحب العمل غير موجود" });
    }

    res.json({
      message: status === "active" ? "تم تفعيل حساب صاحب العمل" : "تم إيقاف حساب صاحب العمل",
      employer,
    });
  } catch (error) {
    res.status(500).json({ message: "تعذر تحديث حالة الحساب" });
  }
};
