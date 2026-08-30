import { PacketChunk } from '../types';

/**
 * Converts a text message into realistic binary, hex, and simulated IP packet chunks.
 */
export function createPacketsFromMessage(
  message: string,
  isEncrypted: boolean = false
): PacketChunk[] {
  const cleanMessage = message.trim() || 'Hello World';
  const chunkSize = Math.max(2, Math.ceil(cleanMessage.length / 3));
  const chunks: string[] = [];

  for (let i = 0; i < cleanMessage.length; i += chunkSize) {
    chunks.push(cleanMessage.slice(i, i + chunkSize));
  }

  // Generate pseudo IP addresses
  const sourceIp = '192.168.1.42'; // Local private IP
  const destIp = '142.250.190.46'; // Simulated public server IP (Google/Edge)

  return chunks.map((chunk, index) => {
    // Generate binary
    const binary = Array.from(chunk)
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');

    // Generate hex
    const hex = Array.from(chunk)
      .map((char) => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');

    // Generate pseudo checksum
    let sum = 0;
    for (let j = 0; j < chunk.length; j++) {
      sum = (sum + chunk.charCodeAt(j) * (j + 1)) % 65535;
    }
    const checksum = '0x' + sum.toString(16).toUpperCase().padStart(4, '0');

    return {
      id: index + 1,
      total: chunks.length,
      textPayload: isEncrypted ? scrambleText(chunk, index) : chunk,
      binaryPayload: binary,
      hexPayload: hex,
      sequenceNumber: 1000 + index * 128,
      sourceIp,
      destIp,
      sourcePort: 54321 + index,
      destPort: 443, // HTTPS
      checksum,
      ttl: 64 - index * 4,
    };
  });
}

/**
 * Deterministic cipher scramble for encryption demonstration
 */
export function scrambleText(text: string, seed: number = 0): string {
  const cipherChars = 'XYZ7#A92@K4QW!$89MNP';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const idx = (charCode + seed * 7 + i * 13) % cipherChars.length;
    result += cipherChars[idx];
  }
  return result || 'X7#A92@K';
}

/**
 * Text to full binary stream helper
 */
export function textToBinary(text: string): string {
  return Array.from(text)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}
