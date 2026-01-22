# Deploying to Cloudways

This project is a React application built with Vite. It requires a **build process** to convert the source code into static files (`html`, `css`, `js`) that Cloudways (Nginx/Apache) can serve.

## 🚀 Steps to Deploy

### 1. Connect to your Server via SSH (or Terminal)
Log in to your Cloudways server where your application is hosted.

### 2. Navigate to your Application Folder
Go to the `public_html` directory of your application:
```bash
cd applications/your_app_name/public_html
```

### 3. Pull the Latest Changes
Fetch the updates from GitHub:
```bash
git pull origin main
```

### 4. Install Dependencies
Ensure all new packages (like the icons or UI components we added) are installed:
```bash
npm install
```

### 5. Build for Production (CRITICAL STEP)
This compiles the code into the `dist/` folder. You MUST do this every time you pull changes.
```bash
npm run build
```

### 6. Update Web Root (One-time Setup or Sync)
Vite builds to a `dist` folder, but Cloudways serves from `public_html`. You have two options:

#### Option A: Copy files (Recommended for simple setups)
Copy the *contents* of `dist` to the root of `public_html`.
```bash
cp -r dist/* .
```
*Note: This might clutter your root directory if you didn't clean it first.*

#### Option B: Point Web Root to `dist`
In Cloudways Platform > Application Settings > **Web Root**, change it to:
`public_html/dist`
*If you do this, you just need to run `npm run build` and you are done.*

## ⚡️ Quick Update (One-Liner)
To avoid mistakes, you can run this single command to pull, build, and deploy:
```bash
git pull origin main && npm install && npm run build && cp -r dist/* .
```
*Run this from your `public_html` folder.*

## Summary of Commands
For future updates, just run this sequence:
```bash
git pull origin main
npm install
npm run build
# WAIT for the build to finish!
# If using Option A (Copy)
cp -r dist/* .
```

## ✅ Troubleshooting
- **MIME type ('text/html') is not a supported stylesheet MIME type**:
  - This typically means your browser (or Varnish cache) is loading an old `index.html` that points to a CSS file that no longer exists (because the new build created a new filename).
  - **Solution**: 
    1. **Purge Varnish Cache** in your Cloudways Application Settings.
    2. Clear your browser cache or try an Incognito window.
    3. Ensure `assets` folder exists in your `public_html`.
- **404 Errors on Refresh**: Since this is a Single Page App (SPA), you need to configure Nginx/Apache to redirect all requests to `index.html`. 
  - We have included a `.htaccess` file in `public/` that handles this automatically for Apache servers.
- **White Screen**: Check the browser console. Did you forget to run `npm run build`?
