import smtplib
from email.mime.text import MIMEText

EMAIL = "keindia@outlook.in"
PASSWORD = "ece@SK364"

msg = MIMEText("This is a test email sent from Python.")
msg["Subject"] = "SMTP Test"
msg["From"] = EMAIL
msg["To"] = "kdevi9162@gmail.com"

try:
    with smtplib.SMTP("smtp-mail.outlook.com", 587) as smtp:
        smtp.set_debuglevel(1)  # Print SMTP conversation
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(EMAIL, PASSWORD)
        smtp.send_message(msg)

    print("✅ Email sent successfully!")

except Exception as e:
    print("❌ Error:")
    print(repr(e))