/**
 * Base Email HTML Template Layout
 */
const getBaseEmailTemplate = ({ title, message, highlightText, highlightColor, highlightBg, footerText }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">${title}</h2>
      <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: center;">
        ${message}
      </p>
      
      ${highlightText ? `
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; color: ${highlightColor || '#4a90e2'}; padding: 15px 25px; background-color: ${highlightBg || '#f4f8ff'}; border-radius: 8px; letter-spacing: 5px;">
          ${highlightText}
        </span>
      </div>
      ` : ''}
      
      <p style="color: #555; font-size: 14px; text-align: center;">
        ${footerText}
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">
        If you did not request this email, you can safely ignore it.
      </p>
    </div>
  `;
};

/**
 * Returns the HTML and plain text templates for the email verification OTP.
 */
const getVerificationEmailTemplate = (otpCode) => {
  const text = `Welcome to our platform! Your email verification code is: ${otpCode}. It expires in 10 minutes.`;
  
  const html = getBaseEmailTemplate({
    title: 'Welcome to our platform!',
    message: 'Thank you for registering. To complete your sign-up process, please use the verification code below:',
    highlightText: otpCode,
    highlightColor: '#4a90e2',
    highlightBg: '#f4f8ff',
    footerText: 'This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.'
  });

  return { text, html };
};

/**
 * Returns the HTML and plain text templates for the password reset OTP.
 */
const getPasswordResetEmailTemplate = (otpCode) => {
  const text = `You requested a password reset. Your OTP is: ${otpCode}. It expires in 10 minutes.`;
  
  const html = getBaseEmailTemplate({
    title: 'Password Reset Request',
    message: 'We received a request to reset your password. Please use the verification code below to proceed:',
    highlightText: otpCode,
    highlightColor: '#e24a4a',
    highlightBg: '#fff4f4',
    footerText: 'This code is valid for <strong>10 minutes</strong>. If you did not request this, please secure your account.'
  });

  return { text, html };
};

module.exports = {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate
};

