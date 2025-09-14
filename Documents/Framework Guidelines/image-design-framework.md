# Image Design Framework Guidelines

## Overview
This document establishes comprehensive guidelines for image usage, management, and optimization across the Audeon platform to ensure visual consistency, performance, and scalability.

---

## 📐 Image Specifications

### Category Images
**Purpose**: Main visual representation for content categories

#### Hero Images
- **Size**: 600x400px (3:2 aspect ratio)
- **Format**: WebP preferred, JPG fallback
- **Usage**: Primary category cards, landing pages
- **File naming**: `hero.webp` / `hero.jpg`
- **Max file size**: 150KB

#### Mobile Images  
- **Size**: 400x250px (8:5 aspect ratio)
- **Format**: WebP preferred, JPG fallback
- **Usage**: Mobile-optimized category displays
- **File naming**: `mobile.webp` / `mobile.jpg`
- **Max file size**: 75KB

#### Thumbnail Images
- **Size**: 200x133px (3:2 aspect ratio)
- **Format**: WebP preferred, JPG fallback
- **Usage**: Search results, quick lists, cards
- **File naming**: `thumbnail.webp` / `thumbnail.jpg`
- **Max file size**: 30KB

### Creator Profile Images
- **Size**: 150x150px (1:1 aspect ratio)
- **Format**: WebP preferred, JPG fallback
- **Usage**: Creator profiles, avatar displays
- **Max file size**: 40KB

### Track/Content Images
- **Recommended Size**: Near-square ratios (0.8:1 to 1.2:1 optimal)
- **Database Defaults**: 1200x630px (Open Graph standard) 
- **Optimal Ratios**: 
  - **Best**: 1:1 (square) for consistent display across all UI components
  - **Good**: 0.9:1 to 1.1:1 (near-square) with minimal padding
  - **Acceptable**: Any ratio (system handles 1:3 to 3:1 gracefully)
- **Format**: WebP preferred, JPG fallback
- **Usage**: TrackCard thumbnails (80×80px), AudioPlayer (256×256px), TrackDetailPage (responsive)
- **Max file size**: 200KB
- **Storage**: Supabase Storage with CDN delivery (preferred over external URLs)

---

## 🎨 Visual Design Standards

### Color & Tone
- **Contrast**: Ensure text overlays remain readable (WCAG AA compliance)
- **Brand alignment**: Images should complement the existing color theme system
- **Tone**: Professional, modern, approachable
- **Saturation**: Moderate saturation to prevent visual fatigue

### Composition
- **Focus**: Clear subject matter that represents the category/content
- **Whitespace**: Allow breathing room for text overlays
- **Orientation**: Landscape preferred for hero images
- **Visual hierarchy**: Support, don't compete with text content

### Content Guidelines
- **Relevance**: Images must clearly relate to their category/content
- **Quality**: High-resolution source images, crisp and professional
- **Diversity**: Represent diverse perspectives and demographics
- **Originality**: Prefer original or properly licensed images

---

## 📁 Storage Architecture

### Directory Structure
```
category_images/
├── categories/
│   ├── main/                  # Level 1 categories
│   │   ├── {category-slug}/
│   │   │   ├── hero.webp
│   │   │   ├── hero.jpg       # Fallback
│   │   │   ├── mobile.webp
│   │   │   ├── mobile.jpg
│   │   │   ├── thumbnail.webp
│   │   │   └── thumbnail.jpg
│   ├── subcategories/         # Level 2+ categories
│   └── templates/             # Default/fallback images
│       ├── default-hero.jpg
│       ├── default-mobile.jpg
│       └── default-thumbnail.jpg

track_images/                  # Track/Content images
├── tracks/
│   ├── {track-id}/
│   │   ├── main.webp         # Primary track image
│   │   ├── main.jpg          # JPG fallback
│   │   └── thumbnail.webp    # Small thumbnail (optional)
│   └── templates/            # Default track images
│       ├── default-track.jpg
│       └── placeholder.svg
```

### File Naming Conventions
- **Slugs**: Use kebab-case matching database slugs
- **Descriptive**: `business`, `data-science`, `product-management`
- **Consistent**: Follow exact pattern across all categories
- **Version safe**: Avoid spaces, special characters

---

## 🖥️ UI Implementation Guidelines

### CSS Object-fit Strategy

#### Track Images (Responsive Display)
```css
/* Optimized for any aspect ratio */
.track-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: contain; /* Shows full image, minimal padding */
  border-radius: 8px;
}

.track-detail-image {
  width: 100%;
  max-height: 384px; /* max-h-96 */
  object-fit: contain; /* Adapts to image ratio */
  border-radius: 16px;
}

.audio-player-image {
  width: 256px;
  height: 256px;
  object-fit: contain; /* Full image in square container */
  border-radius: 16px;
}
```

#### Category Images (Fixed Aspect Ratios)
```css
.category-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Fills container, may crop */
  aspect-ratio: 4/3;
}
```

### Aspect Ratio Handling
- **object-contain**: Use for track images to show complete content
- **object-cover**: Use for category cards where cropping is acceptable
- **max-height constraints**: Prevent layout breaks with tall images
- **Flexible containers**: Allow natural aspect ratios when possible

---

## ⚡ Performance Optimization

### Format Strategy
1. **WebP first**: Modern browsers, 25-35% smaller files
2. **JPG fallback**: Legacy browser support
3. **Progressive JPEG**: Enable progressive loading
4. **Compression**: 80-90% quality for optimal size/quality balance

### Loading Strategy
- **Lazy loading**: Implement for below-the-fold images
- **CDN delivery**: Leverage Supabase CDN for global distribution
- **Responsive images**: Serve appropriate size based on device
- **Preloading**: Critical above-the-fold images only

### Caching
- **Browser cache**: 1 year for versioned images
- **CDN cache**: 24 hours with proper cache-busting
- **Service worker**: Cache frequently accessed images

---

## 🔧 Implementation Workflow

### Adding New Category Images

#### 1. Prepare Images
```bash
# Recommended tools:
- Adobe Photoshop/Figma for design
- ImageOptim/TinyPNG for compression
- WebP converters for format optimization
```

#### 2. Upload to Storage
```bash
# Navigate to Supabase Dashboard
Storage → category_images → categories → main → {category-slug}/

# Upload files in order:
1. hero.webp (primary)
2. hero.jpg (fallback)
3. mobile.webp (primary)
4. mobile.jpg (fallback)
5. thumbnail.webp (primary)
6. thumbnail.jpg (fallback)
```

#### 3. Update Database
```sql
UPDATE categories 
SET 
  hero_image_path = 'categories/main/{slug}/hero.webp',
  mobile_image_path = 'categories/main/{slug}/mobile.webp',
  updated_at = NOW()
WHERE slug = '{category-slug}';
```

#### 4. Verify Implementation
- Test image loading in development
- Verify fallback behavior
- Check mobile responsiveness
- Validate performance metrics

---

## 📊 Quality Assurance

### Technical Checklist
- [ ] Images meet size specifications
- [ ] File sizes within limits
- [ ] Both WebP and JPG formats provided
- [ ] Database paths correctly updated
- [ ] CDN URLs accessible
- [ ] Mobile rendering verified

### Design Review
- [ ] Visual consistency with brand
- [ ] Content relevance verified
- [ ] Text overlay readability confirmed
- [ ] Cross-browser compatibility tested
- [ ] Accessibility standards met

### Performance Validation
- [ ] Page load impact < 200ms
- [ ] Lighthouse image optimization score > 90
- [ ] WebP support detection working
- [ ] Lazy loading functioning correctly

---

## 🛠 Tools & Resources

### Design Tools
- **Figma**: UI design and image preparation
- **Adobe Photoshop**: Advanced image editing
- **Canva**: Quick category image creation
- **Unsplash**: Source for high-quality stock images

### Optimization Tools
- **ImageOptim**: Lossless compression (macOS)
- **TinyPNG**: Web-based compression
- **Squoosh**: Google's image optimization tool
- **WebP Converter**: Format conversion utilities

### Testing Tools
- **Lighthouse**: Performance and optimization audits
- **GTmetrix**: Loading speed analysis
- **BrowserStack**: Cross-browser image testing
- **WebPageTest**: Detailed performance metrics

---

## 📈 Analytics & Monitoring

### Key Metrics
- **Image load times**: Target < 1s for hero images
- **Format adoption**: WebP usage vs JPG fallback ratios
- **Cache hit rates**: Should exceed 85%
- **Failed image loads**: Monitor 404 errors

### Monitoring Setup
- **Supabase Analytics**: Storage usage and performance
- **Google Analytics**: Image interaction tracking
- **Error logging**: Failed image load reporting
- **Performance monitoring**: Core Web Vitals impact

---

## 🔄 Maintenance & Updates

### Regular Tasks
- **Quarterly review**: Audit image relevance and quality
- **Performance check**: Monitor loading times and optimization
- **Storage cleanup**: Remove unused or outdated images
- **Format migration**: Update to newer formats as browser support improves

### Future Considerations
- **AVIF format**: Next-generation image format adoption
- **AI optimization**: Automated image optimization pipelines
- **Dynamic resizing**: On-demand image size generation
- **Advanced caching**: Edge-based image optimization

---

## 📞 Support & Troubleshooting

### Common Issues

#### Images Not Displaying
1. Verify database `hero_image_path` is correct
2. Check Supabase storage bucket permissions
3. Confirm file exists at specified path
4. Test direct CDN URL access

#### Performance Issues
1. Check file sizes meet specifications
2. Verify WebP format support
3. Ensure proper lazy loading implementation
4. Monitor CDN cache effectiveness

#### Quality Problems
1. Review source image resolution
2. Adjust compression settings
3. Verify aspect ratio compliance
4. Check color profile consistency

### Contact Information
- **Technical Issues**: Development team
- **Design Questions**: Design team  
- **Performance Concerns**: DevOps team

---

*Last updated: January 13, 2025*
*Version: 1.0*
*Next review: April 13, 2025*