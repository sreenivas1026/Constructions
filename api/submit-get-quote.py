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
        template = create_email_template('quote', data)
        send_email(EMAIL_USER, template['subject'], template['html'])

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': True, 'message': 'Quote request submitted successfully!'})
        }
    except Exception as exc:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'message': f'Failed to submit quote request: {str(exc)}'})
        }
