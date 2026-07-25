import unittest
from unittest.mock import patch

from app import get_email_config, send_inquiry_notification


class EmailNotificationTests(unittest.TestCase):
    def test_email_config_is_disabled_without_credentials(self):
        config = get_email_config({
            'SMTP_USERNAME': '',
            'SMTP_PASSWORD': '',
            'SMTP_TO_EMAIL': '',
        })
        self.assertFalse(config['enabled'])

    def test_send_inquiry_notification_sends_message_when_configured(self):
        with patch('app.smtplib.SMTP') as smtp_cls:
            smtp_cls.return_value.__enter__.return_value.login.return_value = None
            smtp_cls.return_value.__enter__.return_value.send_message.return_value = None

            result = send_inquiry_notification(
                'Jane Doe',
                'jane@example.com',
                '9999999999',
                'Need consultation',
                'Solar Panels',
                env={
                    'SMTP_USERNAME': 'sender@gmail.com',
                    'SMTP_PASSWORD': 'app-password',
                    'SMTP_TO_EMAIL': 'receiver@gmail.com',
                    'SMTP_HOST': 'smtp.gmail.com',
                    'SMTP_PORT': '587',
                    'SMTP_FROM_EMAIL': 'sender@gmail.com',
                },
            )

            self.assertTrue(result)
            smtp_cls.assert_called_once_with('smtp.gmail.com', 587)


if __name__ == '__main__':
    unittest.main()
