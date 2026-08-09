import os
from flask import Flask, request, jsonify
from email_utils import send_email, create_email_template

app = Flask(__name__)

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

    if not subscriber_email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    try:
        # Confirmation email to subscriber
        template = create_email_template('subscribe', {'email': subscriber_email})
        send_email(subscriber_email, template['subject'], template['html'])

        # Notify admin
        EMAIL_USER = os.getenv('EMAIL_USER')
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

        return jsonify({'success': True, 'message': 'Successfully subscribed! Check your email.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to subscribe: {str(e)}'}), 500
