// lib/totp.js - RFC 6238 TOTP (Google Authenticator) Utility

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Generate a random Base32 secret key for Google Authenticator (16 chars).
 */
export function generateSecret(length = 16) {
  let secret = "";
  const cryptoObj = typeof window !== "undefined" ? window.crypto : null;
  const randomBytes = new Uint8Array(length);

  if (cryptoObj && cryptoObj.getRandomValues) {
    cryptoObj.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < length; i++) {
    secret += BASE32_ALPHABET[randomBytes[i] % 32];
  }

  return secret;
}

/**
 * Decode Base32 string to Uint8Array.
 */
function base32ToBytes(base32) {
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, "");
  const bytes = [];
  let bits = 0;
  let value = 0;

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

/**
 * Compute HMAC-SHA1 using Web Crypto API.
 */
async function hmacSha1(keyBytes, messageBytes) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: { name: "SHA-1" } },
      false,
      ["sign"]
    );
    const signature = await window.crypto.subtle.sign("HMAC", key, messageBytes);
    return new Uint8Array(signature);
  }

  // Fallback Node.js / fallback HMAC implementation
  throw new Error("Web Crypto API unavailble in environment");
}

/**
 * Generate 6-digit TOTP code for a secret at given timestamp (RFC 6238).
 */
export async function generateTOTP(secret, timeStepSeconds = 30, timestamp = Date.now()) {
  const counter = Math.floor(timestamp / 1000 / timeStepSeconds);
  const counterBuffer = new Uint8Array(8);

  let temp = counter;
  for (let i = 7; i >= 0; i--) {
    counterBuffer[i] = temp & 0xff;
    temp = Math.floor(temp / 256);
  }

  const keyBytes = base32ToBytes(secret);
  const hmacResult = await hmacSha1(keyBytes, counterBuffer);

  const offset = hmacResult[hmacResult.length - 1] & 0x0f;
  const binary =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  const otp = (binary % 1000000).toString().padStart(6, "0");
  return otp;
}

/**
 * Verify 6-digit TOTP token against secret with ±1 time window tolerance (90s window).
 */
export async function verifyTOTP(token, secret, timeStepSeconds = 30) {
  if (!token || !secret) return false;
  const cleanToken = String(token).trim().replace(/\s+/g, "");
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) return false;

  const now = Date.now();
  const windows = [-1, 0, 1]; // check current, previous, and next 30-second window for clock skew

  for (const windowOffset of windows) {
    try {
      const checkTime = now + windowOffset * timeStepSeconds * 1000;
      const expectedOtp = await generateTOTP(secret, timeStepSeconds, checkTime);
      if (cleanToken === expectedOtp) {
        return true;
      }
    } catch (err) {
      console.warn("TOTP check error:", err);
    }
  }

  return false;
}

/**
 * Construct otpauth:// URI for Google Authenticator QR code.
 */
export function getOtpAuthUri(secret, accountName = "m.tufailkhan12335@gmail.com", issuer = "HMT Success Academy") {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}

/**
 * Generate an array of 10 random Emergency Backup Recovery Codes (e.g., HMT-8F2A-91BC).
 */
export function generateBackupCodes(count = 10) {
  const hexChars = "0123456789ABCDEF";
  const cryptoObj = typeof window !== "undefined" ? window.crypto : null;
  const codes = [];

  for (let i = 0; i < count; i++) {
    const randomBytes = new Uint8Array(8);
    if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(randomBytes);
    } else {
      for (let j = 0; j < 8; j++) {
        randomBytes[j] = Math.floor(Math.random() * 256);
      }
    }
    const part1 = Array.from(randomBytes.slice(0, 4), (b) => hexChars[b % 16]).join("");
    const part2 = Array.from(randomBytes.slice(4, 8), (b) => hexChars[b % 16]).join("");
    codes.push(`HMT-${part1}-${part2}`);
  }

  return codes;
}

/**
 * Clean and verify if an input emergency recovery code matches any code in the backup codes array.
 * Returns { valid: boolean, matchedCode: string | null, remainingCodes: string[] }
 */
export function verifyBackupCode(inputCode, backupCodes = []) {
  if (!inputCode || !Array.isArray(backupCodes) || backupCodes.length === 0) {
    return { valid: false, matchedCode: null, remainingCodes: backupCodes };
  }

  const cleanInput = String(inputCode).replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  const matchedIndex = backupCodes.findIndex((code) => {
    const cleanCode = String(code).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    return cleanCode === cleanInput;
  });

  if (matchedIndex !== -1) {
    const remainingCodes = backupCodes.filter((_, idx) => idx !== matchedIndex);
    return {
      valid: true,
      matchedCode: backupCodes[matchedIndex],
      remainingCodes,
    };
  }

  return { valid: false, matchedCode: null, remainingCodes: backupCodes };
}

