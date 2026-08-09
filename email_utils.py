import os
import json
import base64
import smtplib
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_USER = os.getenv('EMAIL_USER', '').strip()
EMAIL_PASS = os.getenv('EMAIL_PASS', '').strip()

if not EMAIL_USER or not EMAIL_PASS:
    print('Warning: EMAIL_USER or EMAIL_PASS not set in environment. Email sending will fail.')


def get_logo_data_uri():
    for candidate in [
        Path(__file__).resolve().parent / 'static' / 'images' / 'SLTG Logo.png',
        Path(__file__).resolve().parent / 'images' / 'SLTG Logo.png',
        Path(__file__).resolve().parent / 'SLTG Logo.png',
    ]:
        if candidate.exists():
            encoded = base64.b64encode(candidate.read_bytes()).decode('ascii')
            return f'data:image/png;base64,{encoded}'
    return ''


LOGO_DATA_URI = get_logo_data_uri()


def parse_json_request(request):
    if hasattr(request, 'json'):
        try:
            return request.json()
        except Exception:
            pass

    body = getattr(request, 'body', None)
    if body is None:
        body = getattr(request, 'data', None)

    if body is None:
        return {}

    if isinstance(body, bytes):
        try:
            body = body.decode('utf-8')
        except Exception:
            body = body.decode('latin-1')

    if isinstance(body, str):
        body = body.strip()
        if not body:
            return {}
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return {}

    if isinstance(body, dict):
        return body

    return {}


def send_email(to_email, subject, html_content):
    if not EMAIL_USER or not EMAIL_PASS:
        raise RuntimeError('Email credentials are not configured.')

    to_email = (to_email or '').strip()

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = EMAIL_USER
    msg['To'] = to_email

    plain_text = 'This email contains HTML content. Please open it in an HTML-compatible email client.'
    text_part = MIMEText(plain_text, 'plain', _charset='utf-8')
    msg.attach(text_part)

    html_part = MIMEText(html_content, 'html', _charset='utf-8')
    msg.attach(html_part)

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    server.send_message(msg)
    server.quit()


def create_email_template(template_type, data, audience='owner'):
    name = data.get('name', 'Customer')
    phone = data.get('phone', 'Not provided')
    email = data.get('email', 'Not provided')
    service = data.get('service', 'Not specified')
    details = data.get('requirements', data.get('message', ''))
    budget = data.get('budget', 'Not specified')
    visit_date = data.get('visitDate', '')
    visit_location = data.get('visitLocation', '')
    selected_time = data.get('selectedTime', '')

    if audience == 'consumer':
        greeting_name = name if name != 'Customer' else 'there'

        if template_type == 'quote':
            subject = 'We Received Your Quote Request - SLTG Builders'
            title = 'Quote Request Received'
            intro = f"Hi {greeting_name}, thanks for reaching out. We have received your quote request and our team will review it shortly."
            details_rows = [
                ('Property Details', data.get('plotSize', 'Not provided')),
                ('Budget', budget),
            ]
            closing = 'We will contact you soon with the next steps.'
        elif template_type == 'visit':
            subject = 'Your Site Visit Request Is Confirmed - SLTG Builders'
            title = 'Site Visit Request Confirmed'
            intro = f"Hi {greeting_name}, thanks for scheduling a site visit. We have received your request and will contact you soon with the next steps."
            details_rows = [
                ('Preferred location', visit_location),
                ('Preferred date', visit_date),
                ('Preferred time', selected_time),
            ]
            closing = 'Our team will connect with you shortly to confirm the appointment.'
        elif template_type == 'subscribe':
            subject = 'Welcome to SLTG Builders Updates!'
            title = 'Subscription Confirmed'
            intro = f"Hi {greeting_name}, thanks for subscribing to SLTG Builders updates."
            details_rows = [
                ('What you will receive', 'Project updates, special offers, and industry insights'),
            ]
            closing = 'We are glad to have you with us.'
        else:
            subject = 'We Received Your Message - SLTG Builders'
            title = 'Message Received'
            intro = f"Hi {greeting_name}, thanks for contacting SLTG Builders. Our team has received your message and will get back to you soon."
            details_rows = [
                ('Your message', details),
            ]
            closing = 'We will respond as soon as possible.'

        rows_html = ''.join(
            f"<tr><td style='padding: 6px 0; color: #2f2f2f; font-weight: 600; width: 38%; vertical-align: top;'>{label}</td><td style='padding: 6px 0; color: #2f2f2f;'>{value}</td></tr>"
            for label, value in details_rows
        )

        logo_block = f"<img src='{LOGO_DATA_URI}' alt='SLTG Builders' style='display:block; width:72px; height:auto; border-radius: 10px; background:#ffffff; padding:6px;'>" if LOGO_DATA_URI else "<div style='width:72px; height:72px; border-radius:10px; background:#ffffff; border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; color:#1a1a1a; font-weight:700;'>SLTG</div>"

        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f4f4f2;">
                <tr>
                    <td align="center" style="padding:24px 12px;">
                        <table role="presentation" width="620" border="0" cellpadding="0" cellspacing="0" style="width:100%; max-width:620px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 12px 32px rgba(0,0,0,0.10);">
                            <tr>
                                <td style="padding:0; background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #8b5cf6 100%);">
                                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="width:120px; padding:20px 18px; vertical-align:middle;">{logo_block}</td>
                                            <td style="padding:20px 24px 20px 0; vertical-align:middle; color:#ffffff; text-align:left;">
                                                <div style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; opacity:0.85; margin-bottom:6px;">SLTG Builders</div>
                                                <div style="font-size:24px; font-weight:700; line-height:1.2; margin-bottom:8px;">{title}</div>
                                                <div style="font-size:14px; line-height:1.6; opacity:0.95;">Hi {greeting_name}, we have prepared your confirmation below.</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:28px 28px 18px 28px; color:#2f2f2f; font-size:15px; line-height:1.8;">
                                    <p style="margin:0 0 16px 0; color:#374151;">{intro}</p>
                                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#fafafa; border:1px solid #ebeef5; border-radius:12px; padding:18px 18px;">
                                        {rows_html}
                                    </table>
                                    <p style="margin:18px 0 0 0; color:#374151;">{closing}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:0 28px 28px 28px; color:#6b7280; font-size:13px; line-height:1.7;">
                                    <p style="margin:0;">Best regards,<br><strong style="color:#111827;">Team SLTG Builders</strong></p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        return {'subject': subject, 'html': html}

    if template_type == 'quote':
        subject = 'New Quote Request - SLTG Builders'
        title = 'New Quote Request'
        body = f"""
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Name</td><td style='padding:6px 0;'>{name}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Email</td><td style='padding:6px 0;'>{email}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Phone</td><td style='padding:6px 0;'>{phone}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Property Details</td><td style='padding:6px 0;'>{data.get('plotSize', 'Not provided')}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Budget</td><td style='padding:6px 0;'>{budget}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Requirements</td><td style='padding:6px 0;'>{details}</td></tr>
        """
    elif template_type == 'visit':
        subject = 'New Site Visit Request - SLTG Builders'
        title = 'New Site Visit Request'
        body = f"""
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Customer Name</td><td style='padding:6px 0;'>{name}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Customer Email</td><td style='padding:6px 0;'>{email}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Phone</td><td style='padding:6px 0;'>{phone}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Location</td><td style='padding:6px 0;'>{visit_location}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Date</td><td style='padding:6px 0;'>{visit_date}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Time</td><td style='padding:6px 0;'>{selected_time}</td></tr>
        """
    elif template_type == 'subscribe':
        subject = 'New Subscriber - SLTG Builders'
        title = 'New Subscriber'
        body = f"""
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Subscriber Email</td><td style='padding:6px 0;'>{email}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Status</td><td style='padding:6px 0;'>Added to mailing list</td></tr>
        """
    else:
        subject = 'New Contact Form Submission - SLTG Builders'
        title = 'New Contact Form Submission'
        body = f"""
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Name</td><td style='padding:6px 0;'>{name}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Email</td><td style='padding:6px 0;'>{email}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Phone</td><td style='padding:6px 0;'>{phone}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Service</td><td style='padding:6px 0;'>{service}</td></tr>
            <tr><td style='padding:6px 0; font-weight:600; width:38%; vertical-align:top;'>Message</td><td style='padding:6px 0;'>{details}</td></tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f4f4f2;">
            <tr>
                <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="560" border="0" cellpadding="0" cellspacing="0" style="width:100%; max-width:560px; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.10);">
                        <tr>
                            <td style="background:#111827; padding:18px 22px; color:#ffffff; text-align:left;">
                                <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#d1d5db; margin-bottom:6px;">SLTG Builders</div>
                                <h1 style="margin:0; font-size:22px; font-weight:700; color:#ffffff;">{title}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 22px 22px 22px; color:#2f2f2f; font-size:15px; line-height:1.8;">
                                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:14px 14px;">
                                    {body}
                                </table>
                                <p style="margin:16px 0 0 0; color:#4b5563; font-size:13px;">This message was generated from the SLTG Builders website form.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 22px 22px 22px; color:#6b7280; font-size:13px; line-height:1.7;">
                                <p style="margin:0;">SLTG Builders | Contracting | Constructions | Real Estate</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return {'subject': subject, 'html': html}
