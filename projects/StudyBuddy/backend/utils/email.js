const nodemailer = require("nodemailer");
const pool = require("../config/db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


async function sendAdminTutorApprovalEmail(tutor, subjects = []) {
  try {
    // Get all admin emails
    const adminResult = await pool.query(
      "SELECT email FROM users WHERE role = 'admin'"
    );
    const adminEmails = adminResult.rows.map(a => a.email).join(",");

    // Get school name
    const schoolResult = await pool.query(
      "SELECT name FROM schools WHERE id = $1",
      [tutor.school_id]
    );
    const schoolName = schoolResult.rows[0]?.name || "Unknown School";

    // Get subject names from IDs
    let subjectNames = [];
    if (subjects.length > 0) {
      const subjectResult = await pool.query(
        `SELECT name FROM subjects WHERE id = ANY($1::int[])`,
        [subjects]
      );
      subjectNames = subjectResult.rows.map(s => s.name);
    }

    const subjectList = subjectNames.length ? subjectNames.join(", ") : "None provided";

    const html = `
      <h2>New Tutor Application Pending Approval</h2>
      <p><strong>Name:</strong> ${tutor.name}</p>
      <p><strong>Email:</strong> ${tutor.email}</p>
      <p><strong>School:</strong> ${schoolName}</p>
      <p><strong>Bio:</strong> ${tutor.bio || "No bio provided"}</p>
      <p><strong>Subjects:</strong> ${subjectList}</p>
      <br/>
      <p>Please approve or decline this tutor in the Admin Panel.</p>
    `;

    return transporter.sendMail({
      from: `"Study Buddy" <${process.env.EMAIL_USER}>`,
      to: adminEmails,
      subject: "New Tutor Application Pending Approval",
      html
    });

  } catch (err) {
    console.error("Error sending admin email:", err);
  }
}

async function sendTutorApprovedEmail(tutorEmail, tutorName) {
  return transporter.sendMail({
    from: `"Study Buddy" <${process.env.EMAIL_USER}>`,
    to: tutorEmail,
    subject: "Your Tutor Application Has Been Approved 🎉",
    html: `
      <h2>Welcome aboard, ${tutorName}!</h2>
      <p>Your tutor account has been <strong>approved</strong>.  
      You may now log in and access the full tutor dashboard.</p>
      <br/>
      <p>We're happy to have you help students succeed!</p>
    `
  });
}


async function sendTutorRejectedEmail(tutorEmail, tutorName) {
  return transporter.sendMail({
    from: `"Study Buddy" <${process.env.EMAIL_USER}>`,
    to: tutorEmail,
    subject: "Your Tutor Application Was Not Approved",
    html: `
      <h2>Hello ${tutorName},</h2>
      <p>Thank you for your interest in becoming a tutor.</p>
      <p>After reviewing your application, we were unable to approve it at this time.</p>
      <br/>
      <p>You are welcome to apply again in the future.</p>
    `
  });
}

module.exports = {
  sendAdminTutorApprovalEmail,
  sendTutorApprovedEmail,
  sendTutorRejectedEmail
};
