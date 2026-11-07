# SLTG Builders — Enterprise Construction & Real Estate Platform

An ultra-modern, high-converting, fully secure, and business-informative website rebuilt for **SLTG Builders** (Contracting • Constructions • Real Estate).

![SLTG Builders Preview](/images/Elevation.png)

---

## 🌟 Key Highlights & Theme Design

- **Architectural Noir & Gold Design System**: Deep slate obsidian backgrounds (`#0a0e17`) paired with amber construction gold (`#f59e0b`), glassmorphism cards, and crisp typography (*Plus Jakarta Sans* + *Outfit*).
- **Hero Video Background**: Real construction site slab-pouring video background with smooth overlay, active site status pill, and direct conversion CTAs.
- **Interactive Real-Time Construction Cost Estimator**:
  - Dynamic Plot Size Slider (100–500 Sq. Yards with live square footage conversion).
  - 3 Quality Tiers: *Standard* (₹1,850/sq.ft), *Premium* (₹2,250/sq.ft), and *Luxury Villa* (₹2,750/sq.ft).
  - Floor selection (Ground, Duplex G+1, Triplex G+2, Multi G+3).
  - Add-ons (Modular Kitchen, False Ceiling, Solar Rooftop, Elevation Cladding).
  - Itemized Cost Breakdown (Civil & Structure, Services, Finishing) + Completion Timeline.
  - "Lock Estimate" one-click transfer into the quotation wizard!
- **The Three Business Pillars**:
  1. *Turnkey Residential Contracting* (Build on your own plot with zero cost escalation guarantee).
  2. *Owned Luxury Constructions* (East-facing 133 Sq Yards duplexes, 100% Vastu compliant).
  3. *Real Estate Advisory* (Verified title deeds, approved layouts, and high-growth corridors).
- **Interactive 4-Phase Delivery Flow**: 450+ checkpoint roadmap from soil testing to 3-coat Royal Emulsion handover.
- **Filterable Project Showcase & 3D Cutaways**:
  - Architectural elevations, spacious hall/living rooms, modular kitchens, master bedroom suites, wall paint standards, and 3D spatial floor cutaways.
  - Click-to-zoom Lightbox with high-resolution inspection.
- **On-Site Video Showcase**: Direct playback of slab construction pouring and 3D architectural walkaround videos.
- **Guaranteed 15-Day Site Visit Scheduler**: Dynamic day/month calendar picker + time slots (Morning, Afternoon, Evening) with instant booking feedback.
- **Material Standard Partners**: Tata Tiscon (Fe550D), UltraTech Cement (Grade 53), Asian Paints Royale, Jaquar/Kohler, Havells, Saint-Gobain.
- **FAQ Accordion & Customer Proof**: Addressing cost guarantees, escrow milestones, bank loan approvals (SBI, HDFC, ICICI), and 10-year warranty.
- **Floating Contact Bar**: Instant WhatsApp direct chat and phone call buttons.

---

## 🔒 Enterprise Security & Reliability

1. **Anti-Spam Honeypot Field**: Silent trapping of automated bots without annoying captchas.
2. **IP Rate Limiting**: Prevents denial-of-service and form flooding (max 10 submissions per 5 minutes per IP).
3. **Email Header & XSS Injection Protection**: Strict input sanitation and HTML escaping.
4. **Persistent Lead Backup (`leads.db`)**: Every quote request, site visit booking, and contact message is instantly persisted into an SQLite database with a unique Reference ID (e.g. `SLTG-Q261108030521`). Even if SMTP networks fluctuate, **zero customer inquiries are ever lost**.
5. **Security HTTP Headers**:
   - `Content-Security-Policy`
   - `X-Frame-Options: SAMEORIGIN` (Anti-clickjacking)
   - `X-Content-Type-Options: nosniff` (Anti-MIME sniffing)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 🚀 How to Run the Website

### Option 1: Python Flask (Recommended)

1. Ensure dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the server:
   ```bash
   python app.py
   ```
3. Open your browser at:
   ```
   http://localhost:5000
   ```

### Option 2: Node.js Express

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open your browser at:
   ```
   http://localhost:8080
   ```

### Option 3: Deploy to Vercel

The project is pre-configured with `vercel.json` and serverless API handlers in `/api/`:
```bash
npm i -g vercel
vercel
```

---

## 📁 Project Structure

```
Constructions/
├── index.html                   # Modern semantic HTML5 single-page application
├── style.css                    # Obsidian & Gold Architectural Design System
├── script.js                    # Interactive DOM, live estimator & AJAX lead engine
├── app.py                       # Production Flask API, rate limiter & SQLite lead vault
├── server.js                    # Production Node.js Express server alternative
├── leads.db                     # SQLite database storing all verified customer inquiries
├── .env.example                 # Environment variables blueprint
├── vercel.json                  # Vercel deployment routing configuration
├── requirements.txt             # Python production dependencies
├── package.json                 # Node.js configuration
├── images/                      # High-resolution architectural renders & floor cutaways
│   ├── Elevation.png            # Front contemporary duplex elevation
│   ├── Hall.png                 # Living room & false ceiling
│   ├── Kitchen_aa.png           # Modular luxury kitchen
│   ├── BR.png                   # Master bedroom suite
│   ├── wall_paint.png           # Royal emulsion paint finishes
│   ├── Hall_top.png             # 3D spatial living room cutaway
│   ├── BR_top.png               # 3D spatial bedroom cutaway
│   └── SLTG Logo.png            # Brand mark
└── static/
    ├── videos/                  # On-site construction & 3D tour video clips
    │   ├── Concrete_Slab_Construction_Video_Ready.mp4
    │   └── Video_Generation_Complete.mp4
    ├── images/                  # Mirrored assets for static hosting
    ├── style.css                # Mirrored stylesheet
    └── script.js                # Mirrored client script
```

---

## 📄 License & Attribution

© **SLTG Builders**. All rights reserved. Built for high performance, luxury appeal, and maximum conversion.
