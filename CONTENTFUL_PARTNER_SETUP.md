# Contentful Partner Setup Guide

This guide will help you set up the Partner content model in Contentful CMS step by step.

## Step 1: Login to Contentful

1. Go to https://app.contentful.com
2. Login with your credentials
3. Select your space (ds2i7uxgjygw)

## Step 2: Create the Partner Content Model

1. Click on **"Content model"** in the top navigation
2. Click the **"Add content type"** button
3. Fill in the following details:
   - **Name**: Partner
   - **Api Identifier**: partner (this should auto-fill)
   - **Description**: Partner organizations with their information and social links
4. Click **"Create"**

## Step 3: Add Fields to the Content Model

Now you'll add each field one by one. Click **"Add field"** and follow these instructions for each field:

### Field 1: Name (Text - Required)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: Name
3. **Field ID**: name (auto-fills)
4. Click **"Create and configure"**
5. In the **Validation** tab:
   - Check ✓ **"Required field"**
6. In the **Appearance** tab:
   - Select **"Single line"**
7. Click **"Confirm"**

### Field 2: Logo (Media - Required)
1. Click **"Add field"** → Select **"Media"**
2. **Name**: Logo
3. **Field ID**: logo (auto-fills)
4. Click **"Create and configure"**
5. In the **Validation** tab:
   - Check ✓ **"Required field"**
   - Check ✓ **"Accept only specified file types"**
   - Select: **Images (PNG, JPG, JPEG, WebP, SVG)**
6. Click **"Confirm"**

### Field 3: Description (Long text - Required)
1. Click **"Add field"** → Select **"Long text"**
2. **Name**: Description
3. **Field ID**: description (auto-fills)
4. Click **"Create and configure"**
5. In the **Validation** tab:
   - Check ✓ **"Required field"**
6. In the **Appearance** tab:
   - Select **"Multiple lines"**
7. Click **"Confirm"**

### Field 4: Instagram Link (Text - Optional)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: Instagram Link
3. **Field ID**: instagramLink (auto-fills)
4. Click **"Create and configure"**
5. In the **Appearance** tab:
   - Select **"Single line"**
6. Click **"Confirm"**

### Field 5: LinkedIn Link (Text - Optional)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: LinkedIn Link
3. **Field ID**: linkedinLink (auto-fills)
4. Click **"Create and configure"**
5. In the **Appearance** tab:
   - Select **"Single line"**
6. Click **"Confirm"**

### Field 6: Facebook Link (Text - Optional)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: Facebook Link
3. **Field ID**: facebookLink (auto-fills)
4. Click **"Create and configure"**
5. In the **Appearance** tab:
   - Select **"Single line"**
6. Click **"Confirm"**

### Field 7: Twitter Link (Text - Optional)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: Twitter Link
3. **Field ID**: twitterLink (auto-fills)
4. Click **"Create and configure"**
5. In the **Appearance** tab:
   - Select **"Single line"**
6. Click **"Confirm"**

### Field 8: YouTube Link (Text - Optional)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: YouTube Link
3. **Field ID**: youtubeLink (auto-fills)
4. Click **"Create and configure"**
5. In the **Appearance** tab:
   - Select **"Single line"**
6. Click **"Confirm"**

### Field 9: Website Link (Text - Optional)
1. Click **"Add field"** → Select **"Text"**
2. **Name**: Website Link
3. **Field ID**: websiteLink (auto-fills)
4. Click **"Create and configure"**
5. In the **Appearance** tab:
   - Select **"Single line"**
6. Click **"Confirm"**

### Field 10: Order (Integer - Optional)
1. Click **"Add field"** → Select **"Number"**
2. **Name**: Order
3. **Field ID**: order (auto-fills)
4. Click **"Create and configure"**
5. In the **Validation** tab:
   - Select **"Integer"**
6. Click **"Confirm"**

## Step 4: Save the Content Model

1. Click **"Save"** in the top right corner

## Step 5: Add Language Support (Important!)

1. Go to **"Settings"** → **"Locales"** in the top navigation
2. Make sure you have these locales enabled:
   - **German (de)** - should be default
   - **Albanian (sq)**
3. If Albanian is not added:
   - Click **"Add locale"**
   - Select **"Albanian (sq)"**
   - Click **"Create"**

## Step 6: Add Your First Partner

1. Click on **"Content"** in the top navigation
2. Click **"Add entry"** → Select **"Partner"**
3. Fill in the fields:

### Required Fields:
- **Name**: Enter the partner's name (e.g., "AMAG Group")
- **Logo**: Click "Add media" → Upload the partner's logo image
- **Description**: Write about the partner (you can use multiple paragraphs)

### Optional Social Media Fields:
Only fill in the social media platforms the partner has. **If a partner doesn't have a specific social media account, simply leave that field empty!**

- **Instagram Link**: Full URL (e.g., https://instagram.com/partnername)
- **LinkedIn Link**: Full URL (e.g., https://linkedin.com/company/partnername)
- **Facebook Link**: Full URL (e.g., https://facebook.com/partnername)
- **Twitter Link**: Full URL (e.g., https://twitter.com/partnername)
- **YouTube Link**: Full URL (e.g., https://youtube.com/@partnername)
- **Website Link**: Full URL (e.g., https://www.partner-website.com)

### Order Field:
- **Order**: Enter a number (e.g., 1, 2, 3...) to control the display order
  - Lower numbers appear first
  - If left empty, partners will appear by creation date

4. **Switch to Albanian translation**:
   - In the top right corner, click the language selector
   - Select **"Albanian (sq)"**
   - Fill in **Name** and **Description** in Albanian
   - Logo and links will be the same across all languages

5. Click **"Publish"** in the top right corner

## How to Add More Partners

1. Click on **"Content"** in the top navigation
2. Click **"Add entry"** → Select **"Partner"**
3. Follow the same steps as above
4. The website will automatically display all partners!

## Important Tips

✅ **DO:**
- Use high-quality logo images (PNG or SVG recommended)
- Use complete URLs including `https://`
- Leave social media fields empty if the partner doesn't have that account
- Use the Order field to control which partners appear first

❌ **DON'T:**
- Don't use broken or invalid URLs
- Don't forget to translate to Albanian (sq)
- Don't forget to click "Publish" after creating a partner

## Editing Existing Partners

1. Go to **"Content"** in the top navigation
2. Click on the partner you want to edit
3. Make your changes
4. Click **"Publish changes"** in the top right

## Unpublishing a Partner

If you want to temporarily remove a partner from the website:
1. Open the partner entry
2. Click **"Unpublish"** in the top right
3. The partner will no longer appear on the website
4. You can republish it anytime by clicking **"Publish"**

## Deleting a Partner

1. Open the partner entry
2. First, unpublish it (if it's published)
3. Click the three dots menu (⋮) in the top right
4. Select **"Delete"**

---

## Field Summary Reference

| Field Name | Type | Required | Purpose |
|------------|------|----------|---------|
| Name | Text | Yes | Partner's name |
| Logo | Media | Yes | Partner's logo image |
| Description | Long Text | Yes | About the partner |
| Instagram Link | Text | No | Instagram profile URL |
| LinkedIn Link | Text | No | LinkedIn page URL |
| Facebook Link | Text | No | Facebook page URL |
| Twitter Link | Text | No | Twitter profile URL |
| YouTube Link | Text | No | YouTube channel URL |
| Website Link | Text | No | Partner's website URL |
| Order | Number | No | Display order (1, 2, 3...) |

---

## Need Help?

If you encounter any issues:
1. Make sure all Field IDs match exactly (case-sensitive)
2. Verify that locales (German and Albanian) are properly set up
3. Make sure entries are Published, not just Saved as Draft
4. Check that image files are not too large (recommended: under 2MB)
