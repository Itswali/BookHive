import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {

    const message = generateVerificationOtpEmailTemplate(verificationCode);

    await sendEmail(email, "BookHive Digital Library System - Email Verification", message);

    res.status(200).json({
      sucess: true,
      message: "Verification code sent successfully.",
    });

   } catch (error) {
    console.error("Error sending verification code:", error); // Add console.error for debugging
    return res.status(500).json({
      sucess: false,
      message: "Verification code failed to send.",
    });
   }
}
