<div align="center">

<svg width="180" height="180" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <circle cx="64" cy="64" r="60" fill="#1976d2"/>
  <path d="M44 40 L84 40 A24 24 0 1 1 84 88 L44 88 A24 24 0 1 1 44 40" 
        fill="none" 
        stroke="#ffffff" 
        stroke-width="8"
        stroke-linecap="round"/>
  <circle cx="64" cy="64" r="8" fill="#ffffff"/>
  <g stroke="#ffffff" stroke-width="4" stroke-linecap="round">
    <line x1="64" y1="28" x2="64" y2="36"/>
    <line x1="64" y1="92" x2="64" y2="100"/>
    <line x1="28" y1="64" x2="36" y2="64"/>
    <line x1="92" y1="64" x2="100" y2="64"/>
  </g>
</svg>

# 2FACE

A modern, secure Chrome extension for managing Time-Based One-Time Passwords (TOTP).

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Security](https://img.shields.io/badge/security-PIN%20protected-green.svg)](README.md#security-features)
[![Platform](https://img.shields.io/badge/platform-Chrome-yellow.svg)](README.md#installation)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-brightgreen.svg)](README.md#technologies)
[![Dark Mode](https://img.shields.io/badge/theme-light%20%2F%20dark-blueviolet.svg)](README.md#features)
[![TOTP](https://img.shields.io/badge/2FA-TOTP-orange.svg)](README.md#features)
[![Keyboard](https://img.shields.io/badge/navigation-keyboard-lightgrey.svg)](README.md#features)
[![Storage](https://img.shields.io/badge/sync-cross--browser-blue.svg)](README.md#features)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Security](#security-features) • [Development](#development)

</div>

## ✨ Features

### Core Features
- 🔒 **PIN Protection**
  - 4-digit PIN security
  - Auto-logout
  - Brute force protection
- 🎨 **Modern Interface**
  - Clean, minimal design
  - Dark/Light themes
  - Real-time search
- ⌨️ **Keyboard Navigation**
  - Full keyboard support
  - Quick search (`/`)
  - Arrow key navigation
- 🔄 **Smart Sync**
  - Cross-browser synchronization
  - Instant updates
  - Secure storage

### Security & Privacy
- 🛡️ Local-only storage
- 🔐 PIN-based encryption
- 🕒 Auto-refresh TOTP codes
- 📋 Auto-clear clipboard
- 🚫 No external dependencies

### User Experience
- 🔍 Real-time search filtering
- 🏷️ Tag-based organization
- 📱 Responsive design
- ♿ Accessibility focused
- 🌐 URL-based filtering

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mikl0s/2FACE.git
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions
   ```

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the `2FACE` directory

## 📖 Usage

### First Time Setup
1. Click the 2FACE icon in your browser toolbar
2. Set a 4-digit PIN for security
3. Choose your preferred theme (dark/light)

### Managing TOTP Codes
1. Click the "Add New" button (🏛️)
2. Enter:
   - Service name
   - Base32 secret
   - Optional URL filters/tags
3. Save and verify the code

### Daily Use
- Enter PIN to access codes
- Use `/` to quickly search
- Navigate with ↑/↓ keys
- Press Enter to copy code
- Click 🌙 to toggle theme

## 🔐 Security Features

### PIN Protection
- 4-digit PIN requirement
- Secure hashing (SHA-256)
- Failed attempt tracking
- Temporary lockout system

### Data Security
- Local storage only
- Chrome sync encryption
- No external servers
- Automatic session timeouts

### Privacy
- No analytics/tracking
- No network requests
- Clipboard auto-clear
- URL-based filtering

## 💻 Development

### Prerequisites
- Chrome browser
- Basic understanding of:
  - HTML/CSS/JavaScript
  - Chrome Extension APIs
  - TOTP implementation

### Setup
1. Clone the repository
2. Load the extension in Chrome
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Project Structure
```
2FACE/
├── components/     # Reusable components
├── icons/         # Extension icons
├── manifest.json  # Extension config
├── popup.*        # Main extension UI
└── README.md     # Documentation
```

### Testing
- Test PIN protection
- Verify TOTP generation
- Check theme switching
- Test keyboard navigation
- Verify cross-browser sync

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [mikl0s](https://github.com/mikl0s)

</div>
