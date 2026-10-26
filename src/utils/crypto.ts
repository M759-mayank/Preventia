/**
 * Client-side AES-GCM 256-bit Encryption Utility using Web Crypto API
 * Ensures medical records and private health notes are encrypted before storage.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

async function deriveKey(passphrase: string, salt: string): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function encryptMedicalData(
  plainText: string,
  passphrase: string,
  salt: string
): Promise<string> {
  const key = await deriveKey(passphrase, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(new ArrayBuffer(12)));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plainText)
  );
  return `${bufferToBase64(iv)}:${bufferToBase64(encrypted)}`;
}

export async function decryptMedicalData(
  cipherPayload: string,
  passphrase: string,
  salt: string
): Promise<string> {
  const parts = cipherPayload.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted payload format');
  }
  const iv = base64ToBuffer(parts[0]);
  const data = base64ToBuffer(parts[1]);
  const key = await deriveKey(passphrase, salt);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  return dec.decode(decrypted);
}
