import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()


async def _send_email(to_email: str, subject: str, body: str) -> bool:
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    if not smtp_user or not smtp_password:
        print(f"[DEV] Email to {to_email}: {subject}")
        return True

    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False


async def send_password_reset_otp(to_email: str, otp: str):
    subject = "Password Reset - Hospital Management"
    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Use the following OTP to reset your password:</p>
        <h1 style="color: #fa6039; letter-spacing: 8px; font-size: 36px;">{otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr><p style="color: #888; font-size: 12px;">Hospital Management System</p>
    </body></html>
    """
    return await _send_email(to_email, subject, body)


async def send_signup_otp(to_email: str, otp: str, fullname: str):
    subject = "Verify Your Email - Hospital Management"
    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome {fullname}!</h2>
        <p>Thank you for registering. Use the following OTP to verify your email:</p>
        <h1 style="color: #fa6039; letter-spacing: 8px; font-size: 36px;">{otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <hr><p style="color: #888; font-size: 12px;">Hospital Management System</p>
    </body></html>
    """
    return await _send_email(to_email, subject, body)
