from flask import Flask, request, jsonify
from email_utils import create_email_template, send_email, EMAIL_USER

app = Flask(__name__)

@app.route('/api/submit-contact', methods=['POST', 'OPTIONS'])
def submit_contact():
    if request.method == 'OPTIONS':
        res = jsonify({})
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return res, 200

    data = request.get_json(silent=True) or {}

    if not EMAIL_USER:
        return jsonify({'success': False, 'message': 'Email credentials are not configured'}), 500

    try:
        template = create_email_template('contact', data)
        send_email(EMAIL_USER, template['subject'], template['html'])
        return jsonify({'success': True, 'message': 'Contact form submitted successfully!'})
    except Exception as exc:
        return jsonify({'success': False, 'message': f'Failed to send: {str(exc)}'}), 500
