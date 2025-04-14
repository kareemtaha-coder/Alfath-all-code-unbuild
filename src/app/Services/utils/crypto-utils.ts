import * as CryptoJS from 'crypto-js';

export function decryptAES(encryptedText: string, key: string, iv: string): string {
  // Convert Base64 Key and IV to WordArray
  const keyBytes = CryptoJS.enc.Base64.parse(key);
  const ivBytes = CryptoJS.enc.Base64.parse(iv);

  // Decode Base64 Ciphertext
  const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);

  // Decrypt AES
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedBytes } as any,
    keyBytes,
    { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: ivBytes }
  );

  return CryptoJS.enc.Utf8.stringify(decrypted);
}
