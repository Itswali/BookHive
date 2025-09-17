import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {
    const message = generateVerificationOtpEmailTemplate();
    sendEmail({
      email,
      subject: "BookHive Digital Library System",
      message,
    });
    res.status(200).json({
      sucess: true,
      message: "Verification code sent sucessfully.",
    })

   } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Verificatin code failed to send",
    });
   }
}
