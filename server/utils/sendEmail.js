const nodemailer = require("nodemailer");

async function sendEmail({
  to,
  subject,
  html,
}) {
  const transporter =
    nodemailer.createTransport({
      service: "gmail",

      auth: {
        user:
          process.env.EMAIL_USER,

        pass:
          process.env.EMAIL_APP_PASSWORD,
      },
    });

  await transporter.sendMail({
    from: `"VELNORA" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;