# 🔐 SendNReceive Access Tracking Setup

This system provides secure password-based access to your website with IP tracking and email notifications.

## 🚀 Features

- **Secure Password Access**: Real password protection (no more easy bypass)
- **IP Tracking**: Logs visitor IP addresses and geographic location
- **Email Notifications**: Instant alerts when someone accesses the site
- **Geographic Info**: Shows city, country, and timezone of visitors
- **Browser Detection**: Tracks user agent information
- **Access Logging**: All attempts are logged for security monitoring

## ⚙️ Vercel Environment Variables Setup

### 1. Required Variables

Add these to your Vercel project settings:

```bash
# Password for website access (change this!)
ACCESS_PASSWORD=your_secure_password_here

# Email service (choose one: sendgrid or resend)
EMAIL_SERVICE=sendgrid

# Notification email (where you'll receive alerts)
NOTIFICATION_EMAIL=your_email@example.com
```

### 2. Email Service Configuration

#### Option A: SendGrid (Recommended)
```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

**Setup:**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Free tier: 100 emails/day

#### Option B: Resend (Alternative)
```bash
RESEND_API_KEY=your_resend_api_key_here
```

**Setup:**
1. Sign up at [Resend](https://resend.com/)
2. Create an API key
3. Free tier: 5,000 emails/month

## 🔧 How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the values above
5. Deploy to apply changes

## 📧 Email Notification Format

When someone accesses your website, you'll receive an email like this:

```
🚨 SendNReceive Website Access Alert

✅ Access Granted
📍 IP Address: 192.168.1.100
🌍 Location: Amsterdam, Netherlands
⏰ Time: 2026-01-15 14:30:25
🌐 Browser: Chrome 120.0.0.0
🔑 Password: [CORRECT]

---
Sent from SendNReceive Construction Page
```

## 🛡️ Security Features

- **Password Protection**: Real authentication (no URL parameters)
- **IP Tracking**: Every access attempt is logged
- **Geographic Location**: Know where visitors are from
- **Browser Detection**: Track what browsers are being used
- **Timestamp Logging**: Exact time of access attempts
- **Failed Attempt Tracking**: Logs incorrect password attempts

## 🧪 Testing

### Test the System
1. Deploy to Vercel with environment variables
2. Visit your website
3. Click "🔐 Developer Access" button
4. Enter the password from `ACCESS_PASSWORD`
5. Check your email for the notification

### Clear Authorization (for testing)
```javascript
// Run this in browser console to test again
clearAuthorization();
```

## 📁 Files Created

- `api/access-log.js` - Vercel API function for tracking
- `under-construction.html` - Updated with password modal
- `construction-bypass.js` - Enhanced with secure authentication
- `ACCESS_TRACKING_SETUP.md` - This setup guide

## 🔒 Default Password

The default password is: `sendnreceive2026`

**⚠️ IMPORTANT: Change this immediately after setup!**

## 🚀 Deployment

1. Push all files to your repository
2. Deploy to Vercel
3. Add environment variables in Vercel dashboard
4. Test the system

## 📊 Monitoring

- Check Vercel function logs for access attempts
- Monitor email notifications
- Review geographic distribution of visitors
- Track access patterns and times

## 🆘 Troubleshooting

### No Email Notifications
- Check environment variables are set correctly
- Verify API keys are valid
- Check Vercel function logs for errors

### Password Not Working
- Verify `ACCESS_PASSWORD` is set correctly
- Check for typos in the password
- Clear browser localStorage and try again

### API Errors
- Check Vercel function logs
- Verify all environment variables are set
- Ensure API keys have proper permissions
