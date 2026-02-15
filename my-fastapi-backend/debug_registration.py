#!/usr/bin/env python3
"""
Debug script to test registration functionality
"""
import sys
import traceback
import requests
import json

def test_registration():
    """Test the registration endpoint"""
    url = "http://127.0.0.1:8000/api/v1/auth/register"
    
    data = {
        "username": "clayderman",
        "email": "clayderman.loh@naver.com",
        "password": "testpass123",
        "full_name": "clayderman loh",
        "unit": "MECC HUMS"
    }
    
    try:
        print(f"Testing registration at: {url}")
        print(f"Data: {json.dumps(data, indent=2)}")
        
        response = requests.post(
            url,
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            print(f"Response: {response.json()}")
        else:
            print("❌ Registration failed!")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")
                
    except requests.ConnectionError:
        print("❌ Connection failed - make sure the server is running")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        traceback.print_exc()

def test_health():
    """Test the health endpoint first"""
    try:
        response = requests.get("http://127.0.0.1:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.ConnectionError:
        print("❌ Server is not running")
        return False

if __name__ == "__main__":
    print("=== Debug Registration Script ===")
    
    if test_health():
        test_registration()
    else:
        print("Please start the server first")