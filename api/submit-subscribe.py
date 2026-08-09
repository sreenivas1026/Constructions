import json
import os
from email_utils import create_email_template, send_email, parse_json_request


def handler(request):
    """Handle subscription requests via Vercel serverless."""
    try:
        data = parse_json_request(request)
        subscriber_email = data.get('email', '').strip()
        subscriber_name = data.get('name', '').strip()

        if not subscriber_email:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'success': False, 'message': 'Email is required'})
            }

        EMAIL_USER = os.getenv('EMAIL_USER', '').strip()
        if not EMAIL_USER:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'success': False, 'message': 'Email credentials are not configured'})
            }

        owner_template = create_email_template('subscribe', {'email': subscriber_email, 'name': subscriber_name}, 'owner')
        send_email(EMAIL_USER, owner_template['subject'], owner_template['html'])

        try:
            consumer_template = create_email_template('subscribe', {'email': subscriber_email, 'name': subscriber_name}, 'consumer')
            send_email(subscriber_email, consumer_template['subject'], consumer_template['html'])
        except Exception as consumer_exc:
            print(f"Consumer email send failed for subscribe request: {consumer_exc}")

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': True, 'message': 'Successfully subscribed! Check your email.'})
        }
    except Exception as exc:
        print(f"Subscribe handler error: {exc}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'message': f'Failed to subscribe: {str(exc)}'})
        }


app = handler
application = handler
