#!/usr/bin/env python3
"""
Start server and test registration
"""
import subprocess
import sys
import time
import requests
import json
import os

def start_server():
    """Start the FastAPI server"""
    # Change to the backend directory
    backend_dir = r"C:\Users\User\Documents\dispatchums use this\my-fastapi-backend"
    os.chdir(backend_dir)
    
    # Start the server
    cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    
    print(f"Starting server from: {os.getcwd()}")
    print(f"Command: {' '.join(cmd)}")
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(5)
    
    return process

def test_registration():
    """Test the registration"""
    url = "http://127.0.0.1:8000/api/v1/auth/register"
    
    data = {
        "username": "clayderman",
        "email": "clayderman_loh@naver.com",
        "password": "testpass123",
        "full_name": "clayderman loh",
        "unit": "MECC HUMS"
    }
    
    try:
        print(f"Testing registration at: {url}")
        print(f"Data: {json.dumps(data, indent=2)}")
        
        # Test health first
        health_response = requests.get("http://127.0.0.1:8000/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Server is running")
        else:
            print(f"❌ Health check failed: {health_response.status_code}")
            return
        
        # Test registration
        response = requests.post(url, json=data, headers={"Content-Type": "application/json"}, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            result = response.json()
            print(f"Assigned Dispatcher ID: {result.get('dispatcher_id', 'N/A')}")
            print(f"User ID: {result.get('id', 'N/A')}")
        else:
            print("❌ Registration failed!")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")
                
    except requests.ConnectionError:
        print("❌ Connection failed - server may not be running")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    print("=== Starting Server and Testing Registration ===")
    
    # Start server
    server_process = start_server()
    
    try:
        # Test registration
        test_registration()
    finally:
        # Clean up
        print("\nStopping server...")
        server_process.terminate()
        server_process.wait()