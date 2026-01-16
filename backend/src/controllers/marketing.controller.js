const User = require('../models/user.model');
const { sendBroadcastEmail, sendSingleEmail } = require('../utils/emailService');

// Get all users for email marketing
async function getEmailRecipients(req, res) {
  try {
    const users = await User.find({}, { email: 1, name: 1 });
    
    if (!users || users.length === 0) {
      return res.status(404).json({ 
        message: 'No users found',
        users: []
      });
    }

    res.status(200).json({
      success: true,
      totalRecipients: users.length,
      users: users,
    });
  } catch (error) {
    console.error('Error fetching email recipients:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching recipients: ' + error.message 
    });
  }
}

// Send broadcast email to all users
async function sendBroadcast(req, res) {
  try {
    const { subject, textContent } = req.body;
    const adminUser = req.user; // From auth middleware

    console.log('📨 Broadcast request received');
    console.log('Subject:', subject);
    console.log('Content length:', textContent ? textContent.length : 0);
    console.log('Admin user:', adminUser?.email);

    // Validation
    if (!subject || !textContent) {
      console.log('❌ Validation failed: missing subject or content');
      return res.status(400).json({ 
        success: false,
        message: 'Subject and content are required' 
      });
    }

    if (!adminUser || !adminUser.email) {
      console.log('❌ Validation failed: admin user or email not found');
      return res.status(401).json({ 
        success: false,
        message: 'Admin email not found' 
      });
    }

    // Fetch all user emails
    console.log('🔍 Fetching all user emails...');
    const users = await User.find({}, { email: 1, name: 1 });

    if (!users || users.length === 0) {
      console.log('❌ No users found in database');
      return res.status(404).json({ 
        success: false,
        message: 'No users found to send emails to' 
      });
    }

    console.log(`✅ Found ${users.length} users`);
    const emailList = users.map(u => u.email).filter(email => email); // Filter out empty emails

    console.log('Valid emails:', emailList.length);

    if (emailList.length === 0) {
      console.log('❌ No valid email addresses found');
      return res.status(404).json({ 
        success: false,
        message: 'No valid email addresses found in user database' 
      });
    }

    // Send broadcast
    console.log('📧 Sending broadcast...');
    const result = await sendBroadcastEmail(
      emailList,
      adminUser.email,
      subject,
      textContent,
      adminUser.name
    );

    console.log('✅ Broadcast sent successfully:', result);
    res.status(200).json({
      success: true,
      message: 'Broadcast email sent successfully',
      recipientCount: result.recipientCount,
    });
  } catch (error) {
    console.error('❌ Broadcast error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending broadcast: ' + error.message 
    });
  }
}

// Save email template for future use
async function saveEmailTemplate(req, res) {
  try {
    const { templateName, subject, htmlContent } = req.body;

    if (!templateName || !subject || !htmlContent) {
      return res.status(400).json({ 
        success: false,
        message: 'Template name, subject, and content are required' 
      });
    }

    // Here you could save to a database
    // For now, we'll return a success message
    res.status(200).json({
      success: true,
      message: 'Email template structure ready (save to DB as needed)',
      template: {
        name: templateName,
        subject,
        htmlContent,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Template save error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error saving template: ' + error.message 
    });
  }
}

module.exports = {
  getEmailRecipients,
  sendBroadcast,
  saveEmailTemplate,
};
