# Public Folder - Static Assets

This folder contains static files that will be served at the root of your website.

## 📁 Files to Add:

### Required:
- **favicon.png** (512x512px) - Your site icon that appears in browser tabs and Google search
- **og-image.png** (1200x630px) - Preview image for social media sharing

### Already Created:
- ✅ robots.txt - Tells search engines which pages to crawl
- ✅ sitemap.xml - Helps search engines find all your pages

## 🎨 How to Add Favicon:

### Option 1: Create Using Online Tool
1. Go to https://favicon.io/
2. Choose "Text" or "Image"
3. Create with "AT" or your logo
4. Download and extract
5. Rename the largest PNG to `favicon.png`
6. Copy to this folder

### Option 2: Use Existing Logo
1. Get your logo file
2. Resize to 512x512px (use any image editor or online tool)
3. Save as PNG format
4. Name it `favicon.png`
5. Copy to this folder

## 📊 File Structure:
```
public/
  ├── favicon.png          ← Add your 512x512px logo here
  ├── og-image.png         ← Add your 1200x630px social preview here
  ├── robots.txt           ← Already created ✅
  └── sitemap.xml          ← Already created ✅
```

## ℹ️ Important:
Files in this folder are served from the root URL:
- `public/favicon.png` → `https://apna-tuition.com/favicon.png`
- `public/robots.txt` → `https://apna-tuition.com/robots.txt`
