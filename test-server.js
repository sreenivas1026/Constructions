const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// SLTG Logo HTML - Styled like the website header
const LOGO_HTML = `
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background: linear-gradient(135deg, #f9b233 0%, #e6a02d 100%); padding: 8px 12px; border-radius: 6px;">
<span style="font-family: 'Arial Black', Arial, sans-serif; font-size: 22px; font-weight: 900; color: #0a1628; letter-spacing: 2px; text-shadow: 1px 1px 0 rgba(255,255,255,0.3);">SLTG</span>
</td>
<td style="padding-left: 12px;">
<span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; letter-spacing: 1px;">Builders</span>
</td>
</tr>
</table>`;

// Email template for company - Quote Request
function createQuoteEmailTemplate(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quote Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION - Navy Blue -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color: rgba(249,178,51,0.2); padding: 8px 16px; border-radius: 20px;">
<span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #f9b233; text-transform: uppercase; letter-spacing: 1px;">Quote Request</span>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION - White -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom: 20px; border-bottom: 2px solid #f9b233;">
<span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; color: #0a1628;">Customer Details</span>
</td>
</tr>
<tr>
<td style="padding-top: 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.name || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.phone || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #0066cc;">${data.email || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Service</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.service || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Plot Size</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.plotSize || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Budget</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #28a745;">${data.budget || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px;">Requirements</td>
</tr>
<tr>
<td style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 400; color: #333; line-height: 1.6; background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f9b233;">${data.requirements || 'No specific requirements mentioned'}</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION - Navy Blue -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 500; color: #f9b233; margin: 0 0 5px 0;">SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// Email template for company - Site Visit
function createVisitEmailTemplate(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Site Visit Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION - Navy Blue -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color: rgba(249,178,51,0.2); padding: 8px 16px; border-radius: 20px;">
<span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #f9b233; text-transform: uppercase; letter-spacing: 1px;">Site Visit</span>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION - White -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom: 20px; border-bottom: 2px solid #f9b233;">
<span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; color: #0a1628;">Visit Details</span>
</td>
</tr>
<tr>
<td style="padding-top: 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.name || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.phone || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #0066cc;">${data.email || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Location</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.visitLocation || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Date</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #28a745;">${data.visitDate || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Time</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0a1628;">${data.selectedTime || 'To be confirmed'}</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION - Navy Blue -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 500; color: #f9b233; margin: 0 0 5px 0;">SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// Email template for company - Contact
function createContactEmailTemplate(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact Enquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION - Navy Blue -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color: rgba(249,178,51,0.2); padding: 8px 16px; border-radius: 20px;">
<span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #f9b233; text-transform: uppercase; letter-spacing: 1px;">Enquiry</span>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION - White -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom: 20px; border-bottom: 2px solid #f9b233;">
<span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; color: #0a1628;">Contact Details</span>
</td>
</tr>
<tr>
<td style="padding-top: 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.name || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${data.phone || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #0066cc;">${data.email || '-'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Subject</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0a1628;">${data.subject || 'General Inquiry'}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px;">Message</td>
</tr>
<tr>
<td style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 400; color: #333; line-height: 1.6; background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f9b233;">${data.message || 'No message provided'}</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION - Navy Blue -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 500; color: #f9b233; margin: 0 0 5px 0;">SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// User confirmation emails
function createUserConfirmationEmail(type, data) {
    const templates = {
        quote: {
            subject: 'Quote Request Received',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quote Request Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<span style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.7);">Confirmation</span>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #222; margin: 0 0 20px 0;">Dear ${data.name},</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Thank you for your interest in SLTG Builders. We have received your quote request for <strong>${data.service || 'our services'}</strong>.</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Our team is reviewing your requirements and will prepare a customized quotation. You can expect to hear from us within <strong>24-48 hours</strong>.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
<tr>
<td style="padding: 20px;">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; margin: 0 0 10px 0;">Need immediate assistance?</p>
<p style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0a1628; margin: 0;">Call us: +91 98765 43210</p>
</td>
</tr>
</table>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 20px 0 0 0;">Thank you for considering SLTG Builders.</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 5px 0;">Warm regards,</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #f9b233; margin: 0 0 10px 0;">Team SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`
        },
        visit: {
            subject: 'Site Visit Requested',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Site Visit Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<span style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.7);">Confirmation</span>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #222; margin: 0 0 20px 0;">Dear ${data.name},</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Thank you for booking a site visit with SLTG Builders.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f7ff; border-radius: 8px; border-left: 4px solid #f9b233; margin: 20px 0;">
<tr>
<td style="padding: 20px;">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; color: #0a1628; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Visit Details</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="30%" style="font-family: Arial, sans-serif; font-size: 13px; color: #666; padding: 5px 0;">Location:</td>
<td width="70%" style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 500; color: #222; padding: 5px 0;">${data.visitLocation || '-'}</td>
</tr>
<tr>
<td width="30%" style="font-family: Arial, sans-serif; font-size: 13px; color: #666; padding: 5px 0;">Date:</td>
<td width="70%" style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 500; color: #222; padding: 5px 0;">${data.visitDate || '-'}</td>
</tr>
<tr>
<td width="30%" style="font-family: Arial, sans-serif; font-size: 13px; color: #666; padding: 5px 0;">Time:</td>
<td width="70%" style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 500; color: #222; padding: 5px 0;">${data.selectedTime || 'To be confirmed'}</td>
</tr>
</table>
</td>
</tr>
</table>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Our representative will call you to confirm the exact time slot before the visit.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
<tr>
<td style="padding: 20px;">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; margin: 0 0 10px 0;">Need to reschedule?</p>
<p style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0a1628; margin: 0;">Call us: +91 98765 43210</p>
</td>
</tr>
</table>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 20px 0 0 0;">Thank you for choosing SLTG Builders.</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 5px 0;">Looking forward to meeting you,</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #f9b233; margin: 0 0 10px 0;">Team SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`
        },
        contact: {
            subject: 'Enquiry Requested',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Enquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<span style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.7);">Confirmation</span>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #222; margin: 0 0 20px 0;">Dear ${data.name},</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Thank you for contacting SLTG Builders. We have received your message and appreciate you reaching out to us.</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Our team will review your inquiry and get back to you within <strong>24 hours</strong>.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
<tr>
<td style="padding: 20px;">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; margin: 0 0 10px 0;">For urgent matters:</p>
<p style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0a1628; margin: 0;">Call us: +91 98765 43210</p>
</td>
</tr>
</table>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 20px 0 0 0;">Thank you for your interest in SLTG Builders.</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 5px 0;">Best regards,</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #f9b233; margin: 0 0 10px 0;">Team SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`
        }
    };
    return templates[type];
}

// Send email function
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"SLTG Builders" <${EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
        return false;
    }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
});

// API Routes
app.post('/api/submit-get-quote', async (req, res) => {
    try {
        const data = req.body;
        console.log('Quote request received:', data);
        
        const companyEmailSent = await sendEmail(
            EMAIL_USER,
            'Quote Request Received',
            createQuoteEmailTemplate(data)
        );
        
        let userEmailSent = false;
        if (data.email) {
            const userEmail = createUserConfirmationEmail('quote', data);
            userEmailSent = await sendEmail(data.email, userEmail.subject, userEmail.html);
        }
        
        if (companyEmailSent) {
            res.json({ success: true, message: 'Quote request submitted successfully!', emailSent: userEmailSent });
        } else {
            res.json({ success: true, message: 'Request received. We will contact you soon.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit quote request' });
    }
});

app.post('/api/submit-site-visit', async (req, res) => {
    try {
        const data = req.body;
        console.log('Visit request received:', data);
        
        const companyEmailSent = await sendEmail(
            EMAIL_USER,
            'Site Visit Requested',
            createVisitEmailTemplate(data)
        );
        
        let userEmailSent = false;
        if (data.email) {
            const userEmail = createUserConfirmationEmail('visit', data);
            userEmailSent = await sendEmail(data.email, userEmail.subject, userEmail.html);
        }
        
        if (companyEmailSent) {
            res.json({ success: true, message: 'Site visit request submitted successfully!', emailSent: userEmailSent });
        } else {
            res.json({ success: true, message: 'Request received. We will contact you soon.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit site visit request' });
    }
});

app.post('/api/submit-contact', async (req, res) => {
    try {
        const data = req.body;
        console.log('Contact request received:', data);
        
        const companyEmailSent = await sendEmail(
            EMAIL_USER,
            'Enquiry Requested',
            createContactEmailTemplate(data)
        );
        
        let userEmailSent = false;
        if (data.email) {
            const userEmail = createUserConfirmationEmail('contact', data);
            userEmailSent = await sendEmail(data.email, userEmail.subject, userEmail.html);
        }
        
        if (companyEmailSent) {
            res.json({ success: true, message: 'Contact form submitted successfully!', emailSent: userEmailSent });
        } else {
            res.json({ success: true, message: 'Message received. We will contact you soon.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit contact form' });
    }
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Subscription request received:', email);
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }
        
        const subscribeEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subscription Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color: rgba(40,167,69,0.3); padding: 8px 16px; border-radius: 20px;">
<span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #28a745; text-transform: uppercase; letter-spacing: 1px;">Subscribed</span>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT SECTION -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #222; margin: 0 0 20px 0;">Hello,</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 15px 0;">Thank you for subscribing to the <strong>SLTG Builders</strong> newsletter. You are now part of our community.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f7ff; border-radius: 8px; border-left: 4px solid #f9b233; margin: 20px 0;">
<tr>
<td style="padding: 20px;">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; color: #0a1628; margin: 0 0 10px 0;">As a subscriber, you will receive:</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.8; margin: 0;">
- Updates on our latest projects<br>
- Service announcements<br>
- Construction tips and insights<br>
- Exclusive offers
</p>
</td>
</tr>
</table>
<p style="font-family: Arial, sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 20px 0 0 0;">We look forward to keeping you informed.</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER SECTION -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 5px 0;">Warm regards,</p>
<p style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #f9b233; margin: 0 0 10px 0;">Team SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
        
        const emailSent = await sendEmail(email, 'Subscription Confirmed', subscribeEmailHtml);
        
        // Notify company about new subscriber
        const newSubscriberHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>New Subscriber</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8; padding: 20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">

<!-- HEADER -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 25px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="60%" valign="middle">
${LOGO_HTML}
</td>
<td width="40%" align="right" valign="middle">
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color: rgba(249,178,51,0.2); padding: 8px 16px; border-radius: 20px;">
<span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #f9b233; text-transform: uppercase; letter-spacing: 1px;">New Subscriber</span>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom: 20px; border-bottom: 2px solid #f9b233;">
<span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; color: #0a1628;">Subscriber Details</span>
</td>
</tr>
<tr>
<td style="padding-top: 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding: 12px 0; border-bottom: 1px solid #eee;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase;">Email</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #0066cc;">${email}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding: 12px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase;">Date</td>
<td width="65%" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 500; color: #222;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td bgcolor="#0a1628" style="background-color: #0a1628; padding: 20px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center">
<p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 500; color: #f9b233; margin: 0 0 5px 0;">SLTG Builders</p>
<p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); margin: 0;">We Structure Your Dreams Into Reality</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
        
        await sendEmail(EMAIL_USER, 'New Subscriber', newSubscriberHtml);
        
        if (emailSent) {
            res.json({ success: true, message: 'Successfully subscribed! Check your email for confirmation.' });
        } else {
            res.json({ success: true, message: 'Subscribed successfully!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again.' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`SLTG Builders server running on http://localhost:${PORT}`);
    console.log(`Email service configured for: ${EMAIL_USER}`);
});
