from django.core.management.base import BaseCommand
from users.models import User
from django.utils import timezone
from django.core.mail import send_mail
import logging
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class Command(BaseCommand):
    help = "Send a reminder email to all users who have a certain number of reviews ready"

    def handle(self, *args, **options):
        today = timezone.now()
        domain = 'https://www.langobee.com/' if settings.IS_IN_PROD_ENVIRON else 'http://localhost:3000/'
        for user in User.objects.filter(wants_reminder_emails=True, username='superchoby'):
            threshold = user.reminder_emails_review_threshold
            reviews_that_are_ready = user.reviews.filter(next_review_date__isnull=False, next_review_date__lte=today)
            if len(reviews_that_are_ready) > threshold:
                subject = f'Your Reviews are Waiting'
                email_html_message  = render_to_string(
                    './reminder_email.html', {
                        'username': user.username,
                        'ready_reviews': len(reviews_that_are_ready),
                        'reviews_url': f'{domain}reviews',
                        'settings_url': f'{domain}settings'
                    }
                )
                email_plain_message = strip_tags(email_html_message)
                email_from = 'notifications@langobee.com'
                recipient_list = [user.email]
                try:
                    send_mail( subject, email_plain_message, email_from, recipient_list, html_message=email_html_message)
                except Exception as e:
                    logging.error(e, "Coudln't send reminder email")
                break
