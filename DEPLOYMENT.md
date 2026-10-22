# Deploying CampusCare to Vercel

CampusCare is configured to deploy directly to **Vercel** with a unified monorepo configuration (`vercel.json`) that handles both the React + Vite frontend and the Node.js Express serverless functions.

---

## 🚀 Method 1: Deploy with Vercel CLI (Fastest - 2 Minutes)

If you have Node.js installed, you can deploy straight from your terminal without even opening a browser:

1. Open your terminal in the project directory (`/Users/kirankumar/campuscare`):
   ```bash
   cd /Users/kirankumar/campuscare
   ```

2. Run the Vercel CLI deploy command:
   ```bash
   npx vercel
   ```

3. Follow the interactive prompts:
   - **Set up and deploy?** Press `y` and Enter.
   - **Which scope?** Choose your Vercel account.
   - **Link to existing project?** Type `n` (No).
   - **What's your project's name?** `campuscare` (or any custom name).
   - **In which directory is your code located?** `./` (Press Enter).
   - **Want to modify these settings?** Type `n` (No, `vercel.json` already defines them).

4. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

Your live URL (e.g., `https://campuscare.vercel.app`) will be displayed in the terminal!

---

## 🌐 Method 2: Deploy via GitHub (Continuous Deployment)

1. **Initialize Git and Commit Your Code:**
   ```bash
   cd /Users/kirankumar/campuscare
   git init
   git add .
   git commit -m "Initial commit of CampusCare full-stack system"
   ```

2. **Push to GitHub:**
   - Go to [GitHub](https://github.com/new) and create a new repository called `campuscare`.
   - Push your local code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/campuscare.git
     git branch -M main
     git push -u origin main
     ```

3. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** -> **"Project"**.
   - Select your `campuscare` GitHub repository and click **Import**.
   - In **Environment Variables**, add:
     - `JWT_SECRET` = `campuscare_super_secret_jwt_key_2026_secure` (or your custom random string)
     - `NODE_ENV` = `production`
   - Click **Deploy**.

---

## ⚙️ How the Vercel Architecture Works

- **Frontend:** Vercel builds the React + Tailwind application from `client/` and serves it as a high-speed global static edge site.
- **Backend API:** All requests to `/api/*` are automatically routed by `vercel.json` to `api/index.js`, which executes the Express REST API as an isolated Vercel Serverless Function.
- **Database on Vercel:** When running in a serverless environment (`process.env.VERCEL`), SQLite automatically uses `/tmp/campuscare.sqlite`, copying the pre-seeded campus database (admin, students, departments, and 22 sample complaints) on the first cold start so the portal is populated immediately.

---

## 💡 Production Architecture Notes

- **Serverless Ephemeral Storage:** Vercel serverless functions have an ephemeral filesystem (`/tmp`). This is ideal for demonstrations, portfolios, grading, and testing.
- **For Permanent 24/7 Production Systems with Uploaded Files:**
  - **Option A (Recommended for Free Tier):** Deploy the React frontend on Vercel, and deploy the `/server` folder to [Render](https://render.com) or [Railway](https://railway.app), which provide persistent Node.js servers with disk volumes.
  - **Option B (Cloud Database):** Connect [Turso](https://turso.tech) (managed cloud SQLite / libSQL) or [Neon](https://neon.tech) (Serverless Postgres) with zero cold-start state loss.
