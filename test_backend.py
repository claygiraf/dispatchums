import requests
import json

try:
    # Test health endpoint
    print("Testing backend health endpoint...")
    response = requests.get('http://127.0.0.1:8001/health', timeout=5)
    print(f"Health check status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    # Test root endpoint
    print("Testing root endpoint...")
    response = requests.get('http://127.0.0.1:8001/', timeout=5)
    print(f"Root status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    print("✓ Backend is working correctly on port 8001!")
    
except Exception as e:
    print(f"✗ Error: {e}")
