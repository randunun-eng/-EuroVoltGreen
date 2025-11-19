# Eurovolt Solar - Static Website

Professional static website for Eurovolt Solar Manufacturing, a leading manufacturer of solar inverters, MPPT and PWM charge controllers.

## Features

- **Fully Static**: Pure HTML, CSS, and JavaScript - no backend required
- **Multilingual**: Support for English, Chinese, Spanish, German, and French
- **Responsive Design**: Bootstrap 5.3.0 for mobile-first responsive layouts
- **AI Chatbot**: Client-side FAQ chatbot with knowledge base
- **Product Catalog**: Dynamic rendering of all product lines
- **Interactive Roadmap**: Timeline visualization of company milestones
- **Contact Form**: Integrated with Formspree for form handling

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Hosting**: Cloudflare Pages

## Project Structure

```
-EuroVoltGreen/
├── index.html              # Homepage
├── about.html              # Company information
├── products.html           # Product catalog
├── roadmap.html            # Innovation timeline
├── contact.html            # Contact form
├── _headers                # Cloudflare Pages headers configuration
├── _redirects              # Cloudflare Pages redirects
├── package.json            # Project metadata
├── static/
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── js/
│   │   ├── config.js       # Translations and configuration
│   │   ├── data.js         # Product and roadmap data
│   │   ├── main.js         # Main application logic
│   │   ├── chatbot.js      # AI chatbot functionality
│   │   └── 360viewer.js    # Product 360° viewer
│   └── images/             # Image assets
└── README.md               # This file
```

## Deployment

### Cloudflare Pages

The site is configured for automatic deployment on Cloudflare Pages via GitHub integration.

**Build Configuration:**
- Framework preset: **None**
- Build command: **(leave empty OR use: `./build.sh`)**
- Build output directory: **`/` (root directory)** ⚠️ CRITICAL: Must be `/` not `.`
- Root directory: **(leave empty)**
- Environment variables: None required

**⚠️ IMPORTANT:** If deployment fails, see `DEPLOYMENT.md` for detailed troubleshooting

**Deployment Steps:**
1. Connect GitHub repository: `randunun-eng/-EuroVoltGreen`
2. Set branch to deploy: `main`
3. Configure build settings as specified above
4. Save and deploy

The site includes `_headers` and `_redirects` files for Cloudflare Pages configuration.

### Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Contact Form Setup

The contact form uses [Formspree](https://formspree.io/). To activate:

1. Sign up at https://formspree.io/
2. Create a new form
3. Update the form action in `contact.html` (line 189):
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

## Customization

### Adding Translations

Edit `static/js/config.js` and add your language:

```javascript
translations: {
    'your_lang': {
        'key': 'Translation'
    }
}
```

### Adding Products

Edit `static/js/data.js` and add to the appropriate category:

```javascript
productData.hybrid_inverters.push({
    name: 'Product Name',
    power: '10KW',
    // ... other properties
});
```

### Updating Chatbot Knowledge Base

Edit the `getKnowledgeBaseResponse()` method in `static/js/chatbot.js`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Copyright © 2024 Eurovolt. All rights reserved.

## Contact

- **Email**: info@eurovolt.com
- **Phone**: +86 755 1234 5678
- **Location**: Shenzhen, China
