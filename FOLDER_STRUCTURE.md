# 📁 Project Structure

```
pandian-flowers/
│
├── 🌐 ROOT (Website Files)
│   ├── index.html                  # Home page
│   ├── about.html                  # About us page
│   ├── gallery.html                # Gallery showcase
│   ├── services.html               # Services offered
│   ├── order.html                  # Order form
│   ├── contact.html                # Contact page
│   ├── admin.html                  # Admin panel (⚠️ needs security fixes)
│   ├── test-runner.html            # Automated test suite
│   │
│   ├── 📄 Config Files
│   ├── README.md                   # Main documentation
│   ├── robots.txt                  # SEO: Search engine bot rules
│   ├── sitemap.xml                 # SEO: Website sitemap
│   ├── .nojekyll                   # GitHub Pages config (disable Jekyll)
│   ├── .gitignore                  # Git ignore rules
│   │
│   └── 📂 Folders
│
├── 📂 assets/                      # Website resources
│   ├── css/
│   │   └── style.css               # Custom styling (3KB)
│   ├── js/
│   │   ├── script.js               # Main JavaScript (forms, navigation)
│   │   ├── admin.js                # Admin panel logic
│   │   ├── gallery-loader.js       # Gallery image loader
│   │   └── tests.js                # Automated test suite
│   └── images/
│       ├── wedding/                # Wedding garland photos
│       ├── reception/              # Reception decoration photos
│       ├── home/                   # Home nilavu photos
│       └── custom/                 # Custom design photos
│
├── 📂 components/                  # Reusable HTML components
│   ├── header.html                 # Site header
│   └── footer.html                 # Site footer
│
├── 📂 docs/                        # Documentation
│   ├── README.md                   # Project overview
│   ├── DOCUMENTATION.md            # Full documentation
│   ├── REQUIREMENTS.md             # System requirements
│   ├── ADMIN_GUIDE.md              # Admin panel guide
│   ├── TEST_CASES.md               # Test cases
│   ├── TEST_CASES_DETAILED.md      # Detailed test documentation (65 tests)
│   ├── SECURITY_REPORT.md          # Security vulnerabilities & fixes
│   ├── VULNERABILITY_SCAN.md       # Vulnerability scan results
│   ├── GITHUB_PAGES_SETUP.md       # GitHub Pages setup guide
│
├── 📂 scripts/                     # Development scripts (not in website)
│   ├── run-app.bat                 # Start local server (Windows)
│   ├── share-app.bat               # Share website link (Windows)
│   ├── share-app.ps1               # Share website link (PowerShell)
│   ├── get-public-link.py          # Generate public link options
│   └── README.md                   # Scripts documentation
│
├── 📂 .git/                        # Version control (Git repository)
│   └── ...
│
└── FILE SIZE SUMMARY
    • style.css         ≈ 3 KB
    • script.js         ≈ 5 KB
    • admin.js          ≈ 3 KB
    • Total JS/CSS      ≈ 11 KB
    • Total Size        ≈ 200 KB (with images)
```

---

## 📍 File Organization by Purpose

### 🌐 Website Pages
- `index.html` - Homepage
- `about.html` - About company
- `gallery.html` - Photo gallery
- `services.html` - Service offerings
- `order.html` - Order form
- `contact.html` - Contact page
- `admin.html` - Admin panel (⚠️ security issue)
- `test-runner.html` - Testing tool

### 🎨 Styling & Assets
```
assets/
├── css/style.css        # All custom styling
├── js/                  # JavaScript functionality
│   ├── script.js        # Main app logic
│   ├── admin.js         # Admin panel
│   ├── gallery-loader.js# Gallery functionality
│   └── tests.js         # Test suite
└── images/              # Product photos (by category)
    ├── wedding/
    ├── reception/
    ├── home/
    └── custom/
```

### 📚 Documentation
```
docs/
├── README.md                   # Quick start
├── DOCUMENTATION.md            # Full guide
├── ADMIN_GUIDE.md              # Using admin panel
├── TEST_CASES_DETAILED.md      # 65 test cases
├── SECURITY_REPORT.md          # Security issues & fixes
├── REQUIREMENTS.md             # Technical specs
└── GITHUB_PAGES_SETUP.md       # Deployment guide
```

### 🛠️ Development Scripts
```
scripts/
├── run-app.bat         # Local development
├── share-app.bat/.ps1  # Public link sharing
├── get-public-link.py  # Link options
└── README.md           # Script documentation
```

---

## 🗂️ What Was Cleaned Up

**Removed:**
- ❌ `ngrok.zip` (9.7 MB - unnecessary binary)
- ❌ `public/` folder (duplicate of root files)
- ❌ `.venv/` folder (should be local only, in .gitignore)

**Moved to `scripts/` folder:**
- ✅ `run-app.bat` → Development helper
- ✅ `share-app.bat` → Development helper
- ✅ `share-app.ps1` → Development helper
- ✅ `get-public-link.py` → Development helper

**Added:**
- ✅ `.gitignore` - Prevent committing unnecessary files
- ✅ `scripts/README.md` - Script documentation

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Pages** | 8 HTML files |
| **CSS** | 3 KB (single file) |
| **JavaScript** | ~15 KB |
| **Documentation** | 7 files |
| **Test Cases** | 65 comprehensive tests |
| **Security Issues** | 4 critical (documented) |

---

## 🚀 Quick Start

**1. Local Development:**
```
./scripts/run-app.bat
```

**2. Share Publicly:**
```
./scripts/share-app.bat
```

**3. View Website:**
- Local: http://localhost:8000
- Public: https://dineshp333.github.io/Pandian-Flowers/

**4. Run Tests:**
- Open: http://localhost:8000/test-runner.html

---

## 📌 Important Notes

- **GitHub Pages:** Website is live at: https://dineshp333.github.io/Pandian-Flowers/
- **Admin Panel:** ⚠️ Not secure for production - see [SECURITY_REPORT.md](docs/SECURITY_REPORT.md)
- **Database:** No backend yet - forms don't submit anywhere
- **Images:** Placeholder emojis until real photos uploaded

---

**Last Updated:** March 2, 2026
