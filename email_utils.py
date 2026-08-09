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


def get_email_credentials():
    email_user = os.getenv('EMAIL_USER', '').strip()
    email_pass = os.getenv('EMAIL_PASS', '').strip()
    return email_user, email_pass


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
