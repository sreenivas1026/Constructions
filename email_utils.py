import os
import json
import base64
import smtplib
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

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


def create_email_template(template_type, data):
    name = data.get('name', 'Customer')
    phone = data.get('phone', 'Not provided')
    email = data.get('email', 'Not provided')
    service = data.get('service', 'Not specified')
    details = data.get('requirements', data.get('message', ''))
    budget = data.get('budget', 'Not specified')
    visit_date = data.get('visitDate', '')
    visit_location = data.get('visitLocation', '')
    selected_time = data.get('selectedTime', '')

    if template_type == 'quote':
        subject = 'Quote Request - SLTG Builders'
        title = 'Quote Request'
        body = f"<p style='margin: 8px 0;'><strong>Property Details:</strong> {data.get('plotSize', 'Not provided')}</p><p style='margin: 8px 0;'><strong>Budget:</strong> {budget}</p><p style='margin: 8px 0;'><strong>Requirements:</strong><br>{details}</p>"
    elif template_type == 'visit':
        subject = 'Site Visit Request - SLTG Builders'
        title = 'Site Visit Request'
        body = f"<p style='margin: 8px 0;'><strong>Location:</strong> {visit_location}</p><p style='margin: 8px 0;'><strong>Date:</strong> {visit_date}</p><p style='margin: 8px 0;'><strong>Time:</strong> {selected_time}</p>"
    elif template_type == 'subscribe':
        subject = 'Welcome to SLTG Builders Updates!'
        title = 'Subscription Confirmed'
        body = f"<p style='margin: 8px 0;'>Welcome to our mailing list! You will now receive:</p><ul style='margin: 8px 0; padding-left: 20px;'><li>Project updates and completion announcements</li><li>Special offers and promotions</li><li>Industry insights and news</li></ul>"
    else:
        subject = 'Contact Form Submission - SLTG Builders'
        title = 'Contact Form Submission'
        body = f"<p style='margin: 8px 0;'><strong>Service:</strong> {service}</p><p style='margin: 8px 0;'><strong>Message:</strong><br>{details}</p>"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f2;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f2;">
            <tr>
                <td align="center" style="padding: 24px 0;">
                    <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                        <!-- Header with Logo and Title -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; text-align: center; color: #ffffff;">
                                <div style="font-size: 32px; font-weight: 700; letter-spacing: 0.2em; margin-bottom: 4px; color: #FFD700;">SLTG</div>
                                <div style="font-size: 13px; letter-spacing: 0.12em; color: rgba(255,255,255,0.9); margin-bottom: 24px; font-weight: 500;">BUILDERS</div>
                                <h1 style="margin: 0; font-size: 26px; font-weight: 600; color: #ffffff;">{title}</h1>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 32px 32px; color: #2f2f2f; font-size: 15px; line-height: 1.8;">
                                <p style="margin: 0 0 20px 0; color: #555555;">Dear Valued Customer,</p>
                                <p style="margin: 0 0 24px 0; color: #555555;">Thank you for subscribing to SLTG Builders updates!</p>
                                
                                <!-- Details Section -->
                                <div style="background: #faf7ee; border-left: 4px solid #FFD700; border-radius: 4px; padding: 16px 16px; margin-bottom: 24px;">
                                    {body}
                                </div>
                                
                                <p style="margin: 0 0 8px 0; color: #555555;">Stay tuned for the latest updates from SLTG Builders.</p>
                                <p style="margin: 0; color: #555555;">Best regards,<br><strong>Team SLTG Builders</strong></p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background: #f9f9f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #ece8de;">
                                <p style="margin: 0;">SLTG Builders | Contracting | Constructions | Real Estate</p>
                                <p style="margin: 8px 0 0 0; color: #b0b0b0;">© 2026 SLTG Builders. All rights reserved.</p>
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
