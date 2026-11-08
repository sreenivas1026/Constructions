import os
import re
import html
import sqlite3
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
IMAGES_DIR = os.path.join(BASE_DIR, 'images')
DB_PATH = os.path.join(BASE_DIR, 'leads.db')

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

# Email credentials
EMAIL_USER = os.getenv('EMAIL_USER', 'srinivas0k7@gmail.com')
EMAIL_PASS = os.getenv('EMAIL_PASS', 'ygpkplczoydnztyv')

# -------------------------------------------------------------
# Database Setup: Persistent Lead Storage
# -------------------------------------------------------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ref_id TEXT UNIQUE NOT NULL,
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            details TEXT,
            ip_hash TEXT,
            status TEXT DEFAULT 'NEW',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# -------------------------------------------------------------
# In-Memory Rate Limiter (IP Based)
# -------------------------------------------------------------
REQUEST_HISTORY = {}
MAX_REQUESTS_PER_WINDOW = 10  # Max 10 submissions
WINDOW_SECONDS = 300          # 5 minutes

def is_rate_limited(ip):
    now = datetime.now().timestamp()
    history = REQUEST_HISTORY.get(ip, [])
    # Filter within window
    history = [t for t in history if now - t < WINDOW_SECONDS]
    if len(history) >= MAX_REQUESTS_PER_WINDOW:
        return True
    history.append(now)
    REQUEST_HISTORY[ip] = history
    return False

# -------------------------------------------------------------
# Input Sanitization & Security Validation
# -------------------------------------------------------------
def sanitize_text(text):
    if not text:
        return ""
    # Strip dangerous characters, strip tags, escape html
    clean = re.sub(r'[\r\n]+', ' ', str(text)) # Prevent header injection
    return html.escape(clean.strip())

def sanitize_multiline(text):
    if not text:
        return ""
    return html.escape(str(text).strip())

def is_valid_phone(phone):
    # Matches international or 10-digit indian numbers (+91, 10 digits)
    cleaned = re.sub(r'[\s\-\(\)\+]', '', str(phone))
    return bool(re.match(r'^[0-9]{7,15}$', cleaned))

def is_valid_email(email):
    if not email:
        return True
    return bool(re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', str(email).strip()))

# -------------------------------------------------------------
# Secure Email Dispatcher with Fallback
# -------------------------------------------------------------
def send_secure_email(to_email, subject, html_content):
    if not EMAIL_USER or not EMAIL_PASS or not to_email:
        return False
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = re.sub(r'[\r\n]', '', subject)
        msg['From'] = f"SLTG Builders <{EMAIL_USER}>"
        msg['To'] = re.sub(r'[\r\n]', '', to_email)
        
        part = MIMEText(html_content, 'html')
        msg.attach(part)
        
        with smtplib.SMTP('smtp.gmail.com', 587, timeout=10) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"[Email Notification Warning] SMTP delivery failed: {e}")
        return False

def save_lead_to_db(ref_id, lead_type, name, phone, email, details, ip):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO leads (ref_id, type, name, phone, email, details, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (ref_id, lead_type, name, phone, email, details, ip)
        )
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"[Database Error]: {e}")
        return False

# -------------------------------------------------------------
# Security Headers Middleware
# -------------------------------------------------------------
@app.after_request
def add_security_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    return response

# -------------------------------------------------------------
# Email Templates (Gold & Obsidian Luxury Theme)
# -------------------------------------------------------------
def render_email_template(title, ref_id, fields_dict, footer_note="Our senior project consultant will contact you within 24 hours."):
    rows = ""
    for label, val in fields_dict.items():
        rows += f"""
        <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; width: 35%; font-size: 14px;">{label}</td>
            <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-size: 14px;">{val}</td>
        </tr>
        """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>{title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 30px 10px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #0b0f17 0%, #1e293b 100%); padding: 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
                                <div style="display: inline-block; background: #f59e0b; color: #0b0f17; font-weight: 900; font-size: 20px; padding: 4px 14px; border-radius: 4px; letter-spacing: 2px;">SLTG</div>
                                <h1 style="color: #ffffff; margin: 12px 0 4px 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">SLTG BUILDERS</h1>
                                <p style="color: #94a3b8; margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">Contracting • Constructions • Real Estate</p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding: 30px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
                                    <h2 style="color: #0f172a; margin: 0; font-size: 19px;">{title}</h2>
                                    <span style="background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">REF: {ref_id}</span>
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                                    {rows}
                                </table>
                                <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 4px; color: #78350f; font-size: 13.5px; line-height: 1.5;">
                                    <strong>Status:</strong> {footer_note}
                                </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                                <p style="margin: 0 0 6px 0;"><strong>SLTG Builders</strong> — 11+ Years Experience | 40+ Delivered Projects</p>
                                <p style="margin: 0;">East Facing 133 Sq Yards Luxury Duplexes, Independent Homes & Turnkey Contracting.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

# -------------------------------------------------------------
# Static Routes
# -------------------------------------------------------------
@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/images/<path:filename>')
def serve_images(filename):
    # Check images folder, fallback to static/images
    if os.path.exists(os.path.join(IMAGES_DIR, filename)):
        return send_from_directory(IMAGES_DIR, filename)
    return send_from_directory(os.path.join(STATIC_DIR, 'images'), filename)

@app.route('/<path:filename>')
def serve_root_files(filename):
    if os.path.exists(os.path.join(BASE_DIR, filename)):
        return send_from_directory(BASE_DIR, filename)
    return send_from_directory(STATIC_DIR, filename)

# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'SLTG Builders Enterprise API',
        'version': '2.4.0',
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })

@app.route('/api/submit-get-quote', methods=['POST'])
@app.route('/api/quote', methods=['POST'])
def submit_get_quote():
    client_ip = request.remote_addr or 'unknown'
    if is_rate_limited(client_ip):
        return jsonify({'success': False, 'message': 'Too many requests. Please wait a few minutes before trying again.'}), 429

    data = request.get_json(silent=True) or {}
    
    # Honeypot spam check
    if data.get('website_url_hp'):
        return jsonify({'success': True, 'message': 'Quote submitted successfully!'})

    name = sanitize_text(data.get('name'))
    phone = sanitize_text(data.get('phone'))
    email = sanitize_text(data.get('email', ''))
    service = sanitize_text(data.get('service', 'Turnkey Contracting'))
    plot_size = sanitize_text(data.get('plotSize', data.get('plot_size', 'Not Specified')))
    budget = sanitize_text(data.get('budget', 'Flexible'))
    requirements = sanitize_multiline(data.get('requirements', 'Standard requirement'))

    if not name or not phone:
        return jsonify({'success': False, 'message': 'Full name and phone number are required.'}), 400
    
    if not is_valid_phone(phone):
        return jsonify({'success': False, 'message': 'Please provide a valid 10-digit phone number.'}), 400

    if email and not is_valid_email(email):
        return jsonify({'success': False, 'message': 'Please provide a valid email address.'}), 400

    ref_id = f"SLTG-Q{datetime.now().strftime('%y%m%d%H%M%S')}"
    
    fields = {
        'Customer Name': name,
        'Mobile Contact': phone,
        'Email Address': email or 'Not provided',
        'Service Requested': service,
        'Property / Plot Details': plot_size,
        'Budget Range': budget,
        'Specific Requirements': requirements,
        'Submission Timestamp': datetime.now().strftime('%d %b %Y, %I:%M %p')
    }

    # Save to SQLite Database
    import json
    save_lead_to_db(ref_id, 'QUOTE', name, phone, email, json.dumps(fields), client_ip)

    # Dispatch Emails
    html_body = render_email_template("New Construction Quote Request", ref_id, fields)
    send_secure_email(EMAIL_USER, f"[{ref_id}] New Quote Request: {name} ({service})", html_body)
    
    if email:
        customer_html = render_email_template(
            "We Received Your Construction Quote Request",
            ref_id,
            fields,
            "Thank you for contacting SLTG Builders. Our architectural engineer will review your specs and send an itemized estimate."
        )
        send_secure_email(email, f"SLTG Builders: We received your quote request [{ref_id}]", customer_html)

    return jsonify({
        'success': True,
        'ref_id': ref_id,
        'message': f'Your quote request has been received (Ref: {ref_id}). Our chief estimator will contact you within 24 hours.'
    })

@app.route('/api/submit-site-visit', methods=['POST'])
@app.route('/api/site-visit', methods=['POST'])
def submit_site_visit():
    client_ip = request.remote_addr or 'unknown'
    if is_rate_limited(client_ip):
        return jsonify({'success': False, 'message': 'Too many requests. Please wait a few minutes before trying again.'}), 429

    data = request.get_json(silent=True) or {}
    
    # Honeypot spam check
    if data.get('website_url_hp'):
        return jsonify({'success': True, 'message': 'Site visit requested successfully!'})

    name = sanitize_text(data.get('name'))
    phone = sanitize_text(data.get('phone'))
    email = sanitize_text(data.get('email', ''))
    location = sanitize_text(data.get('visitLocation', data.get('location', 'Site / Office')))
    visit_date = sanitize_text(data.get('visitDate', data.get('date', 'Flexible')))
    visit_time = sanitize_text(data.get('visitTime', data.get('time', 'Morning 10:00 AM')))
    notes = sanitize_multiline(data.get('notes', ''))

    if not name or not phone:
        return jsonify({'success': False, 'message': 'Full name and phone number are required.'}), 400

    if not is_valid_phone(phone):
        return jsonify({'success': False, 'message': 'Please provide a valid 10-digit phone number.'}), 400

    ref_id = f"SLTG-V{datetime.now().strftime('%y%m%d%H%M%S')}"

    fields = {
        'Customer Name': name,
        'Mobile Contact': phone,
        'Email Address': email or 'Not provided',
        'Requested Date': visit_date,
        'Preferred Slot': visit_time,
        'Site / Area Location': location,
        'Special Notes': notes or 'None',
        'Submission Timestamp': datetime.now().strftime('%d %b %Y, %I:%M %p')
    }

    import json
    save_lead_to_db(ref_id, 'SITE_VISIT', name, phone, email, json.dumps(fields), client_ip)

    html_body = render_email_template("New Site Visit Request", ref_id, fields)
    send_secure_email(EMAIL_USER, f"[{ref_id}] Site Visit Booking: {name} on {visit_date}", html_body)

    if email:
        customer_html = render_email_template(
            "Site Visit Booking Received",
            ref_id,
            fields,
            "Your appointment request is scheduled. Our site manager will call 1 hour before arrival to coordinate directions."
        )
        send_secure_email(email, f"SLTG Builders: Site Visit Confirmation [{ref_id}]", customer_html)

    return jsonify({
        'success': True,
        'ref_id': ref_id,
        'message': f'Site visit request confirmed (Ref: {ref_id}) for {visit_date} ({visit_time}). We look forward to meeting you!'
    })

@app.route('/api/submit-contact', methods=['POST'])
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    client_ip = request.remote_addr or 'unknown'
    if is_rate_limited(client_ip):
        return jsonify({'success': False, 'message': 'Too many requests. Please wait a few minutes before trying again.'}), 429

    data = request.get_json(silent=True) or {}
    
    # Honeypot spam check
    if data.get('website_url_hp'):
        return jsonify({'success': True, 'message': 'Message sent successfully!'})

    name = sanitize_text(data.get('name'))
    phone = sanitize_text(data.get('phone'))
    email = sanitize_text(data.get('email', ''))
    service = sanitize_text(data.get('service', 'General Inquiry'))
    message = sanitize_multiline(data.get('message', ''))

    if not name or not phone or not message:
        return jsonify({'success': False, 'message': 'Name, phone, and message are required.'}), 400

    ref_id = f"SLTG-C{datetime.now().strftime('%y%m%d%H%M%S')}"

    fields = {
        'Customer Name': name,
        'Phone Number': phone,
        'Email Address': email or 'Not provided',
        'Category / Service': service,
        'Message': message,
        'Received At': datetime.now().strftime('%d %b %Y, %I:%M %p')
    }

    import json
    save_lead_to_db(ref_id, 'CONTACT', name, phone, email, json.dumps(fields), client_ip)

    html_body = render_email_template("New Direct Message Inquiry", ref_id, fields)
    send_secure_email(EMAIL_USER, f"[{ref_id}] Direct Message: {name}", html_body)

    return jsonify({
        'success': True,
        'ref_id': ref_id,
        'message': f'Thank you! Your message has been received (Ref: {ref_id}). Our team will reach out promptly.'
    })

@app.route('/api/submit-subscribe', methods=['POST'])
@app.route('/api/subscribe', methods=['POST'])
def submit_subscribe():
    data = request.get_json(silent=True) or {}
    email = sanitize_text(data.get('email', ''))

    if not email or not is_valid_email(email):
        return jsonify({'success': False, 'message': 'Please enter a valid email address.'}), 400

    ref_id = f"SLTG-SUB{datetime.now().strftime('%y%m%d%H%M%S')}"
    save_lead_to_db(ref_id, 'NEWSLETTER', 'Subscriber', 'N/A', email, 'Subscribed to construction updates', request.remote_addr or '')

    send_secure_email(
        EMAIL_USER,
        f"New Newsletter Subscriber: {email}",
        render_email_template("New Construction Updates Subscriber", ref_id, {'Subscriber Email': email})
    )

    return jsonify({
        'success': True,
        'message': 'You have successfully subscribed to SLTG project and market updates!'
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"\n==========================================")
    print(f" SLTG Builders Enterprise Server Running")
    print(f" Web & API: http://localhost:{port}")
    print(f" Database: {DB_PATH}")
    print(f"==========================================\n")
    app.run(debug=False, host='0.0.0.0', port=port)
