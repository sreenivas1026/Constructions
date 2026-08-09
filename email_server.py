from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
import threading
import webbrowser
from email_utils import send_email, create_email_template

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Email configuration
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files like CSS, JS, images"""
    return send_from_directory('.', filename)

@app.route('/api/submit-get-quote', methods=['POST'])
def submit_get_quote():
    try:
        data = request.json
        print(f"Quote request received: {data}")
        
        template = create_email_template('quote', data)
        send_email(EMAIL_USER, template['subject'], template['html'])
        
        return jsonify({'success': True, 'message': 'Quote request submitted successfully!'})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'Failed to submit quote request'}), 500

@app.route('/api/submit-site-visit', methods=['POST'])
def submit_site_visit():
    try:
        data = request.json
        print(f"Visit request received: {data}")
        
        template = create_email_template('visit', data)
        send_email(EMAIL_USER, template['subject'], template['html'])
        
        return jsonify({'success': True, 'message': 'Site visit request submitted successfully!'})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'Failed to submit site visit request'}), 500

@app.route('/api/submit-contact', methods=['POST'])
def submit_contact():
    try:
        data = request.json
        print(f"Contact request received: {data}")
        
        template = create_email_template('contact', data)
        send_email(EMAIL_USER, template['subject'], template['html'])
        
        return jsonify({'success': True, 'message': 'Contact form submitted successfully!'})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'Failed to submit contact form'}), 500

@app.route('/api/submit-subscribe', methods=['POST'])
def submit_subscribe():
    try:
        data = request.json
        subscriber_email = data.get('email', '')
        print(f"Subscription request received: {subscriber_email}")
        
        # Send confirmation to subscriber
        template = create_email_template('subscribe', {'email': subscriber_email})
        send_email(subscriber_email, template['subject'], template['html'])
        
        # Notify company about new subscriber
        admin_html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background: #f4f4f2; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1a1a1a;">New Subscriber</h2>
                <p><strong>Email:</strong> {subscriber_email}</p>
                <p><strong>Date:</strong> {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </body>
        </html>
        """
        send_email(EMAIL_USER, 'New Subscriber - SLTG Builders', admin_html)
        
        return jsonify({'success': True, 'message': 'Successfully subscribed! Check your email.'})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'Failed to subscribe'}), 500
if __name__ == '__main__':
    print("🚀 Starting SLTG Builders Email Server...")
    print(f"📧 Email configured for: {EMAIL_USER}")
    print("🌐 Server will be available at: http://localhost:5555")
    
    # Open browser automatically
    def open_browser():
        webbrowser.open('http://localhost:5555')
    
    threading.Timer(1.5, open_browser).start()
    
    app.run(host='0.0.0.0', port=5555, debug=False)
