# SendNReceive Website - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository** (eym-wallet-website)
4. **Configure project settings:**
   - Project Name: `sendnreceive-website`
   - Framework Preset: `Other`
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run vercel-build`
   - Output Directory: `./` (leave empty)
5. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd eym-wallet-website
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `sendnreceive-website`
   - Directory: `./` (current directory)

## 🔧 Configuration

### Environment Variables (if needed)
Add these in Vercel Dashboard → Settings → Environment Variables:
- `NODE_ENV=production`
- Any API keys for external services

### Custom Domain Setup
1. Go to Vercel Dashboard → Domains
2. Add your domain: `sendnreceive.com`
3. Update DNS records as instructed by Vercel

## 📱 PWA Features

The website includes:
- ✅ Service Worker for offline functionality
- ✅ Web App Manifest
- ✅ Responsive design
- ✅ Fast loading with optimized assets

## 🔒 Security Features

Vercel configuration includes:
- ✅ HTTPS/SSL certificates
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Content Security Policy
- ✅ Referrer Policy

## 📊 Performance Optimization

- ✅ Global CDN (Edge Network)
- ✅ Automatic image optimization
- ✅ Caching headers for static assets
- ✅ Gzip compression

## 🚀 Post-Deployment Checklist

- [ ] Test website functionality
- [ ] Verify PWA installation
- [ ] Check mobile responsiveness
- [ ] Test currency calculator
- [ ] Verify form submissions
- [ ] Check loading speeds
- [ ] Test offline functionality

## 🔄 Continuous Deployment

Every push to your main branch will automatically trigger a new deployment.

## 📞 Support

For Vercel-specific issues:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

For SendNReceive website issues:
- Check the main README.md file
- Review browser console for errors
