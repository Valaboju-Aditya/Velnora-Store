const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  const apiKey =
    process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is missing from environment variables"
    );
  }

  if (
    !to ||
    typeof to !== "string"
  ) {
    throw new Error(
      "Email recipient is required"
    );
  }

  if (
    !subject ||
    typeof subject !== "string"
  ) {
    throw new Error(
      "Email subject is required"
    );
  }

  if (
    !html ||
    typeof html !== "string"
  ) {
    throw new Error(
      "Email content is required"
    );
  }

  const recipient =
    to.trim().toLowerCase();

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${apiKey}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        from:
          "VELNORA <onboarding@resend.dev>",

        to: [
          recipient,
        ],

        subject:
          subject.trim(),

        html,
      }),
    }
  );

  let data;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      `Email service returned status ${response.status}`;

    throw new Error(
      message
    );
  }

  return data;
};

module.exports = sendEmail;