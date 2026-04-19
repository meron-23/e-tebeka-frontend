"use client";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_SERVICE_ID = "service_c2ui0om";
const EMAILJS_TEMPLATE_ID = "template_t11rarq";
const EMAILJS_PUBLIC_KEY = "UCMBkkWS1bxKc5ujR";

interface StudentApprovalEmailInput {
  to_email: string;
  to_name: string;
  login_url?: string;
}

export async function sendStudentApprovalEmail({
  to_email,
  to_name,
  login_url = typeof window !== "undefined" ? `${window.location.origin}/login` : "",
}: StudentApprovalEmailInput) {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email,
        to_name,
        user_name: to_name,
        email: to_email,
        login_url,
        message:
          "Your E-Tebeka student account has been approved. You can now sign in and access the full student portal.",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send approval email.");
  }
}
