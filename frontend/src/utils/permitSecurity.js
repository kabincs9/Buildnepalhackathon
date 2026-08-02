import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Native Browser SHA-256 Cryptographic Ticket Signature Generator
 * Runs 100% on Localhost via W3C Web Crypto API
 */
export const generatePermitCryptoHash = async (payload) => {
  let sessionKey = window.sessionStorage.getItem('yatra_permit_key');
  if (!sessionKey) {
    const randomBuffer = new Uint8Array(16);
    window.crypto.getRandomValues(randomBuffer);
    sessionKey = Array.from(randomBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    window.sessionStorage.setItem('yatra_permit_key', sessionKey);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + sessionKey);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
};

/**
 * 1-Click PDF Exporter using jspdf + html2canvas
 * Compiles official Government E-Permit Certificate into downloadable PDF
 */
export const exportPermitToPdf = async (elementId, fileName = 'Yatra_Official_E_Permit.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 190;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export error:', err);
    // Fail-safe browser print fallback
    window.print();
  }
};

/**
 * LocalStorage Permits Registry Store
 */
export const getStoredPermitsRegistry = () => {
  const saved = localStorage.getItem('yatra_real_issued_permits');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing permits registry:', e);
    }
  }
  return [];
};

export const savePermitToRegistry = (permit) => {
  const current = getStoredPermitsRegistry();
  const updated = [permit, ...current];
  localStorage.setItem('yatra_real_issued_permits', JSON.stringify(updated));
  return updated;
};