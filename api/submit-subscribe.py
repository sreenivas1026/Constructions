import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from flask import Flask, request, jsonify
from email_utils import send_email, create_email_template, get_email_credentials

app = Flask(__name__)

@app.route('/', methods=['POST', 'OPTIONS'])
@app.route('/api/submit-subscribe', methods=['POST', 'OPTIONS'])
def submit_subscribe():
    if request.method == 'OPTIONS':
        res = jsonify({})
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return res, 200

    data = request.get_json(silent=True) or {}
    subscriber_email = data.get('email', '').strip()
    subscriber_name = data.get('name', '').strip()

    if not subscriber_email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    try:
        EMAIL_USER, _ = get_email_credentials()
        template = create_email_template('subscribe', {'email': subscriber_email, 'name': subscriber_name})
        send_email(subscriber_email, template['subject'], template['html'])

        if EMAIL_USER:
            from datetime import datetime
            admin_html = f"""
            <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f4f2;padding:20px;">
            <div style="max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:8px;">
                <h2 style="color:#1a1a1a;">New Subscriber</h2>
                <p><strong>Email:</strong> {subscriber_email}</p>
                <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div></body></html>
            """
            send_email(EMAIL_USER, 'New Subscriber - SLTG Builders', admin_html)

        return jsonify({'success': True, 'message': 'Thanks for subscribing! Check your email for details.'})
    except Exception as e:
        print(f"Error in submit-subscribe: {e}")
        return jsonify({'success': True, 'message': 'Thanks for subscribing! Your request has been recorded.'})
