# Lakshya Sharma — QA Automation Engineer Portfolio

A professional, responsive portfolio website built with **React 19**, **Vite**, and **Tailwind CSS**. Designed to showcase QA automation expertise, projects, and experience to recruiters and hiring managers.

> **Live URL:** https://lakshyasharmaqa.vercel.app/

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Customization](#customization)
- [Deployment on Vercel](#deployment-on-vercel)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)

---

## Tech Stack

| Category     | Technology               |
| ------------ | ------------------------ |
| Framework    | React 19, Vite           |
| Styling      | Tailwind CSS v4, PostCSS |
| Animations   | Framer Motion            |
| Charts       | Recharts                 |
| Icons        | Heroicons                |
| Contact Form | EmailJS                  |
| Deployment   | Vercel                   |

---

## Project Structure

```
├── public/
│   ├── resume.pdf          # Your downloadable resume (replace this)
│   ├── sitemap.xml         # SEO sitemap
│   └── robots.txt          # SEO robots file
│
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Navigation bar with dark/light mode toggle
│   │   ├── Hero.jsx        # Hero section with typing animation
│   │   ├── About.jsx       # About section with process flow
│   │   ├── Skills.jsx      # Skills with proficiency charts
│   │   ├── Experience.jsx  # Timeline-based work experience
│   │   ├── Projects.jsx    # Filterable project showcase
│   │   ├── Resume.jsx      # Resume preview and download
│   │   ├── Contact.jsx     # Contact form
│   │   └── Footer.jsx      # Footer with social links
│   │
│   ├── data/
│   │   └── profile.js      # ⭐ All personal content lives here
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles and Tailwind imports
│
├── tailwind.config.js      # Tailwind theme and color configuration
├── vite.config.js          # Vite build configuration
├── vercel.json             # Vercel deployment configuration
└── package.json
```

---

## Local Setup

### Prerequisites

- Node.js **v22+**
- npm **v10+**
- Git

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/LakshyaQA/portfolio-qa-automation.git
cd portfolio-qa-automation
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**4. Build for production**

```bash
npm run build
```

**5. Preview production build locally**

```bash
npm run preview
```

---

## Customization

All personal content (name, experience, skills, projects, contact info) is centralized in one file:

```
src/data/profile.js
```

You do **not** need to touch individual components for content updates. Just edit `profile.js`.

### Key things to update:

| What                           | Where                                        |
| ------------------------------ | -------------------------------------------- |
| Name, title, bio, contact info | `src/data/profile.js`                        |
| Work experience                | `src/data/profile.js` → `experience` array   |
| Projects                       | `src/data/profile.js` → `projects` array     |
| Skills                         | `src/data/profile.js` → `skills` array       |
| Resume PDF                     | Replace `/public/resume.pdf` with your file  |
| Colors / Theme                 | `tailwind.config.js` → `theme.extend.colors` |

---

## Deployment on Vercel

### First-Time Deployment (Connect GitHub → Vercel)

This is a one-time setup. After this, every commit auto-deploys.

**Step 1 — Push your code to GitHub**

```bash
git add .
git commit -m "initial portfolio setup"
git push origin main
```

**Step 2 — Import project on Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in (use your GitHub account)
2. Click **"Add New Project"**
3. Click **"Import"** next to your repository (`portfolio-qa-automation`)
4. Vercel will auto-detect it as a **Vite** project — no settings need to change
5. Click **"Deploy"**
6. Your site will be live in ~1–2 minutes at a URL like `https://portfolio-qa-automation.vercel.app`

---

### Auto-Deploy on Every Commit (After Setup)

Once your GitHub repo is connected to Vercel, **every `git push` to `main` triggers an automatic deployment**. You don't need to do anything manually.

```bash
# Make your changes, then:
git add .
git commit -m "your message"
git push origin main
# ✅ Vercel will automatically detect the push and redeploy
```

You can monitor deployment status in your **Vercel Dashboard** under the project → **Deployments** tab.

---

### Deploy via Vercel CLI

You can also trigger deployments directly from your terminal without going to the dashboard.

**Step 1 — Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2 — Login to Vercel**

```bash
vercel login
```

**Step 3 — Deploy to preview (UAT / staging)**

```bash
vercel
```

**Step 4 — Deploy to production**

```bash
vercel --prod
```

**Check deployment status & list all deployments**

```bash
vercel ls
```

**Inspect a specific deployment**

```bash
vercel inspect <deployment-url>
```

> **Tip:** For UAT branch, just `git push origin uat` — Vercel auto-deploys on every push if the branch is connected in your Vercel project settings.

---

### Add a Custom Domain (Optional)

1. In your Vercel project, go to **Settings → Domains**
2. Enter your domain (e.g. `lakshyasharmaqa.dev`)
3. Follow the DNS instructions Vercel provides
4. SSL is handled automatically by Vercel

---

## Troubleshooting

**Build fails locally?**

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run build
```

**`@tailwind` warning in VS Code?**

This is a VS Code CSS linter warning, not a real error. Fix it by adding to `.vscode/settings.json`:

```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

Or install the **Tailwind CSS IntelliSense** extension from VS Code marketplace.

**Vercel deployment fails?**

- Check the **Build Logs** in your Vercel dashboard for the exact error
- Make sure your `package.json` has `"build": "vite build"` in scripts
- Ensure Node.js version is set (already configured via `engines` in `package.json`)

---

## Contact

- **Email:** lakshyasharmaqa@gmail.com
- **LinkedIn:** [linkedin.com/in/lakshyasharmaqa](https://linkedin.com/in/lakshyasharmaqa)
- **GitHub:** [github.com/LakshyaQA](https://github.com/LakshyaQA)

---

_Built by Lakshya Sharma_
