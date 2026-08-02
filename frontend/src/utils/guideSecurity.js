/**
 * Dynamic SHA-256 Cryptographic Ticket Signature Generator
 * Uses Web Crypto API + window.crypto.getRandomValues for real-time ticket signing.
 */
export const generateTicketHash = async (payload) => {
  // Dynamically retrieve or generate a session cryptographic key
  let sessionKey = window.sessionStorage.getItem('yatra_crypto_key');
  if (!sessionKey) {
    const randomBuffer = new Uint8Array(16);
    window.crypto.getRandomValues(randomBuffer);
    sessionKey = Array.from(randomBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    window.sessionStorage.setItem('yatra_crypto_key', sessionKey);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + sessionKey);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Return 16-character uppercase cryptographic hash signature
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
};

/**
 * Dynamic Verified Guide Registry
 * Persists registered & eKYC verified guides in browser LocalStorage
 */
export const getStoredGuides = () => {
  const saved = localStorage.getItem('yatra_verified_guides');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (err) {
      console.error('Failed to parse stored guides:', err);
    }
  }
  return [];
};

export const saveGuideToRegistry = (guide) => {
  const current = getStoredGuides();
  // Prevent duplicate guide registration
  const exists = current.some(g => g.licenseNo === guide.licenseNo);
  const updated = exists ? current : [guide, ...current];
  localStorage.setItem('yatra_verified_guides', JSON.stringify(updated));
  return updated;
};