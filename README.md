# Grace Architectures

A responsive, semantic HTML/CSS/vanilla JavaScript company homepage with a deep-teal and coral palette, quote-led design, and reference-inspired company logo carousel.

## Run locally

This is a static website. Open `index.html` in a browser for a quick preview, or use VS Code's Live Server extension to serve the project folder. If Python is installed, you can also run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`. Google Fonts, Unsplash photos, and the EmailJS browser library are loaded from their respective CDNs, so internet access is needed for those assets and email delivery. A local logo and the supplied reference graphics are included in `assets/`.

## EmailJS setup

The inquiry form validates the visitor's information and sends it with EmailJS only after valid credentials are configured. It does not show a false success response when the integration is missing.

1. Create an EmailJS account and configure an email service connected to the company's inbox.
2. Create an email template and set its **To Email** field to `ref.gracedesignlabs@gmail.com`. Keep this recipient fixed in the EmailJS template rather than accepting a recipient address from the browser.
3. Use these template variables in the subject/body as needed:
   - `{{full_name}}`
   - `{{email}}`
   - `{{phone}}`
   - `{{company}}`
   - `{{service}}`
   - `{{message}}`
4. The EmailJS public key, service ID, and template ID are configured in `js/script.js`. If you replace them later, update those three values:
   - `publicKey`: EmailJS public key (safe for browser use)
   - `serviceId`: EmailJS service ID
   - `templateId`: EmailJS template ID
5. In EmailJS, restrict the public key to the deployed website domain and set suitable account/template rate limits.
6. Submit a test inquiry from the deployed site and confirm it arrives at `ref.gracedesignlabs@gmail.com`.

EmailJS's public key and service/template identifiers are client-side integration identifiers, not private email API credentials. Never put a private API key or secret in this project. The recipient is configured in the EmailJS template, so the browser cannot redirect inquiries to another address.

## Project structure

```text
grace-architectures/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   │   ├── trusted-companies-1.jpeg
│   │   ├── trusted-companies-2.jpg
│   │   ├── industry-awards.jpeg
│   │   └── software-we-use.jpeg
│   ├── icons/        # Reserved for additional local icons
│   └── logo/
│       └── grace-mark.svg
└── README.md
```

## Before launch

- Verify that the supplied company, award, and software graphics reflect current company information before publishing.
- Confirm the service-area state list and update it to match current coverage.
- Confirm the service list and company details, and finish the EmailJS configuration for `ref.gracedesignlabs@gmail.com`.
- Replace the illustrative client quotations with approved customer testimonials if required.
