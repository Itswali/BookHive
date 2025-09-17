export function generateVerificationOtpEmailTemplate (otpCode) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <h1 style="color: #333; margin: 0;">Verification Code</h1>
    </div>
    <div style="padding: 30px; text-align: center; color: #555;">
        <p style="font-size: 16px; line-height: 1.6;">
            Hello,
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
            Your one-time password (OTP) to verify your account is:
        </p>
        <div style="margin: 20px 0;">
            <span style="display: inline-block; padding: 12px 24px; background-color: #e0eaf4; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #337ab7;">
                ${otpCode}
            </span>
        </div>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">
            This code is valid for 10 minutes. Please do not share this code with anyone.
        </p>
    </div>
    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">
            If you did not request this, please ignore this email.
        </p>
    </div>
</div>`
}
