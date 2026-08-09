from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Email configuration
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

def send_email(to_email, subject, html_content):
    """Send email with HTML content"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_USER
        msg['To'] = to_email
        
        # Create HTML part
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False

def create_get_quote_email(data):
    """Create HTML email for Get Quote form"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SLTG Builders - Quote Request</title>
        <style>
            body {{
                font-family: 'Roboto', Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: #f5f5f5;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #1a2332 0%, #0f1e2e 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-bottom: 4px solid #f9b233;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }}
            .header p {{
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .section {{
                margin-bottom: 30px;
            }}
            .section h2 {{
                color: #f9b233;
                font-size: 20px;
                margin-bottom: 15px;
                border-bottom: 2px solid #f9b233;
                padding-bottom: 5px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }}
            .info-item {{
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #f9b233;
            }}
            .info-label {{
                font-weight: 600;
                color: #555;
                font-size: 14px;
                margin-bottom: 5px;
            }}
            .info-value {{
                color: #333;
                font-size: 16px;
                margin: 0;
            }}
            .requirements {{
                background: #e8f4f8;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #17a2b8;
            }}
            .requirements h3 {{
                color: #17a2b8;
                margin-top: 0;
                font-size: 18px;
            }}
            .requirements p {{
                margin: 10px 0;
                line-height: 1.6;
                white-space: pre-wrap;
            }}
            .footer {{
                background: #1a2332;
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .footer h3 {{
                color: #f9b233;
                margin-bottom: 15px;
            }}
            .contact-info {{
                margin: 20px 0;
                font-size: 14px;
                line-height: 1.8;
            }}
            .thank-you {{
                background: linear-gradient(135deg, #f9b233 0%, #f97b23 100%);
                color: white;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
                border-radius: 8px;
            }}
            .thank-you h3 {{
                margin: 0 0 10px 0;
                font-size: 20px;
            }}
            .thank-you p {{
                margin: 0;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SLTG Builders</h1>
                <p>Your Trusted Construction Partner</p>
            </div>
            
            <div class="content">
                <div class="thank-you">
                    <h3>Thank You for Your Quote Request!</h3>
                    <p>We have received your inquiry and will get back to you shortly with a detailed quote.</p>
                </div>
                
                <div class="section">
                    <h2>Request Details</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Name</div>
                            <div class="info-value">{data.get('name', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">{data.get('email', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Phone</div>
                            <div class="info-value">{data.get('phone', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Service Type</div>
                            <div class="info-value">{data.get('service', 'N/A').replace('-', ' ').title()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Budget Range</div>
                            <div class="info-value">{data.get('budget', 'N/A').replace('-', ' ').title()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Location</div>
                            <div class="info-value">{data.get('location', 'N/A')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Project Requirements</h2>
                    <div class="requirements">
                        <h3>What You're Looking For:</h3>
                        <p>{data.get('requirements', 'No specific requirements provided.')}</p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <h3>SLTG Builders</h3>
                <div class="contact-info">
                    <p><strong>Email:</strong> {EMAIL_USER}</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Services:</strong> Contracting | Constructions | Real Estate</p>
                    <p><strong>Experience:</strong> 11+ Years | 40+ Happy Customers</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                    © 2024 SLTG Builders. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """

def create_site_visit_email(data):
    """Create HTML email for Site Visit form"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SLTG Builders - Site Visit Confirmation</title>
        <style>
            body {{
                font-family: 'Roboto', Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: #f5f5f5;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #1a2332 0%, #0f1e2e 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-bottom: 4px solid #f9b233;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }}
            .header p {{
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .confirmation {{
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 25px;
                text-align: center;
                margin: 0 0 30px 0;
                border-radius: 8px;
            }}
            .confirmation h2 {{
                margin: 0 0 10px 0;
                font-size: 24px;
            }}
            .confirmation p {{
                margin: 0;
                font-size: 16px;
            }}
            .appointment-details {{
                background: #e8f4f8;
                padding: 25px;
                border-radius: 8px;
                border-left: 4px solid #17a2b8;
                margin-bottom: 30px;
            }}
            .appointment-details h3 {{
                color: #17a2b8;
                margin-top: 0;
                font-size: 20px;
            }}
            .appointment-info {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 20px;
            }}
            .info-item {{
                background: white;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }}
            .info-label {{
                font-weight: 600;
                color: #555;
                font-size: 14px;
                margin-bottom: 5px;
            }}
            .info-value {{
                color: #333;
                font-size: 16px;
                margin: 0;
            }}
            .visitor-info {{
                margin-bottom: 30px;
            }}
            .visitor-info h3 {{
                color: #f9b233;
                font-size: 20px;
                margin-bottom: 15px;
                border-bottom: 2px solid #f9b233;
                padding-bottom: 5px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }}
            .footer {{
                background: #1a2332;
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .footer h3 {{
                color: #f9b233;
                margin-bottom: 15px;
            }}
            .contact-info {{
                margin: 20px 0;
                font-size: 14px;
                line-height: 1.8;
            }}
            .note {{
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #856404;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SLTG Builders</h1>
                <p>Your Trusted Construction Partner</p>
            </div>
            
            <div class="content">
                <div class="confirmation">
                    <h2>Site Visit Request Confirmed!</h2>
                    <p>We have received your request and will confirm your appointment shortly.</p>
                </div>
                
                <div class="appointment-details">
                    <h3>📅 Preferred Appointment Details</h3>
                    <div class="appointment-info">
                        <div class="info-item">
                            <div class="info-label">Date & Time</div>
                            <div class="info-value">{data.get('visitDate', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Time Slot</div>
                            <div class="info-value">{data.get('selectedTime', 'N/A')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="visitor-info">
                    <h3>Visitor Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Full Name</div>
                            <div class="info-value">{data.get('name', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Phone Number</div>
                            <div class="info-value">{data.get('phone', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email Address</div>
                            <div class="info-value">{data.get('email', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Location</div>
                            <div class="info-value">{data.get('visitLocation', 'N/A')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="note">
                    <strong>📌 Important Note:</strong> Our team will contact you within 24 hours to confirm your site visit appointment. Please ensure your contact details are correct.
                </div>
            </div>
            
            <div class="footer">
                <h3>SLTG Builders</h3>
                <div class="contact-info">
                    <p><strong>Email:</strong> {EMAIL_USER}</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Services:</strong> Contracting | Constructions | Real Estate</p>
                    <p><strong>Experience:</strong> 11+ Years | 40+ Happy Customers</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                    © 2024 SLTG Builders. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """

def create_contact_email(data):
    """Create HTML email for Contact form"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SLTG Builders - Contact Form Submission</title>
        <style>
            body {{
                font-family: 'Roboto', Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: #f5f5f5;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #1a2332 0%, #0f1e2e 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-bottom: 4px solid #f9b233;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }}
            .header p {{
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .thank-you {{
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                padding: 20px;
                text-align: center;
                margin: 0 0 30px 0;
                border-radius: 8px;
            }}
            .thank-you h3 {{
                margin: 0 0 10px 0;
                font-size: 20px;
            }}
            .thank-you p {{
                margin: 0;
                font-size: 14px;
            }}
            .message-section {{
                background: #f8f9fa;
                padding: 25px;
                border-radius: 8px;
                border-left: 4px solid #007bff;
                margin-bottom: 30px;
            }}
            .message-section h3 {{
                color: #007bff;
                margin-top: 0;
                font-size: 18px;
            }}
            .message-content {{
                background: white;
                padding: 20px;
                border-radius: 6px;
                margin-top: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                white-space: pre-wrap;
                line-height: 1.6;
            }}
            .contact-info {{
                margin-bottom: 30px;
            }}
            .contact-info h3 {{
                color: #f9b233;
                font-size: 20px;
                margin-bottom: 15px;
                border-bottom: 2px solid #f9b233;
                padding-bottom: 5px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }}
            .info-item {{
                background: #e8f4f8;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #17a2b8;
            }}
            .info-label {{
                font-weight: 600;
                color: #555;
                font-size: 14px;
                margin-bottom: 5px;
            }}
            .info-value {{
                color: #333;
                font-size: 16px;
                margin: 0;
            }}
            .footer {{
                background: #1a2332;
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .footer h3 {{
                color: #f9b233;
                margin-bottom: 15px;
            }}
            .contact-details {{
                margin: 20px 0;
                font-size: 14px;
                line-height: 1.8;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SLTG Builders</h1>
                <p>Your Trusted Construction Partner</p>
            </div>
            
            <div class="content">
                <div class="thank-you">
                    <h3>Thank You for Contacting Us!</h3>
                    <p>We have received your message and will get back to you as soon as possible.</p>
                </div>
                
                <div class="contact-info">
                    <h3>Contact Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Name</div>
                            <div class="info-value">{data.get('name', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">{data.get('email', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Phone</div>
                            <div class="info-value">{data.get('phone', 'N/A')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Subject</div>
                            <div class="info-value">{data.get('subject', 'N/A')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="message-section">
                    <h3>📝 Your Message</h3>
                    <div class="message-content">
                        {data.get('message', 'No message provided.')}
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <h3>SLTG Builders</h3>
                <div class="contact-details">
                    <p><strong>Email:</strong> {EMAIL_USER}</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Services:</strong> Contracting | Constructions | Real Estate</p>
                    <p><strong>Experience:</strong> 11+ Years | 40+ Happy Customers</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                    © 2024 SLTG Builders. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """

@app.route('/api/submit-get-quote', methods=['POST'])
def submit_get_quote():
    """Handle Get Quote form submission"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'service', 'budget', 'requirements', 'location']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Create and send email
        subject = f"SLTG Builders - Quote Request from {data['name']}"
        html_content = create_get_quote_email(data)
        
        # Send to user
        user_email_sent = send_email(data['email'], subject, html_content)
        
        # Send to admin (you)
        admin_subject = f"New Quote Request - {data['service'].title()} - {data['name']}"
        admin_email_sent = send_email(EMAIL_USER, admin_subject, html_content)
        
        if user_email_sent and admin_email_sent:
            return jsonify({
                'success': True, 
                'message': 'Quote request submitted successfully! Check your email for confirmation.'
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to send email'}), 500
            
    except Exception as e:
        print(f"Error in submit_get_quote: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@app.route('/api/submit-site-visit', methods=['POST'])
def submit_site_visit():
    """Handle Site Visit form submission"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'phone', 'email', 'visitLocation', 'visitDate']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Create and send email
        subject = f"SLTG Builders - Site Visit Request from {data['name']}"
        html_content = create_site_visit_email(data)
        
        # Send to user
        user_email_sent = send_email(data['email'], subject, html_content)
        
        # Send to admin
        admin_subject = f"New Site Visit Request - {data['name']}"
        admin_email_sent = send_email(EMAIL_USER, admin_subject, html_content)
        
        if user_email_sent and admin_email_sent:
            return jsonify({
                'success': True, 
                'message': 'Site visit request submitted successfully! Check your email for confirmation.'
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to send email'}), 500
            
    except Exception as e:
        print(f"Error in submit_site_visit: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@app.route('/api/submit-contact', methods=['POST'])
def submit_contact():
    """Handle Contact form submission"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Create and send email
        subject = f"SLTG Builders - Contact Message from {data['name']}"
        html_content = create_contact_email(data)
        
        # Send to user
        user_email_sent = send_email(data['email'], subject, html_content)
        
        # Send to admin
        admin_subject = f"New Contact Message - {data['subject']} - {data['name']}"
        admin_email_sent = send_email(EMAIL_USER, admin_subject, html_content)
        
        if user_email_sent and admin_email_sent:
            return jsonify({
                'success': True, 
                'message': 'Message sent successfully! Check your email for confirmation.'
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to send email'}), 500
            
    except Exception as e:
        print(f"Error in submit_contact: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    from flask import send_from_directory

    # Serve static files (CSS, JS, images)
    @app.route('/static/<path:filename>')
    def static_files(filename):
        return send_from_directory('static', filename)

    app.run(debug=True, host='0.0.0.0', port=5000)
