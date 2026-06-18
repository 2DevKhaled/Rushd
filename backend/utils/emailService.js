const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const User = require("../models/User");

const statusLabels = {
  Applied: "تم التقديم",
  "In Review": "قيد المراجعة",
  Accepted: "تم قبول طلبك",
  Rejected: "لم يتم قبول طلبك",
};

const isEmailEnabled = () =>
  process.env.EMAIL_NOTIFICATIONS_ENABLED !== "false" &&
  Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  );

const isResendEnabled = () =>
  process.env.EMAIL_NOTIFICATIONS_ENABLED !== "false" &&
  Boolean(process.env.RESEND_API_KEY);

const getAppUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const getSender = () =>
  process.env.EMAIL_FROM ||
  process.env.RESEND_FROM ||
  process.env.SMTP_FROM ||
  `"Rushd" <${process.env.SMTP_USER}>`;

const createResendClient = () => {
  if (!isResendEnabled()) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

const createTransporter = () => {
  if (!isEmailEnabled()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildEmailLayout = ({ title, preview, body, actionLabel, actionUrl }) => {
  const safeTitle = escapeHtml(title);
  const safePreview = escapeHtml(preview);
  const safeActionLabel = escapeHtml(actionLabel);
  const safeActionUrl = escapeHtml(actionUrl);

  return `
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeTitle}</title>
      </head>
      <body style="margin:0;background:#f7f1e3;font-family:Arial,Tahoma,sans-serif;color:#1c1710;direction:rtl;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreview}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f1e3;padding:28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffaf0;border:1px solid rgba(155,107,36,.26);border-radius:24px;overflow:hidden;box-shadow:0 22px 60px rgba(66,45,18,.16);">
                <tr>
                  <td style="padding:28px 30px;background:linear-gradient(135deg,#1c1710,#5b3910);color:#fff8ea;">
                    <div style="font-size:13px;font-weight:700;letter-spacing:.08em;color:#f6d38b;">RUSHD</div>
                    <h1 style="margin:10px 0 0;font-size:28px;line-height:1.4;">${safeTitle}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;font-size:16px;line-height:1.9;">
                    ${body}
                    ${
                      actionUrl
                        ? `<div style="margin-top:28px;">
                            <a href="${safeActionUrl}" style="display:inline-block;background:#9b6b24;color:#fff8ea;text-decoration:none;padding:14px 22px;border-radius:14px;font-weight:800;">${safeActionLabel}</a>
                          </div>`
                        : ""
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 30px;border-top:1px solid rgba(155,107,36,.18);font-size:12px;line-height:1.7;color:rgba(28,23,16,.62);">
                    هذه رسالة تلقائية من منصة رُشد. إذا لم تكن تتوقع هذه الرسالة، يمكنك تجاهلها.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const sendMail = async ({ to, subject, text, html }) => {
  const resend = createResendClient();
  if (resend) {
    const { data, error } = await resend.emails.send({
      from: getSender(),
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    });

    if (error) {
      throw new Error(error.message || JSON.stringify(error));
    }

    return data;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] Email notifications are disabled or email provider config is missing.");
    return { skipped: true };
  }

  return transporter.sendMail({
    from: getSender(),
    to,
    subject,
    text,
    html,
  });
};

const logSettledEmailResults = (results, context) => {
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    console.error(
      `[email] ${context}: ${failed.length}/${results.length} messages failed.`,
      failed.map((result) => result.reason?.message || String(result.reason)).join(" | "),
    );
  }
};

const sendNewJobNotificationToJobseekers = async (job) => {
  try {
    if (!isEmailEnabled()) {
      console.warn("[email] New job notifications skipped because email provider config is missing.");
      return;
    }

    const recipients = await User.find({ role: "jobseeker", email: { $ne: "" } }).select("name email");
    if (recipients.length === 0) return;

    const companyName = job.company?.companyName || job.company?.name || "شركة على رُشد";
    const jobUrl = `${getAppUrl()}/job/${job._id}`;
    const safeTitle = escapeHtml(job.title);
    const safeCompany = escapeHtml(companyName);
    const safeLocation = escapeHtml(job.location || "غير محدد");
    const safeType = escapeHtml(job.type || "غير محدد");

    const html = buildEmailLayout({
      title: "فرصة وظيفية جديدة على رُشد",
      preview: `${job.title} لدى ${companyName}`,
      actionLabel: "عرض الوظيفة",
      actionUrl: jobUrl,
      body: `
        <p style="margin:0 0 16px;">مرحبًا،</p>
        <p style="margin:0 0 16px;">تم نشر وظيفة جديدة قد تناسب مسارك المهني:</p>
        <div style="margin:22px 0;padding:18px;border:1px solid rgba(155,107,36,.2);border-radius:18px;background:rgba(155,107,36,.06);">
          <div style="font-size:22px;font-weight:900;color:#1c1710;">${safeTitle}</div>
          <div style="margin-top:8px;color:rgba(28,23,16,.72);">${safeCompany}</div>
          <div style="margin-top:12px;color:#5b3910;font-weight:700;">${safeLocation} • ${safeType}</div>
        </div>
        <p style="margin:0;">افتح تفاصيل الوظيفة وقدّم بسيرتك الذاتية من داخل المنصة.</p>
      `,
    });

    const results = await Promise.allSettled(
      recipients.map((user) =>
        sendMail({
          to: user.email,
          subject: `فرصة جديدة: ${job.title}`,
          text: `تم نشر وظيفة جديدة: ${job.title} لدى ${companyName}. الرابط: ${jobUrl}`,
          html,
        }),
      ),
    );
    logSettledEmailResults(results, "New job notifications");
  } catch (error) {
    console.error("[email] Failed to send new job notifications:", error.message);
  }
};

const sendNewApplicationEmailToEmployer = async ({ job, applicant }) => {
  try {
    if (!isEmailEnabled()) {
      console.warn("[email] New application notification skipped because email provider config is missing.");
      return;
    }

    const employer = job?.company;
    if (!employer?.email || !job?.title || !applicant?.name) return;

    const jobUrl = `${getAppUrl()}/applicants?jobId=${job._id}`;
    const safeApplicantName = escapeHtml(applicant.name);
    const safeApplicantEmail = escapeHtml(applicant.email || "لا يوجد بريد");
    const safeJobTitle = escapeHtml(job.title);

    const html = buildEmailLayout({
      title: "متقدم جديد على وظيفة",
      preview: `${applicant.name} تقدم على ${job.title}`,
      actionLabel: "عرض المتقدمين",
      actionUrl: jobUrl,
      body: `
        <p style="margin:0 0 16px;">مرحبًا،</p>
        <p style="margin:0 0 16px;">وصل طلب تقديم جديد على إحدى وظائفك:</p>
        <div style="margin:22px 0;padding:18px;border:1px solid rgba(155,107,36,.2);border-radius:18px;background:rgba(155,107,36,.06);">
          <div style="font-size:20px;font-weight:900;color:#1c1710;">${safeJobTitle}</div>
          <div style="margin-top:12px;color:#5b3910;font-weight:900;">${safeApplicantName}</div>
          <div style="margin-top:6px;color:rgba(28,23,16,.72);">${safeApplicantEmail}</div>
        </div>
        <p style="margin:0;">افتح صفحة المتقدمين لمراجعة الطلب والسيرة الذاتية.</p>
      `,
    });

    await sendMail({
      to: employer.email,
      subject: `متقدم جديد: ${job.title}`,
      text: `${applicant.name} تقدم على وظيفة ${job.title}. الرابط: ${jobUrl}`,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to send new application notification:", error.message);
  }
};

const sendApplicationStatusEmail = async (application) => {
  try {
    if (!isEmailEnabled()) {
      console.warn("[email] Application status notification skipped because email provider config is missing.");
      return;
    }

    const applicant = application.applicant;
    const job = application.job;
    if (!applicant?.email || !job?.title) return;

    const label = statusLabels[application.status] || application.status;
    const companyName = job.company?.companyName || job.company?.name || "الشركة";
    const jobUrl = `${getAppUrl()}/job/${job._id}`;
    const safeName = escapeHtml(applicant.name || "مرشح رُشد");
    const safeJobTitle = escapeHtml(job.title);
    const safeCompany = escapeHtml(companyName);
    const safeLabel = escapeHtml(label);
    const isAccepted = application.status === "Accepted";
    const isRejected = application.status === "Rejected";

    const message = isAccepted
      ? "تهانينا، تم قبول طلبك لهذه الوظيفة. تابع بريدك وتواصل الشركة للخطوات القادمة."
      : isRejected
        ? "نقدّر وقتك وجهدك. لم يتم قبول طلبك لهذه الوظيفة، ونتمنى لك التوفيق في فرص قادمة."
        : "تم تحديث حالة طلبك. يمكنك متابعة التفاصيل من داخل منصة رُشد.";

    const html = buildEmailLayout({
      title: "تحديث على حالة طلبك",
      preview: `${label}: ${job.title}`,
      actionLabel: "عرض تفاصيل الوظيفة",
      actionUrl: jobUrl,
      body: `
        <p style="margin:0 0 16px;">مرحبًا ${safeName}،</p>
        <p style="margin:0 0 16px;">وصل تحديث جديد على طلبك:</p>
        <div style="margin:22px 0;padding:18px;border:1px solid rgba(155,107,36,.2);border-radius:18px;background:rgba(155,107,36,.06);">
          <div style="font-size:20px;font-weight:900;color:#1c1710;">${safeJobTitle}</div>
          <div style="margin-top:8px;color:rgba(28,23,16,.72);">${safeCompany}</div>
          <div style="margin-top:14px;display:inline-block;border:1px solid rgba(155,107,36,.34);border-radius:999px;padding:8px 14px;color:#5b3910;font-weight:900;background:#fff8ea;">${safeLabel}</div>
        </div>
        <p style="margin:0;">${escapeHtml(message)}</p>
      `,
    });

    await sendMail({
      to: applicant.email,
      subject: `تحديث طلبك: ${label}`,
      text: `مرحبًا ${applicant.name || ""}، حالة طلبك على وظيفة ${job.title}: ${label}. الرابط: ${jobUrl}`,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to send application status notification:", error.message);
  }
};

module.exports = {
  sendApplicationStatusEmail,
  sendNewApplicationEmailToEmployer,
  sendNewJobNotificationToJobseekers,
};
