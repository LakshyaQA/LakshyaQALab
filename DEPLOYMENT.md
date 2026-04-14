# 🚀 Deployment Guide for Lakshya Sharma's QA Portfolio

## Quick Deploy Options

### Option 1: Vercel (Recommended) ⚡

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Complete QA portfolio website"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect React/Vite settings
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Custom Domain** (Optional)
   - In Vercel dashboard, go to "Domains"
   - Add `lakshyasharmaqa.dev` or your preferred domain
   - Follow DNS setup instructions

### Option 2: Netlify 🌐

1. **Build the project**

   ```bash
   yarn build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repo for auto-deploy

3. **Configure Forms**
   - Contact form will work automatically with Netlify Forms
   - Check submissions in Netlify dashboard

### Option 3: GitHub Pages 📄

1. **Install gh-pages**

   ```bash
   yarn add -D gh-pages
   ```

2. **Add deploy script to package.json**

   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   yarn build
   yarn deploy
   ```

## Pre-Deployment Checklist ✅

- [ ] Replace `/public/resume.pdf` with your actual resume
- [ ] Update all URLs in code to match your domain
- [ ] Add your professional photo (optional)
- [ ] Test contact form after deployment
- [ ] Add Google Analytics tracking ID
- [ ] Verify all project links work
- [ ] Test on mobile devices

## Post-Deployment Steps 🎯

1. **Test Everything**
   - All navigation links
   - Theme toggle (dark/light mode)
   - Contact form submission
   - Resume download
   - Mobile responsiveness

2. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Verify structured data with Google's tool
   - Test Open Graph tags on social media

3. **Share Your Portfolio**
   - Add URL to LinkedIn profile
   - Include in email signatures
   - Share with recruiters and network

## Environment Variables 🔧

If using custom analytics or form services:

```env
# Add to your deployment platform
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

## Custom Domain Setup 🌍

1. **Purchase Domain** (Recommended: lakshyasharmaqa.dev)
2. **Configure DNS**
   - Point domain to your hosting provider
   - Add CNAME records as instructed
3. **Update URLs**
   - Replace all instances of `lakshyasharmaqa.dev` in the code
   - Update sitemap.xml and robots.txt

## Maintenance 🔄

- **Monthly**: Update project descriptions and metrics
- **Quarterly**: Add new projects and achievements
- **Annually**: Refresh design and technology stack

## Support 💬

Need help with deployment?

- 📧 Email: lakshyasharmaqa@gmail.com
- 💼 LinkedIn: [lakshyasharmaqa](https://linkedin.com/in/lakshyasharmaqa)

---

**Your professional QA portfolio is ready to impress recruiters! 🎉**
