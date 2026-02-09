# SEO Setup Guide for Google Search Console

This guide will help you set up enterprise-grade SEO for ScoreNews and verify it with Google Search Console.

## ✅ What's Already Implemented

### 1. **Dynamic Sitemap** (`/sitemap.xml`)

- Automatically includes all published news articles
- Includes static pages (home, news, cricket, football, etc.)
- Prioritizes pages based on importance and recency
- Updates automatically when new articles are published
- Accessible at: `https://yourdomain.com/sitemap.xml`

### 2. **Robots.txt** (`/robots.txt`)

- Properly configured to allow search engine crawling
- Blocks admin and API routes
- Points to sitemap location
- Accessible at: `https://yourdomain.com/robots.txt`

### 3. **Structured Data (JSON-LD)**

- **WebSite Schema**: Added to root layout for site-wide information
- **NewsArticle Schema**: Enhanced with comprehensive fields for each article
- **BreadcrumbList Schema**: For navigation hierarchy
- **Organization Schema**: For publisher information

### 4. **Meta Tags**

- Comprehensive Open Graph tags for social sharing
- Twitter Card tags
- Proper canonical URLs
- Enhanced keywords (30+ relevant keywords)
- Author and publisher information
- Article-specific meta tags (published time, modified time, section, tags)

### 5. **Visual Breadcrumbs**

- User-friendly breadcrumb navigation on article pages
- Includes structured data for SEO

### 6. **Image Optimization**

- All images have descriptive alt text
- Proper image dimensions and sizing
- Next.js Image optimization

## 🚀 Google Search Console Setup

### Step 1: Verify Your Website

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Select "URL prefix" and enter your domain: `https://yourdomain.com`
4. Choose a verification method:

#### Option A: HTML Tag (Recommended)

1. Copy the verification meta tag from Google Search Console
2. Add it to `frontend/src/app/layout.tsx`:
   ```tsx
   verification: {
     google: 'your-verification-code-here',
   },
   ```
3. Deploy the changes
4. Click "Verify" in Google Search Console

#### Option B: HTML File Upload

1. Download the HTML verification file from Google
2. Place it in `frontend/public/` directory
3. Deploy and verify

### Step 2: Submit Your Sitemap

1. In Google Search Console, go to "Sitemaps" in the left menu
2. Enter: `sitemap.xml`
3. Click "Submit"
4. Google will start crawling your site

### Step 3: Request Indexing for Important Pages

1. Go to "URL Inspection" tool
2. Enter your homepage URL
3. Click "Request Indexing"
4. Repeat for key pages:
   - Homepage
   - News listing page
   - A few recent articles

## 📊 SEO Best Practices Checklist

### Content Optimization

- ✅ Article titles are descriptive and keyword-rich
- ✅ Meta descriptions are compelling (150-160 characters)
- ✅ Headings follow proper hierarchy (H1 → H2 → H3)
- ✅ Content is original and valuable
- ✅ Internal linking between related articles
- ✅ Images have descriptive alt text

### Technical SEO

- ✅ Fast page load times (Next.js optimization)
- ✅ Mobile-responsive design
- ✅ HTTPS enabled
- ✅ Clean URL structure (`/news/2026/02/article-slug`)
- ✅ Canonical URLs to prevent duplicate content
- ✅ Proper HTTP status codes (404 for not found, etc.)

### On-Page SEO

- ✅ Unique title tags for each page
- ✅ Unique meta descriptions
- ✅ Proper use of heading tags
- ✅ Semantic HTML5 elements
- ✅ Schema.org structured data
- ✅ Breadcrumb navigation

## 🔍 Monitoring & Maintenance

### Weekly Tasks

1. Check Google Search Console for:
   - Indexing status
   - Search performance
   - Mobile usability issues
   - Core Web Vitals

2. Monitor:
   - New articles are being indexed
   - Sitemap is updating correctly
   - No crawl errors

### Monthly Tasks

1. Review search analytics:
   - Top performing pages
   - Search queries bringing traffic
   - Click-through rates
   - Average position

2. Optimize based on data:
   - Improve meta descriptions for low CTR
   - Create content for high-impression, low-click queries
   - Fix any technical issues

## 📈 Expected Results

After proper setup, you should see:

- **Week 1-2**: Initial indexing of pages
- **Week 2-4**: First impressions in search results
- **Month 1-2**: Organic traffic starts coming in
- **Month 3+**: Steady growth in organic traffic

## 🛠️ Environment Variables

Make sure these are set in your production environment:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 📝 Additional Recommendations

### 1. Create a Google My Business Profile (if applicable)

- Helps with local SEO
- Provides business information

### 2. Set Up Google Analytics

- Track user behavior
- Measure SEO performance
- Identify content opportunities

### 3. Create Social Media Profiles

- Add social links to structured data
- Share articles on social platforms
- Build backlinks naturally

### 4. Content Strategy

- Publish regularly (daily/weekly)
- Focus on trending topics
- Create comprehensive, long-form content
- Use relevant keywords naturally

### 5. Link Building

- Guest posts on sports blogs
- Partner with other sports websites
- Get mentioned in sports news aggregators

## 🐛 Troubleshooting

### Sitemap Not Updating

- Check if articles are marked as "published"
- Verify API endpoint is accessible
- Check Next.js build logs

### Pages Not Indexing

- Ensure robots.txt allows crawling
- Check for noindex tags
- Verify canonical URLs
- Request manual indexing in Search Console

### Low Rankings

- Improve content quality
- Increase content length
- Add more internal links
- Get quality backlinks
- Improve page speed

## 📞 Support

For issues or questions:

1. Check Google Search Console Help Center
2. Review Next.js SEO documentation
3. Consult with SEO specialist if needed

---

**Last Updated**: 2026-02-07
**Version**: 1.0
