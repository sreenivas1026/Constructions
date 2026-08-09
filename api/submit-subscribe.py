from email_utils import send_email, create_email_template, parse_json_request, EMAIL_USER

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

        if not EMAIL_USER:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': '{"success": false, "message": "Email credentials are not configured"}'
            }
        
        owner_template = create_email_template('subscribe', {'email': subscriber_email, 'name': data.get('name', '')}, 'owner')
        send_email(EMAIL_USER, owner_template['subject'], owner_template['html'])

        try:
            consumer_template = create_email_template('subscribe', {'email': subscriber_email, 'name': data.get('name', '')}, 'consumer')
            send_email(subscriber_email, consumer_template['subject'], consumer_template['html'])
        except Exception as consumer_exc:
            print(f"Consumer email send failed for subscribe request: {consumer_exc}")
        
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


app = handler
application = handler
