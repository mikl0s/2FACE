# TOTP Chrome Extension

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/your-extension-id.svg)](https://chrome.google.com/webstore/detail/your-extension-id)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/your-extension-id.svg)](https://chrome.google.com/webstore/detail/your-extension-id)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A simple Chrome extension for generating Time-Based One-Time Passwords (TOTP). This extension allows users to manage their base32 secret keys and quickly copy TOTP codes to the clipboard.

## Features

-   Displays a list of TOTP codes.
-   Allows managing base32 secret keys.
-   Copies TOTP codes to the clipboard.
-   Dark mode setting that syncs across Chrome browsers.

## Technologies Used

-   Chrome Extension API
-   HTML
-   CSS
-   JavaScript
-   Chrome Storage API (`storage.sync`)
-   otplib

## Installation

1.  Clone this repository.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click "Load unpacked" and select the `hello-world-extension` directory.

## Usage

1.  Click the extension icon in the browser toolbar.
2.  The popup will display a list of TOTP codes.
3.  Click a TOTP code to copy it to the clipboard.
4.  Click the settings icon to manage base32 secret keys.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
