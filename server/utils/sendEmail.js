const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        from:
          "VELNORA <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to send email"
    );
  }

  return data;
};

module.exports = sendEmail;