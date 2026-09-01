const nodemailer = require('nodemailer');
const config = require('../../config/env'); // Assume this has SMTP config or we can just use process.env directly

// Create a transporter using environment variables or a default testing service like Ethereal
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Chat App'}" <${process.env.FROM_EMAIL || 'noreply@chatapp.com'}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`, // Fallback to wrap text in p tags if HTML is not provided
    });

    console.log('✅ Email sent: %s', info.messageId);
    
    // If using ethereal email for development, this will log the preview URL
    if (info.messageId && process.env.SMTP_HOST === 'smtp.ethereal.email') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('❌ Error sending email: ', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = {
  sendEmail,
};

