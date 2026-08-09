import json
from email_utils import create_email_template, send_email, parse_json_request, EMAIL_USER


def handler(request):
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'message': 'Method not allowed'})
        }

    data = parse_json_request(request)
    if not data:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'message': 'Invalid JSON payload'})
        }

    if not EMAIL_USER:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'message': 'Email credentials are not configured'})
        }

    try:
        owner_template = create_email_template('contact', data, 'owner')
        send_email(EMAIL_USER, owner_template['subject'], owner_template['html'])

        consumer_email = data.get('email', '').strip()
        if consumer_email:
            try:
                consumer_template = create_email_template('contact', data, 'consumer')
                send_email(consumer_email, consumer_template['subject'], consumer_template['html'])
            except Exception as consumer_exc:
                print(f"Consumer email send failed for contact form: {consumer_exc}")

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': True, 'message': 'Contact form submitted successfully!'})
        }
    except Exception as exc:
        print(f"Contact form failed: {exc}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'message': f'Failed to submit contact form: {str(exc)}'})
        }


app = handler
application = handler
