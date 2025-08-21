// Vercel API function for tracking website access
// Located at: /api/access-log

export default async function handler(req, res) {
  console.log('API endpoint called:', req.method, req.url);
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, userAgent, timestamp } = req.body;
    
    // Get IP address with multiple fallbacks
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.headers['x-real-ip'] || 
               req.headers['cf-connecting-ip'] ||
               req.connection.remoteAddress ||
               req.socket.remoteAddress ||
               'Unknown';
    
    // Rate limiting check
    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      console.log('Rate limit exceeded for IP:', ip);
      return res.status(429).json({ 
        error: 'Too many attempts. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      });
    }
    
    // Get geographic info from IP
    const geoInfo = await getGeoInfo(ip);
    
    // Validate password with environment variable
    const validPassword = process.env.ACCESS_PASSWORD || 'sendnreceive2026';
    const isAuthorized = password === validPassword;
    
    // Security logging
    console.log('Access attempt:', {
      ip,
      authorized: isAuthorized,
      geoInfo,
      userAgent: userAgent?.substring(0, 100), // Truncate for security
      timestamp: new Date().toISOString()
    });
    
    // Log access attempt
    const accessLog = {
      ip,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || req.headers['user-agent'],
      password: isAuthorized ? '[CORRECT]' : '[INCORRECT]',
      authorized: isAuthorized,
      geoInfo,
      success: isAuthorized
    };
    
    // Send email notification
    if (isAuthorized) {
      await sendEmailNotification(accessLog);
    }
    
    // Log to console for debugging
    console.log('Access attempt:', accessLog);
    
    // Return response
    return res.status(200).json({
      success: isAuthorized,
      message: isAuthorized ? 'Access granted' : 'Access denied',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Access log error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map();

// Rate limiting function
async function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5; // Max 5 attempts per 15 minutes
  
  const key = `rate_limit_${ip}`;
  const attempts = rateLimitStore.get(key) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    const oldestAttempt = Math.min(...recentAttempts);
    const retryAfter = Math.ceil((oldestAttempt + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Add current attempt
  recentAttempts.push(now);
  rateLimitStore.set(key, recentAttempts);
  
  // Clean up old entries (prevent memory leaks)
  if (rateLimitStore.size > 1000) {
    const oldestKey = rateLimitStore.keys().next().value;
    rateLimitStore.delete(oldestKey);
  }
  
  return { allowed: true };
}

// Get geographic information from IP
async function getGeoInfo(ip) {
  try {
    // Skip localhost and private IPs
    if (ip === 'Unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return { country: 'Local', city: 'Local' };
    }
    
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,city,region,timezone`);
    const data = await response.json();
    
    return {
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown'
    };
  } catch (error) {
    console.error('Geo lookup error:', error);
    return { country: 'Unknown', city: 'Unknown' };
  }
}

// Send email notification
async function sendEmailNotification(accessLog) {
  try {
    // Use environment variable for email service
    const emailService = process.env.EMAIL_SERVICE || 'sendgrid';
    
    if (emailService === 'sendgrid') {
      await sendViaSendGrid(accessLog);
    } else if (emailService === 'resend') {
      await sendViaResend(accessLog);
    } else {
      // Fallback to console log
      console.log('Email notification (no service configured):', accessLog);
    }
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

// SendGrid implementation
async function sendViaSendGrid(accessLog) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TO_EMAIL = process.env.NOTIFICATION_EMAIL;
  
  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    console.log('SendGrid not configured, logging to console:', accessLog);
    return;
  }
  
  const emailContent = `
🚨 SendNReceive Website Access Alert

✅ Access Granted
📍 IP Address: ${accessLog.ip}
🌍 Location: ${accessLog.geoInfo.city}, ${accessLog.geoInfo.country}
⏰ Time: ${new Date(accessLog.timestamp).toLocaleString()}
🌐 Browser: ${accessLog.userAgent}
🔑 Password: ${accessLog.password}

---
Sent from SendNReceive Construction Page
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
      subject: '🚨 SendNReceive Website Access Alert',
      content: [{ type: 'text/plain', value: emailContent }],
    }),
  });
  
  if (!response.ok) {
    throw new Error(`SendGrid error: ${response.status}`);
  }
}

// Resend implementation (alternative to SendGrid)
async function sendViaResend(accessLog) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.NOTIFICATION_EMAIL;
  
  if (!RESEND_API_KEY || !TO_EMAIL) {
    console.log('Resend not configured, logging to console:', accessLog);
    return;
  }
  
  const emailContent = `
🚨 SendNReceive Website Access Alert

✅ Access Granted
📍 IP Address: ${accessLog.ip}
🌍 Location: ${accessLog.geoInfo.city}, ${accessLog.geoInfo.country}
⏰ Time: ${new Date(accessLog.timestamp).toLocaleString()}
🌐 Browser: ${accessLog.userAgent}
🔑 Password: ${accessLog.password}

---
Sent from SendNReceive Construction Page
  `;
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SendNReceive Security <noreply@sendnreceive.com>',
      to: [TO_EMAIL],
      subject: '🚨 SendNReceive Website Access Alert',
      text: emailContent,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Resend error: ${response.status}`);
  }
}
