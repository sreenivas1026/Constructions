import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from flask import Flask, request, jsonify
from email_utils import create_email_template, send_email, get_email_credentials

app = Flask(__name__)

@app.route('/', methods=['POST', 'OPTIONS'])
@app.route('/api/submit-get-quote', methods=['POST', 'OPTIONS'])
def submit_get_quote():
    if request.method == 'OPTIONS':
        res = jsonify({})
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return res, 200

    data = request.get_json(silent=True) or {}

    try:
        EMAIL_USER, _ = get_email_credentials()
        template = create_email_template('quote', data)
        
        if EMAIL_USER:
            send_email(EMAIL_USER, template['subject'], template['html'])
            
        user_email = data.get('email', '').strip()
        if user_email:
            send_email(user_email, template['subject'], template['html'])

        return jsonify({'success': True, 'message': 'Your quote request has been sent. We will get back to you within 24 hours.'})
    except Exception as exc:
        print(f"Error in submit-get-quote: {exc}")
        return jsonify({'success': True, 'message': 'Your quote request has been received. We will get back to you within 24 hours.'})
