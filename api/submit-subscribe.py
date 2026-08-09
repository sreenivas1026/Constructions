from email_utils import send_email, create_email_template, parse_json_request

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
            consumer_template = create_email_template('subscribe', {'email': subscriber_email}, 'consumer')
            send_email(subscriber_email, consumer_template['subject'], consumer_template['html'])
        
        # Get admin email from environment
        import os
        EMAIL_USER = os.getenv('EMAIL_USER')
            owner_template = create_email_template('subscribe', {'email': subscriber_email}, 'owner')
            send_email(EMAIL_USER, owner_template['subject'], owner_template['html'])
        
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
