# SLTG Builders - Professional Website

A clean, classic, professional website for SLTG Builders - Contracting, Constructions, and Real Estate services.

## Features

- **Clean, Monochromatic Design**: Professional black/white/gray color scheme
- **Premium Typography**: Cormorant Garamond (display) + Inter (body) fonts
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Smooth Interactions**: Elegant animations and transitions
- **Working Email Forms**: Integrated with Formspree for static deployment
- **Vercel Ready**: Optimized for Vercel deployment

## Deployment Instructions

### 1. Setup Formspree for Email Functionality

The contact form uses Formspree for email functionality. You need to:

1. Go to [Formspree.io](https://formspree.io/)
2. Create a free account
3. Create a new form
4. Copy your Formspree form ID (looks like: `https://formspree.io/f/YOUR_FORM_ID`)
5. Replace `YOUR_FORMSPREE_ID` in `index.html` line 313 with your actual form ID

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option B: Using GitHub

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect it as a static site
5. Deploy with one click

### 3. File Structure

```
SLTG/
├── index.html          # Main HTML file
├── static/
│   ├── style.css       # Styles
│   ├── script.js       # JavaScript
│   └── images/         # Images and logos
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Customization

### Changing Colors

Edit CSS variables in `static/style.css`:

```css
:root {
    --color-black: #000000;
    --color-dark-gray: #1a1a1a;
    --color-gray: #333333;
    /* ... */
}
```

### Updating Content

- Edit text content in `index.html`
- Update images in `/static/images/`
- Modify services and features as needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS with variables
- Minimal JavaScript (only essential functionality)
- Lazy loading for images
- Optimized for fast loading

## License

© SLTG Builders. All rights reserved.
