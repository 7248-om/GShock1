const nodemailer = require('nodemailer');

// Create email transporter using admin credentials
const createTransporter = () => {
  console.log('📧 Creating email transporter...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' : 'NOT SET');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send broadcast email to all users
async function sendBroadcastEmail(recipients, adminEmail, subject, textContent, fromName) {
  try {
    console.log('📨 Starting broadcast...');
    console.log('Recipients count:', recipients.length);
    console.log('Admin email:', adminEmail);
    console.log('Subject:', subject);
    
    const transporter = createTransporter();

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided');
    }

    // Send emails in batches to avoid rate limiting
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const mailOptions = {
        from: `"${fromName || 'Robusta Admin'}" <${adminEmail}>`,
        bcc: batch.join(','), // Using BCC to protect email addresses
        subject: subject,
        text: textContent,
      };

      console.log('Sending batch with', batch.length, 'recipients...');
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email batch sent to ${batch.length} recipients`);
    }

    console.log('✅ Broadcast completed successfully');
    return { success: true, recipientCount: recipients.length };
  } catch (error) {
    console.error('❌ Email broadcast error:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

// Send individual email (for testing)
async function sendSingleEmail(recipient, adminEmail, subject, textContent, fromName) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${fromName || 'Robusta Admin'}" <${adminEmail}>`,
      to: recipient,
      subject: subject,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
}

module.exports = {
  sendBroadcastEmail,
  sendSingleEmail,
  createTransporter,
};
