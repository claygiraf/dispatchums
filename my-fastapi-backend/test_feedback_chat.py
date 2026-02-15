"""
Test script for feedback chat API
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8001/api/v1"

def test_feedback_chat():
    print("Testing Feedback Chat API...")
    print("=" * 60)
    
    # First, login to get token
    print("\n1. Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "username": "clayderman",
            "password": "123abc"
        }
    )
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        print("✅ Login successful!")
        print(f"Token: {token[:50]}...")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test sending a message
    print("\n2. Sending feedback message...")
    send_response = requests.post(
        f"{BASE_URL}/feedback/chat/send",
        headers=headers,
        json={
            "case_number": "202601051455",
            "message": "This is a test feedback message for the chat system!",
            "photo_url": None
        }
    )
    
    if send_response.status_code == 200:
        message = send_response.json()
        print("✅ Message sent successfully!")
        print(f"Message ID: {message['id']}")
        print(f"Sender: {message['sender_name']}")
        print(f"Message: {message['message']}")
    else:
        print(f"❌ Failed to send message: {send_response.status_code}")
        print(send_response.text)
    
    # Test getting conversations
    print("\n3. Fetching conversations...")
    conv_response = requests.get(
        f"{BASE_URL}/feedback/chat/conversations",
        headers=headers
    )
    
    if conv_response.status_code == 200:
        conversations = conv_response.json()
        print(f"✅ Found {len(conversations)} conversation(s)")
        for conv in conversations:
            print(f"\n  Case #{conv['case_number']}:")
            print(f"  - Created: {conv['created_at']}")
            print(f"  - Messages: {len(conv['messages'])}")
            print(f"  - Unread: {conv['unread_count']}")
    else:
        print(f"❌ Failed to fetch conversations: {conv_response.status_code}")
        print(conv_response.text)
    
    # Test getting specific conversation
    print("\n4. Fetching specific conversation...")
    specific_response = requests.get(
        f"{BASE_URL}/feedback/chat/conversation/202601051455",
        headers=headers
    )
    
    if specific_response.status_code == 200:
        conv = specific_response.json()
        print(f"✅ Conversation found!")
        print(f"Case Number: {conv['case_number']}")
        print(f"Total Messages: {len(conv['messages'])}")
        print("\nMessages:")
        for msg in conv['messages']:
            print(f"  [{msg['sender_role']}] {msg['sender_name']}: {msg['message']}")
    else:
        print(f"❌ Failed to fetch conversation: {specific_response.status_code}")
        print(specific_response.text)
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")

if __name__ == "__main__":
    test_feedback_chat()
