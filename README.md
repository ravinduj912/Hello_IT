# HelloIT Solutions - Professional Website

> **Tagline:** Technology Made Simple.  
> **Business:** IT Solutions, Technical Support, Networking, CCTV & Computer Services  

A modern, fast, SEO-friendly, and responsive static website built with pure semantic HTML5, CSS3, and vanilla JavaScript. Designed for enterprise-grade credibility, supporting both individual clients and small/medium enterprise (SME) business technology needs.

---

## 📁 Project Structure

```text
helloit-website/
├── index.html        # Main semantic webpage with all business sections
├── style.css         # Complete custom styling, responsive design & animations
├── script.js         # Interactive features, form handling & central SITE_CONFIG
├── nginx.conf        # Production-ready Nginx server block configuration
├── README.md         # Full documentation & AWS EC2 deployment guide
└── assets/           # Media assets and icons
    ├── images/
    └── icons/
```

---

## ⚙️ Quick Configuration (`script.js`)

All company phone numbers, email addresses, WhatsApp numbers, and business metadata are centralized in `script.js`. Modifying this single configuration object will update all links, buttons, floating widgets, and contact sections across the entire website automatically:

```javascript
const SITE_CONFIG = {
  companyName: "HelloIT Solutions",
  tagline: "Technology Made Simple.",
  phone: "+94 77 123 4567",         // Display phone number
  phoneRaw: "+94771234567",         // Tel link format (no spaces)
  whatsapp: "+94 77 123 4567",      // Display WhatsApp number
  whatsappRaw: "94771234567",       // WhatsApp API format (numbers only)
  email: "hello@helloitsolutions.com",
  location: "Colombo, Sri Lanka",
  supportHours: "24/7 Technical Support Available",
  officeHours: "Mon - Sat: 8:30 AM - 6:30 PM",
  socials: {
    facebook: "https://facebook.com/helloitsolutions",
    linkedin: "https://linkedin.com/company/helloitsolutions",
    twitter: "https://twitter.com/helloit_tech"
  }
};
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Opening
Simply double-click `index.html` or open it with any web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Using VS Code Live Server
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Click **"Go Live"** in the bottom status bar.

### Option 3: Using Python HTTP Server
```bash
# Python 3
python3 -m http.server 8080

# Open in browser: http://localhost:8080
```

### Option 4: Using Node.js / npx
```bash
npx serve .
```

---

## ☁️ AWS EC2 (Ubuntu + Nginx) Deployment Guide

Follow these exact steps to host the website on an **AWS EC2 Ubuntu** instance with **Nginx**.

### Step 1: Connect to your EC2 Instance via SSH
```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 2: Update System & Install Nginx
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git -y
```

### Step 3: Prepare the Web Directory
```bash
# Create the directory for HelloIT Solutions
sudo mkdir -p /var/www/itcompany

# Assign ownership to the current Ubuntu user
sudo chown -R $USER:$USER /var/www/itcompany
sudo chmod -R 755 /var/www/itcompany
```

### Step 4: Upload Website Files
Upload the website files (`index.html`, `style.css`, `script.js`, `README.md`, `assets/`) into `/var/www/itcompany`.

You can upload using **SCP** from your local terminal:
```bash
scp -i /path/to/your-key.pem -r index.html style.css script.js assets ubuntu@YOUR_EC2_PUBLIC_IP:/var/www/itcompany/
```
*Or clone your Git repository directly into `/var/www/itcompany`.*

### Step 5: Configure Nginx
Create a new Nginx server configuration block:
```bash
sudo nano /etc/nginx/sites-available/itcompany
```

Paste the following configuration:
```nginx
server {
    listen 80;
    listen [::]:80;

    # Replace with your domain name or leave as '_' for IP access
    server_name _;

    root /var/www/itcompany;
    index index.html;

    # Enable Gzip Compression for fast loading
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ =404;
    }

    # Browser caching for static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

Enable the site and remove the default test page:
```bash
# Link the configuration to sites-enabled
sudo ln -s /etc/nginx/sites-available/itcompany /etc/nginx/sites-enabled/

# Remove default Nginx welcome page
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t

# Reload Nginx to apply changes
sudo systemctl reload nginx
```

### Step 6: Configure EC2 Security Group
Ensure your AWS EC2 Security Group inbound rules allow:
- **HTTP (Port 80)** from `0.0.0.0/0`
- **HTTPS (Port 443)** from `0.0.0.0/0`
- **SSH (Port 22)** from your IP

Visit `http://YOUR_EC2_PUBLIC_IP` in your browser to verify your site is live!

---

## 🔒 Step 7: Connecting a Domain & Setting up Free HTTPS (SSL)

Once your domain DNS (A record) points to your EC2 Public IP:

```bash
# 1. Update server_name in the Nginx config
sudo nano /etc/nginx/sites-available/itcompany
# Change: server_name yourdomain.com www.yourdomain.com;

# 2. Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# 3. Install Certbot for free Let's Encrypt SSL
sudo apt install certbot python3-certbot-nginx -y

# 4. Generate & Auto-configure SSL Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure HTTPS and auto-renewals!
```

---

## 🔄 How to Update the Website in the Future
Whenever you edit code locally, simply re-upload the updated files to `/var/www/itcompany`:
```bash
scp -i /path/to/your-key.pem index.html style.css script.js ubuntu@YOUR_EC2_PUBLIC_IP:/var/www/itcompany/
```
No Nginx restart is required for static HTML/CSS/JS file updates.

---

## 📄 License & Attribution
© 2026 **HelloIT Solutions**. All rights reserved.  
*Technology Made Simple.*
