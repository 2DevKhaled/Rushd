const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      readAt: null,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, readAt: null },
      { readAt: new Date() },
    );

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
