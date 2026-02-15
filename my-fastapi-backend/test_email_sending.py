"""
Test Gmail SMTP email sending
Run this after configuring SENDER_EMAIL and SENDER_PASSWORD in email_service.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.email_service import send_verification_email, generate_verification_code

def test_email_sending():
    """Test sending a verification email"""
    
    # Generate a test code
    test_code = generate_verification_code()
    print(f"Generated verification code: {test_code}")
    
    # Test email address (change this to your email for testing)
    test_email = "clayderman03@yahoo.com"
    
    print(f"\nAttempting to send email to: {test_email}")
    print("Please wait...")
    
    # Send the email
    success = send_verification_email(test_email, test_code)
    
    if success:
        print("\n✅ SUCCESS! Email sent successfully!")
        print(f"Check your inbox at {test_email}")
        print(f"The verification code is: {test_code}")
    else:
        print("\n❌ FAILED! Could not send email.")
        print("\nCommon issues:")
        print("1. Check if SENDER_EMAIL and SENDER_PASSWORD are configured in email_service.py")
        print("2. Make sure you're using an App Password, not your regular Gmail password")
        print("3. Verify that 2-Step Verification is enabled on your Google Account")
        print("4. Check your internet connection")
        
if __name__ == "__main__":
    print("=" * 60)
    print("GMAIL SMTP EMAIL TEST")
    print("=" * 60)
    print("\nBefore running this test, make sure you have:")
    print("1. Enabled 2-Step Verification on your Google Account")
    print("2. Generated an App Password")
    print("3. Updated SENDER_EMAIL and SENDER_PASSWORD in email_service.py")
    print("\nPress Enter to continue or Ctrl+C to cancel...")
    input()
    
    test_email_sending()
