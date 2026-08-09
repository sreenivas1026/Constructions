from email_utils import send_email, create_email_template, parse_json_request
from datetime import datetime

def handler(request):
    """Handle subscription requests via Vercel serverless."""
    try:
        # Parse request data
        data = parse_json_request(request)
        subscriber_email = data.get('email', '')
        
        if not subscriber_email:
            return {
                'statusCode': 400,
                'body': '{"success": false, "message": "Email is required"}'
            }
        
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
                <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </body>
        </html>
        """
        
        # Get admin email from environment
        import os
        EMAIL_USER = os.getenv('EMAIL_USER')
        send_email(EMAIL_USER, 'New Subscriber - SLTG Builders', admin_html)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': '{"success": true, "message": "Successfully subscribed! Check your email."}'
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': '{"success": false, "message": "Failed to subscribe"}'
        }
