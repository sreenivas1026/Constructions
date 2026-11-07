const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Serve Static Assets
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(__dirname));

const EMAIL_USER = process.env.EMAIL_USER || 'srinivas0k7@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'ygpkplczoydnztyv';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Simple in-memory rate limiting
const rateLimits = new Map();
function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 min
    const maxRequests = 10;

    let timestamps = rateLimits.get(ip) || [];
    timestamps = timestamps.filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxRequests) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please try again shortly.' });
    }
    timestamps.push(now);
    rateLimits.set(ip, timestamps);
    next();
}

// Helper: Sanitize Strings
function sanitize(str) {
    if (!str) return '';
    return String(str).replace(/[<>]/g, '').trim();
}

// Log lead to a JSON line file for backup resilience
function logLeadToFile(lead) {
    try {
        const logEntry = JSON.stringify({ ...lead, timestamp: new Date().toISOString() }) + '\n';
        fs.appendFileSync(path.join(__dirname, 'leads.log'), logEntry);
    } catch (err) {
        console.error('Lead file log error:', err);
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Submit Quote
app.post(['/api/submit-get-quote', '/api/quote'], rateLimiter, async (req, res) => {
    try {
        const { website_url_hp, name, phone, email, service, plotSize, budget, requirements } = req.body;
        if (website_url_hp) return res.json({ success: true, message: 'Quote submitted successfully!' });

        const safeName = sanitize(name);
        const safePhone = sanitize(phone);
        if (!safeName || !safePhone) {
            return res.status(400).json({ success: false, message: 'Full name and phone are required.' });
        }

        const refId = `SLTG-Q${Date.now().toString().slice(-6)}`;
        const lead = { refId, type: 'QUOTE', safeName, safePhone, email, service, plotSize, budget, requirements };
        logLeadToFile(lead);

        try {
            await transporter.sendMail({
                from: `"SLTG Builders" <${EMAIL_USER}>`,
                to: EMAIL_USER,
                subject: `[${refId}] New Quote Request: ${safeName} (${service || 'General'})`,
                html: `<h2>New Quote Request (${refId})</h2>
                       <p><strong>Name:</strong> ${safeName}</p>
                       <p><strong>Phone:</strong> ${safePhone}</p>
                       <p><strong>Email:</strong> ${sanitize(email) || 'Not provided'}</p>
                       <p><strong>Service:</strong> ${sanitize(service)}</p>
                       <p><strong>Plot Details:</strong> ${sanitize(plotSize)}</p>
                       <p><strong>Budget:</strong> ${sanitize(budget)}</p>
                       <p><strong>Requirements:</strong> ${sanitize(requirements)}</p>`
            });
        } catch (mailErr) {
            console.warn('Mail send failed (backed up in leads.log):', mailErr.message);
        }

        res.json({
            success: true,
            ref_id: refId,
            message: `Your quote request has been received (Ref: ${refId}). Our chief estimator will contact you within 24 hours.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error processing quote' });
    }
});

// Submit Site Visit
app.post(['/api/submit-site-visit', '/api/site-visit'], rateLimiter, async (req, res) => {
    try {
        const { website_url_hp, name, phone, email, visitLocation, visitDate, visitTime, notes } = req.body;
        if (website_url_hp) return res.json({ success: true, message: 'Site visit requested successfully!' });

        const safeName = sanitize(name);
        const safePhone = sanitize(phone);
        if (!safeName || !safePhone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required.' });
        }

        const refId = `SLTG-V${Date.now().toString().slice(-6)}`;
        const lead = { refId, type: 'SITE_VISIT', safeName, safePhone, email, visitLocation, visitDate, visitTime, notes };
        logLeadToFile(lead);

        try {
            await transporter.sendMail({
                from: `"SLTG Builders" <${EMAIL_USER}>`,
                to: EMAIL_USER,
                subject: `[${refId}] Site Visit Request: ${safeName} on ${visitDate || 'Upcoming'}`,
                html: `<h2>Site Visit Booking (${refId})</h2>
                       <p><strong>Name:</strong> ${safeName}</p>
                       <p><strong>Phone:</strong> ${safePhone}</p>
                       <p><strong>Date:</strong> ${sanitize(visitDate)}</p>
                       <p><strong>Slot:</strong> ${sanitize(visitTime)}</p>
                       <p><strong>Location:</strong> ${sanitize(visitLocation)}</p>`
            });
        } catch (mailErr) {
            console.warn('Mail send failed (saved to log):', mailErr.message);
        }

        res.json({
            success: true,
            ref_id: refId,
            message: `Site visit request confirmed (Ref: ${refId}) for ${visitDate || 'the selected date'}. We look forward to meeting you!`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error booking site visit' });
    }
});

// Submit Contact
app.post(['/api/submit-contact', '/api/contact'], rateLimiter, async (req, res) => {
    try {
        const { website_url_hp, name, phone, email, service, message } = req.body;
        if (website_url_hp) return res.json({ success: true, message: 'Message sent successfully!' });

        const safeName = sanitize(name);
        const safePhone = sanitize(phone);
        if (!safeName || !safePhone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required.' });
        }

        const refId = `SLTG-C${Date.now().toString().slice(-6)}`;
        logLeadToFile({ refId, type: 'CONTACT', safeName, safePhone, email, service, message });

        try {
            await transporter.sendMail({
                from: `"SLTG Builders" <${EMAIL_USER}>`,
                to: EMAIL_USER,
                subject: `[${refId}] Direct Contact: ${safeName}`,
                html: `<h2>Direct Message (${refId})</h2>
                       <p><strong>Name:</strong> ${safeName}</p>
                       <p><strong>Phone:</strong> ${safePhone}</p>
                       <p><strong>Service:</strong> ${sanitize(service)}</p>
                       <p><strong>Message:</strong> ${sanitize(message)}</p>`
            });
        } catch (mailErr) {
            console.warn('Mail send failed:', mailErr.message);
        }

        res.json({
            success: true,
            ref_id: refId,
            message: `Thank you! Your message has been received (Ref: ${refId}). Our team will reach out promptly.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error sending message' });
    }
});

// Submit Subscribe
app.post(['/api/submit-subscribe', '/api/subscribe'], (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    logLeadToFile({ type: 'NEWSLETTER', email: sanitize(email) });
    res.json({ success: true, message: 'Successfully subscribed to SLTG project updates!' });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SLTG Builders Express server running on port ${PORT}`);
});
