export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const TO_EMAIL = process.env.NOTIFICATION_EMAIL;
    
    if (!SENDGRID_API_KEY || !TO_EMAIL) {
      return res.status(400).json({ 
        error: 'Email configuration missing',
        sendgrid: !!SENDGRID_API_KEY,
        email: !!TO_EMAIL
      });
    }

    const testEmailContent = `
🧪 SendNReceive Email System Test

✅ Email system is working correctly!
📍 Test Time: ${new Date().toLocaleString()}
🌐 API Endpoint: /api/test-email
🔧 Environment: ${process.env.NODE_ENV || 'development'}

---
This is a test email from your SendNReceive security system.
If you receive this, your email notifications are properly configured!
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: TO_EMAIL }] }],
        from: { email: 'noreply@sendnreceive.com', name: 'SendNReceive Security' },
        subject: '🧪 SendNReceive Email System Test',
        content: [{ type: 'text/plain', value: testEmailContent }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Test email sent successfully!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message
    });
  }
}
