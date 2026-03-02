#!/usr/bin/env python3
"""
Simple Public Link Generator for Pandian Flowers Website
Uses Cloudflare Tunnel (Warp) or similar service
"""

import subprocess
import sys
import os

def main():
    port = 8000
    
    print("=" * 60)
    print("PANDIAN FLOWERS - Public Link Generator")
    print("=" * 60)
    print()
    print("Web Server Port: 8000")
    print()
    print("Options to get a public link:")
    print()
    print("1. Use Cloudflare Tunnel (Recommended - No Setup):")
    print("   - Go to: https://tunnel.lhr.life")
    print("   - Enter: http://localhost:8000")
    print()
    print("2. Use Expose (One-liner):")
    print("   Open PowerShell and run:")
    print(f"   choco install expose -y; expose http://localhost:{port}")
    print()
    print("3. Use Serveo (SSH - Simplest):")
    print("   Open PowerShell and run:")
    print(f"   ssh -R 80:localhost:{port} serveo.net")
    print()
    print("=" * 60)
    print()
    print("Your website is running at: http://localhost:8000")
    print()

if __name__ == "__main__":
    main()
