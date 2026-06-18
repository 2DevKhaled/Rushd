const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  userId,
  type,
  title,
  message,
  link = "",
  metadata = {},
}) => {
  const targetUser = user || userId;
  if (!targetUser || !type || !title || !message) return null;

  try {
    return await Notification.create({
      user: targetUser,
      type,
      title,
      message,
      link,
      metadata,
    });
  } catch (error) {
    console.error("[notification] Failed to create notification:", error.message);
    return null;
  }
};

const createNotifications = async (notifications) => {
  const validNotifications = notifications.filter(
    (notification) =>
      (notification.user || notification.userId) &&
      notification.type &&
      notification.title &&
      notification.message,
  );

  if (validNotifications.length === 0) return [];

  try {
    return await Notification.insertMany(
      validNotifications.map(({ user, userId, ...notification }) => ({
        ...notification,
        user: user || userId,
      })),
      { ordered: false },
    );
  } catch (error) {
    console.error("[notification] Failed to create notifications:", error.message);
    return [];
  }
};

module.exports = {
  createNotification,
  createNotifications,
};
