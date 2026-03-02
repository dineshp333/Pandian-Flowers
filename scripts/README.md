# Development Scripts

This folder contains helper scripts for local development. These are not part of the production website.

## Scripts

### run-app.bat
Starts a local HTTP server on port 8000 and opens the website in your browser.

**Usage:**
```bash
./run-app.bat
```

**What it does:**
- Starts Python HTTP server
- Opens http://localhost:8000 in default browser

---

### share-app.bat & share-app.ps1
Helps generate a public shareable link using Serveo tunnel.

**Usage:**
```bash
./share-app.bat
# Or
.\share-app.ps1
```

**Requirements:**
- SSH client installed
- Internet connection

---

### get-public-link.py
Python utility to display options for generating public links.

**Usage:**
```bash
python get-public-link.py
```

---

## How to Use

1. **For Local Testing:**
   ```bash
   cd scripts
   ./run-app.bat
   ```

2. **For Sharing with Friends:**
   ```bash
   cd scripts
   ./share-app.bat
   ```

---

**Note:** These scripts are for development only. The production website is hosted on GitHub Pages.
