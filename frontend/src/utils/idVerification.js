/**
 * Real-Time Document OCR Parser & Verification Engine
 * Reads text live from Citizenship / Passport images on Localhost using Tesseract.js
 */

// Parses OCR Extracted Text from actual Citizenship or Passport images
export const parseIdDocumentText = (ocrText) => {
  const lines = ocrText.split('\n').map(l => l.trim()).filter(Boolean);
  
  let extractedName = "";
  let extractedNid = "";

  // 1. Regex to detect Citizenship Number (e.g. 12-01-78-04321) or Passport Number (e.g. N0123456)
  const nidMatch = ocrText.match(/\b\d{2}[-/\s]?\d{2}[-/\s]?\d{2}[-/\s]?\d{4,6}\b/) || 
                   ocrText.match(/\b[A-Z]\d{7,8}\b/);
  
  if (nidMatch) {
    extractedNid = nidMatch[0].replace(/[\s/]/g, '-');
  }

  // 2. Extract Name candidate from line containing "Name" or capital letters
  for (const line of lines) {
    if (/name/i.test(line)) {
      const parts = line.split(/name/i);
      if (parts[1]) extractedName = parts[1].replace(/[:;\-_]/g, '').trim();
    }
  }

  // Fallback: search for first multi-word line that isn't a government header
  if (!extractedName) {
    const candidate = lines.find(l => 
      /^[A-Z\s]{4,30}$/i.test(l) && 
      !/citizenship|passport|republic|nepal|government|district/i.test(l)
    );
    if (candidate) extractedName = candidate.trim();
  }

  return {
    rawText: ocrText,
    extractedName: extractedName || "",
    extractedNid: extractedNid || "",
  };
};

// Generates official Serial Number (e.g. NTB-L-6081) from user's NID + Phone hash
export const generateVerificationSerial = async (nidNumber, phoneNumber, isCertificate = false) => {
  const rawInput = `${nidNumber}_${phoneNumber}_YATRA_2026`;
  const encoder = new TextEncoder();
  const data = encoder.encode(rawInput);
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const numericPart = parseInt(hex.substring(0, 8), 16) % 9000 + 1000;
  const prefix = isCertificate ? "NTB-L" : "NID-V";
  return `${prefix}-${numericPart}`;
};

// Masking for privacy
export const maskPhoneNumber = (phone) => {
  const cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return `+977 ${cleaned.substring(0, 4)}***${cleaned.substring(7)}`;
  }
  return `+977 ${phone}`;
};

export const maskNidNumber = (nid) => {
  if (nid && nid.length > 5) {
    return `${nid.substring(0, 6)}*****`;
  }
  return `${nid || 'NID'}*****`;
};

// Local Storage Registry (Starts completely EMPTY — NO fake hardcoded data!)
export const getVerifiedGuidesRegistry = () => {
  const saved = localStorage.getItem('yatra_real_verified_guides');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading guide registry:', e);
    }
  }
  return []; // ZERO initial fake guides
};

export const saveVerifiedGuide = (guide) => {
  const current = getVerifiedGuidesRegistry();
  const updated = [guide, ...current];
  localStorage.setItem('yatra_real_verified_guides', JSON.stringify(updated));
  return updated;
};