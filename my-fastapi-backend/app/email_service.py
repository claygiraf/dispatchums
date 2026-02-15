"""
Email service for sending verification codes via Gmail SMTP
"""

import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

# Gmail SMTP Configuration
# IMPORTANT: You need to:
# 1. Enable "2-Step Verification" in your Google Account
# 2. Generate an "App Password" at https://myaccount.google.com/apppasswords
# 3. Set these environment variables or update the values below
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "claydermanloh@aiesec.net"
SENDER_PASSWORD = "cxkazsqrumbbvbzl"  # App Password (spaces removed)

def generate_verification_code(length: int = 6) -> str:
    """Generate a random 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=length))

def send_verification_email(recipient_email: str, verification_code: str) -> bool:
    """
    Send verification code email via Gmail SMTP
    
    Args:
        recipient_email: Email address to send to
        verification_code: 6-digit code to send
        
    Returns:
        bool: True if sent successfully, False otherwise
    """
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "DISPATCHUMS - Email Verification Code"
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        
        # Create HTML email body
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0066CC; margin: 0;">DISPATCHUMS</h1>
                <p style="color: #666; font-size: 14px;">Medical Priority Dispatch System</p>
              </div>
              
              <h2 style="color: #333;">Email Verification Code</h2>
              
              <p style="color: #666; line-height: 1.6;">
                You requested to verify your personal email address for password recovery purposes.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your verification code is:</p>
                <h1 style="color: #0066CC; font-size: 48px; letter-spacing: 10px; margin: 0; font-family: 'Courier New', monospace;">
                  {verification_code}
                </h1>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Enter this code in the DISPATCHUMS application to verify your email address.
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <strong>Note:</strong> This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>DISPATCHUMS Corporation</p>
                <p>Sabah, Malaysia</p>
                <p>www.dispatchums.com</p>
                <p>© 2025 All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
        """
        
        # Attach HTML content
        part = MIMEText(html, "html")
        message.attach(part)
        
        # Send email via Gmail SMTP with 10 second timeout
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()  # Upgrade to secure connection
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        print(f"✓ Verification email sent to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"✗ Error sending email: {str(e)}")
        return False

def send_temporary_password_email(recipient_email: str, temp_password: str) -> bool:
    """
    Send temporary password email via Gmail SMTP
    
    Args:
        recipient_email: Email address to send to
        temp_password: Temporary password (8 characters)
        
    Returns:
        bool: True if sent successfully, False otherwise
    """
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "DISPATCHUMS - Temporary Password"
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        
        # Create HTML email body
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0066CC; margin: 0;">DISPATCHUMS</h1>
                <p style="color: #666; font-size: 14px;">Medical Priority Dispatch System</p>
              </div>
              
              <h2 style="color: #333;">Password Reset Request</h2>
              
              <p style="color: #666; line-height: 1.6;">
                You requested a password reset for your DISPATCHUMS account. Your temporary password is below:
              </p>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="color: #856404; margin: 0 0 10px 0; font-weight: bold;">⚠️ IMPORTANT</p>
                <p style="color: #856404; margin: 0; font-size: 14px;">This temporary password will expire in 10 minutes. Please login immediately and change your password.</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your temporary password:</p>
                <h1 style="color: #dc3545; font-size: 36px; letter-spacing: 5px; margin: 0; font-family: 'Courier New', monospace;">
                  {temp_password}
                </h1>
              </div>
              
              <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #004085; margin: 0; font-size: 14px;"><strong>Next Steps:</strong></p>
                <ol style="color: #004085; margin: 10px 0 0 20px; font-size: 14px;">
                  <li>Use this temporary password to login</li>
                  <li>Go to Profile Settings</li>
                  <li>Click "Change Password"</li>
                  <li>Set a new secure password</li>
                </ol>
              </div>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <strong>Security Note:</strong> If you didn't request this password reset, please contact support immediately. Someone may be trying to access your account.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>DISPATCHUMS Corporation</p>
                <p>Sabah, Malaysia</p>
                <p>www.dispatchums.com</p>
                <p>© 2025 All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
        """
        
        # Attach HTML content
        part = MIMEText(html, "html")
        message.attach(part)
        
        # Send email via Gmail SMTP with 10 second timeout
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()  # Upgrade to secure connection
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        print(f"✓ Temporary password email sent to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"✗ Error sending email: {str(e)}")
        return False

def test_email_service():
    """Test function to verify email service works"""
    print("="*60)
    print("TESTING GMAIL SMTP EMAIL SERVICE")
    print("="*60)
    
    # Generate test code
    code = generate_verification_code()
    print(f"\nGenerated code: {code}")
    
    # Test email (replace with your actual email for testing)
    test_email = "clayderman03@yahoo.com"
    
    print(f"\nSending test email to: {test_email}")
    success = send_verification_email(test_email, code)
    
    if success:
        print("\n✓ Email sent successfully!")
        print(f"Check {test_email} for the verification code")
    else:
        print("\n✗ Failed to send email")
        print("Please check:")
        print("1. SENDER_EMAIL and SENDER_PASSWORD are set correctly")
        print("2. You've enabled 2-Step Verification in Google Account")
        print("3. You've generated an App Password")
    
    print("="*60)

if __name__ == "__main__":
    test_email_service()
