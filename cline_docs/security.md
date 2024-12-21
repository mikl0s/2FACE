# Security Implementation

## Two-PIN System Overview

### Master PIN (6-digit)
- **Purpose:** Encrypts/decrypts the master encryption key
- **When Required:**
  * First-time setup
  * Adding new TOTP secrets
  * Changing access PIN
  * Importing/exporting secrets
- **Security Features:**
  * 6-digit length for increased security
  * SHA-256 hashing with salt
  * Used for encryption key derivation
  * Separate from daily access PIN

### Access PIN (4-digit)
- **Purpose:** Daily access to view TOTP codes
- **When Required:**
  * Unlocking the extension
  * Viewing TOTP codes
- **Security Features:**
  * 4-digit for quick access
  * 3 attempts before lockout
  * 5-minute lockout duration
  * Session timeout after 5 minutes
  * Auto-clear clipboard after 30 seconds

## Encryption Strategy

### Key Management
1. **Master Key:**
   - Random 256-bit key generated at setup
   - Used to encrypt all TOTP secrets
   - Never stored directly, only in encrypted form

2. **Key Encryption:**
   - Master key encrypted using key derived from Master PIN
   - PBKDF2 used for key derivation from Master PIN
   - Encrypted master key stored in Chrome sync storage

3. **Secret Encryption:**
   - Each TOTP secret encrypted with master key
   - AES-256 encryption in GCM mode
   - Each secret has unique IV
   - Authenticated encryption prevents tampering

### PIN Changes
1. **Access PIN Change:**
   - Only requires old and new access PIN
   - No re-encryption needed
   - Immediate effect

2. **Master PIN Change:**
   - Decrypt master key using old Master PIN
   - Re-encrypt master key using new Master PIN
   - No need to re-encrypt secrets
   - Validates old PIN before change

## Storage Security

### Chrome Storage Structure
```javascript
{
  // PIN Security
  hashedMasterPin: "sha256_of_master_pin",
  hashedAccessPin: "sha256_of_access_pin",
  pinSalt: "random_salt_for_pins",
  failedAttempts: 0,
  lockoutUntil: null,

  // Encryption
  encryptedMasterKey: {
    key: "encrypted_master_key",
    iv: "initialization_vector"
  },

  // Encrypted Secrets
  secrets: [
    {
      name: "Service Name",
      encryptedSecret: {
        data: "encrypted_totp_secret",
        iv: "unique_iv_for_secret"
      },
      urlFilters: ["example.com"]
    }
  ]
}
```

### Security Measures
1. **Data at Rest:**
   - All sensitive data encrypted
   - Chrome's built-in sync encryption
   - No plain text secrets stored

2. **Data in Use:**
   - Secrets decrypted only when needed
   - Memory cleared after use
   - Session timeout clears decrypted data

3. **Data in Transit:**
   - Chrome's secure sync protocol
   - End-to-end encryption
   - No external API calls

## Session Security

### Timeout Mechanism
- 5-minute inactivity timeout
- Activity tracking:
  * Mouse movements
  * Keyboard input
  * Touch events
- Automatic logout on timeout

### Clipboard Security
- TOTP codes cleared after 30 seconds
- Verification before copying
- Clear on session end

## Future Security Enhancements

### Planned Features
1. **Backup/Export:**
   - Encrypted backup file
   - Password-protected export
   - Secure sharing mechanism

2. **Additional Authentication:**
   - Biometric authentication option
   - Hardware security key support
   - Multi-factor authentication

3. **Enhanced Encryption:**
   - Per-secret encryption keys
   - Quantum-resistant algorithms
   - Enhanced key derivation

### Security Roadmap
1. **Short-term:**
   - Implement two-PIN system
   - Add secret encryption
   - Improve session security

2. **Medium-term:**
   - Add secure backup/restore
   - Implement biometric auth
   - Add secure sharing

3. **Long-term:**
   - Hardware security integration
   - Advanced encryption options
   - Enhanced privacy features