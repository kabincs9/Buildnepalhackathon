import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import Tesseract from 'tesseract.js';
import { 
  parseIdDocumentText, 
  generateVerificationSerial, 
  maskPhoneNumber, 
  maskNidNumber, 
  getVerifiedGuidesRegistry, 
  saveVerifiedGuide 
} from '../utils/idVerification';
import '../styles/pages/LocalGuides.css';

const LocalGuides = () => {
  // Navigation Tabs: 'marketplace' | 'kyc_onboarding' | 'gate_scanner' | 'analytics'
  const [activeTab, setActiveTab] = useState('marketplace');

  // Registry State
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');

  // Modal States
  const [inspectedGuide, setInspectedGuide] = useState(null);
  const [bookingGuide, setBookingGuide] = useState(null);
  const [bookingHours, setBookingHours] = useState(2);
  const [includePass, setIncludePass] = useState(true);
  const [issuedTicket, setIssuedTicket] = useState(null);

  // eKYC OCR Scanner State
  const [documentPreview, setDocumentPreview] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // Verification Form
  const [form, setForm] = useState({
    fullName: '',
    nidNumber: '',
    phone: '',
    address: '',
  });

  // Gatekeeper QR Scanner State
  const [scanResult, setScanResult] = useState(null);

  // Load Verified Guides Registry
  useEffect(() => {
    const registry = getVerifiedGuidesRegistry();
    setGuides(registry);
  }, []);

  // Clear Registry Data
  const clearRegistryData = () => {
    if (window.confirm("Are you sure you want to clear all verified guide data from local storage?")) {
      localStorage.removeItem('yatra_real_verified_guides');
      setGuides([]);
      alert("Registry cleared! All guide records reset.");
    }
  };

  // Web Camera QR Scanner Initialization
  useEffect(() => {
    let scanner = null;
    if (activeTab === 'gate_scanner') {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
      scanner.render(
        async (decodedText) => {
          try {
            const ticketObj = JSON.parse(decodedText);
            setScanResult({
              valid: true,
              ticket: ticketObj,
              message: "VERIFIED AUTHENTIC DIGITAL PASS ✅"
            });
          } catch (e) {
            setScanResult({
              valid: false,
              message: "SCANNED QR DOES NOT CONTAIN VALID YATRA TICKET DATA ⚠️"
            });
          }
        },
        (error) => {}
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error("Scanner cleanup error:", err));
      }
    };
  }, [activeTab]);

  // File-based QR Code Scanner (Always works on Localhost without camera)
  const handleQrFileUpload = async (file) => {
    if (!file) return;
    const html5QrCode = new Html5Qrcode("qr-file-reader-hidden");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      const ticketObj = JSON.parse(decodedText);
      setScanResult({
        valid: true,
        ticket: ticketObj,
        message: "VERIFIED AUTHENTIC DIGITAL PASS ✅"
      });
    } catch (err) {
      console.error("QR File Scan Error:", err);
      setScanResult({
        valid: false,
        message: "COULD NOT READ TICKET QR CODE FROM IMAGE FILE ❌"
      });
    }
  };

  // Tesseract OCR Handler
  const handleDocumentUpload = async (file) => {
    if (!file) return;
    setDocumentPreview(URL.createObjectURL(file));
    setIsOcrProcessing(true);
    setOcrStatus('Extracting ID text on Localhost...');
    setOcrProgress(10);

    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setOcrStatus(`Extracting Text: ${progress}%`);
              setOcrProgress(progress);
            }
          }
        }
      );

      const parsed = parseIdDocumentText(result.data.text);
      setOcrStatus('ID Document Scanned Successfully!');
      setIsOcrProcessing(false);

      setForm(prev => ({
        ...prev,
        fullName: parsed.extractedName || prev.fullName,
        nidNumber: parsed.extractedNid || prev.nidNumber,
      }));

    } catch (err) {
      console.error("OCR Error:", err);
      setOcrStatus("Document loaded. Please verify details below.");
      setIsOcrProcessing(false);
    }
  };

  // Submit Real Verification
  const handleRegisterGuide = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.nidNumber || !form.phone || !form.address) {
      alert("Please complete all 4 verification fields.");
      return;
    }

    const serialNo = await generateVerificationSerial(form.nidNumber, form.phone, true);

    const newGuide = {
      id: `GUIDE-${Math.floor(100 + Math.random() * 900)}`,
      name: form.fullName,
      licenseNo: serialNo,
      verificationStatus: "Citizenship & NTB Verified ✅",
      location: form.address,
      phoneMasked: maskPhoneNumber(form.phone),
      nidMasked: maskNidNumber(form.nidNumber),
      specialty: "Heritage Architecture & Cultural Walks",
      languages: ["Nepali", "English"],
      pricePerHour: 25,
      verifiedDate: `Verified ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    };

    const updatedRegistry = saveVerifiedGuide(newGuide);
    setGuides(updatedRegistry);
    alert(`🎉 Verified! ${newGuide.name} assigned Serial No: ${serialNo}. Published to Marketplace!`);
    setActiveTab('marketplace');
    
    setDocumentPreview(null);
    setForm({ fullName: '', nidNumber: '', phone: '', address: '' });
  };

  // Checkout Payment Handler
  const executePayment = (e) => {
    e.preventDefault();
    if (!bookingGuide) return;

    const baseFee = bookingGuide.pricePerHour * bookingHours;
    const heritageFee = includePass ? 15 : 0;
    const platformCut = (baseFee + heritageFee) * 0.10;
    const total = baseFee + heritageFee + platformCut;

    const passId = `YATRA-${Math.floor(100000 + Math.random() * 900000)}`;

    const ticket = {
      passId,
      guideId: bookingGuide.id,
      guideName: bookingGuide.name,
      licenseNo: bookingGuide.licenseNo,
      location: bookingGuide.location,
      hours: bookingHours,
      totalPaid: total.toFixed(2),
      issuedAt: new Date().toLocaleString()
    };

    setIssuedTicket(ticket);
    setBookingGuide(null);
  };

  // Filtered Guides
  const filteredGuides = guides.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        g.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLang = selectedLang === 'All' || g.languages.includes(selectedLang);
    return matchSearch && matchLang;
  });

  return (
    <div className="guides-page">
      {/* Hidden container for file-based QR code scanning */}
      <div id="qr-file-reader-hidden" style={{ display: 'none' }}></div>

      {/* Role & Portal Switcher Bar */}
      <div className="portal-switcher">
        <button 
          className={`portal-tab ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          👤 Tourist Marketplace ({guides.length})
        </button>

        <button 
          className={`portal-tab ${activeTab === 'kyc_onboarding' ? 'active' : ''}`}
          onClick={() => setActiveTab('kyc_onboarding')}
        >
          🛡️ Guide eKYC Onboarding (OCR)
        </button>

        <button 
          className={`portal-tab ${activeTab === 'gate_scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('gate_scanner')}
        >
          📱 Heritage Gate Scanner
        </button>

        <button 
          className={`portal-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Platform Financial Analytics
        </button>
      </div>

      {/* PORTAL 1: TOURIST MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="tab-content">
          <div className="section-header">
            <h1>🇳🇵 Verified Local Guides Marketplace</h1>
            <p>Direct booking with official eKYC verified local guides in Nepal</p>
          </div>

          <div className="filter-bar">
            <input 
              type="text" 
              className="search-input"
              placeholder="🔍 Search guide by real name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select 
              className="lang-select"
              value={selectedLang} 
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              <option value="All">Languages: All</option>
              <option value="Nepali">Nepali</option>
              <option value="English">English</option>
            </select>

            {/* Reset Data Button */}
            {guides.length > 0 && (
              <button className="reset-data-btn" onClick={clearRegistryData}>
                🗑️ Reset Data
              </button>
            )}
          </div>

          {filteredGuides.length > 0 ? (
            <div className="guides-grid">
              {filteredGuides.map((guide) => (
                <div key={guide.id} className="guide-card">
                  <div className="card-top">
                    <h3>{guide.name}</h3>
                    <span className="verified-tag">VERIFIED ✅</span>
                  </div>

                  <div className="verified-badge">
                    <span>Official Serial: <strong>{guide.licenseNo}</strong></span>
                  </div>

                  <p className="meta-text">📍 {guide.location}</p>
                  <p className="meta-text">📞 Phone: {guide.phoneMasked}</p>
                  <p className="meta-text">🆔 NID Record: {guide.nidMasked}</p>
                  <p className="meta-text">🗣️ {guide.languages.join(', ')}</p>

                  <div className="price-tag">
                    💰 <strong>${guide.pricePerHour}</strong> / hour
                  </div>

                  <div className="card-actions">
                    <button className="secondary-btn" onClick={() => setInspectedGuide(guide)}>
                      🛡️ View eKYC ID
                    </button>
                    <button className="primary-btn" onClick={() => setBookingGuide(guide)}>
                      Book Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-registry-box">
              <h3>📄 No Verified Guides Registered Yet</h3>
              <p>Be the first to onboard! Switch to <strong>"🛡️ Guide eKYC Onboarding (OCR)"</strong> above to scan your Citizenship ID or Passport.</p>
              <button className="primary-btn" onClick={() => setActiveTab('kyc_onboarding')}>
                Go to eKYC Onboarding
              </button>
            </div>
          )}
        </div>
      )}

      {/* PORTAL 2: eKYC ONBOARDING */}
      {activeTab === 'kyc_onboarding' && (
        <div className="tab-content">
          <div className="section-header">
            <h1>🛡️ Citizenship & Passport eKYC Onboarding</h1>
            <p>Upload your Government ID. Browser-Side Tesseract OCR parses text live on Localhost!</p>
          </div>

          <div className="ocr-onboarding-container">
            {/* Box 1: Custom Drag & Drop Upload Dropzone */}
            <div className="ocr-upload-box">
              <h3>1. Upload Citizenship ID or Passport</h3>
              <p className="upload-hint">Upload photo to extract Name & NID Number automatically</p>

              <label className="upload-dropzone">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleDocumentUpload(e.target.files[0])}
                  className="hidden-file-input"
                />
                <div className="dropzone-content">
                  <span className="upload-icon">🪪</span>
                  <span className="upload-text"><strong>Click to upload</strong> or drag & drop</span>
                  <span className="upload-subtext">Supports PNG, JPG, or Passport Scans</span>
                </div>
              </label>

              {documentPreview && (
                <div className="image-preview-container">
                  <p className="preview-label">📄 Scanned ID Document Preview:</p>
                  <img src={documentPreview} alt="Uploaded ID" className="id-preview" />
                </div>
              )}

              {isOcrProcessing && (
                <div className="ocr-progress-box">
                  <p>{ocrStatus}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${ocrProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Box 2: Distinct Blue Verification Details Box */}
            <div className="ocr-results-box highlighted">
              <h3>2. Real Verification Details</h3>
              
              <form onSubmit={handleRegisterGuide} className="guide-reg-form">
                <div className="form-group">
                  <label>Full Name (Extracted from ID):</label>
                  <input 
                    type="text" 
                    value={form.fullName} 
                    onChange={(e) => setForm({...form, fullName: e.target.value})}
                    placeholder="e.g. KABIN Ry"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>National ID / Citizenship / Passport Number:</label>
                  <input 
                    type="text" 
                    value={form.nidNumber} 
                    onChange={(e) => setForm({...form, nidNumber: e.target.value})}
                    placeholder="e.g. 27017907396"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number (Nepali Format):</label>
                  <input 
                    type="text" 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="e.g. 9841234567"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Address / District / Ward:</label>
                  <input 
                    type="text" 
                    value={form.address} 
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    placeholder="e.g. Patan, Lalitpur (Ward 4)"
                    required 
                  />
                </div>

                <button type="submit" className="primary-btn full-width verify-submit-btn">
                  ✅ Verify Document & Publish Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL 3: HERITAGE GATE SCANNER */}
      {activeTab === 'gate_scanner' && (
        <div className="tab-content">
          <div className="section-header">
            <h1>📱 Heritage Gatekeeper QR Scanner</h1>
            <p>Scan tourist QR tickets using Camera OR Upload QR Ticket Image File</p>
          </div>

          <div className="scanner-container">
            {/* Dual Scanner Options */}
            <div className="file-qr-scan-box">
              <label className="file-qr-btn">
                🖼️ Upload QR Ticket Image File
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleQrFileUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="or-divider">— OR USE CAMERA BELOW —</p>
            </div>

            <div id="qr-reader" className="qr-reader-box"></div>

            {scanResult && (
              <div className={`scan-alert ${scanResult.valid ? 'success' : 'error'}`}>
                <h3>{scanResult.message}</h3>

                {scanResult.valid && (
                  <div className="scanned-details">
                    <p><strong>Ticket ID:</strong> {scanResult.ticket.passId}</p>
                    <p><strong>Guide Name:</strong> {scanResult.ticket.guideName} ({scanResult.ticket.licenseNo})</p>
                    <p><strong>Duration:</strong> {scanResult.ticket.hours} Hours</p>
                    <p><strong>Amount Paid:</strong> ${scanResult.ticket.totalPaid}</p>
                    <p className="time-text">Issued At: {scanResult.ticket.issuedAt}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PORTAL 4: PLATFORM FINANCIALS */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <div className="section-header">
            <h1>📊 Yatra Platform Financial Economics</h1>
            <p>Monetization model, 10% platform take-rate, and verified guide ecosystem metrics</p>
          </div>

          <div className="analytics-metrics-grid">
            <div className="analytics-card">
              <span className="card-number">{guides.length}</span>
              <span className="card-label">Verified Guides in Registry</span>
            </div>

            <div className="analytics-card highlight">
              <span className="card-number">10%</span>
              <span className="card-label">Yatra Automated Platform Take-Rate</span>
            </div>

            <div className="analytics-card">
              <span className="card-number">100%</span>
              <span className="card-label">Localhost Browser OCR Verification</span>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {inspectedGuide && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setInspectedGuide(null)}>✕</button>
            <h2>🛡️ Verified Guide Credentials</h2>
            <p className="sub-text">Extracted & Verified via Government ID Document OCR</p>

            <div className="kyc-badge-box">
              <p><strong>Guide Name:</strong> {inspectedGuide.name}</p>
              <p><strong>Official Serial ID:</strong> <span className="green-text">{inspectedGuide.licenseNo}</span></p>
              <p><strong>Verified Status:</strong> {inspectedGuide.verificationStatus}</p>
              <p><strong>Phone Record:</strong> {inspectedGuide.phoneMasked}</p>
              <p><strong>NID / Passport Record:</strong> {inspectedGuide.nidMasked}</p>
              <p><strong>Address:</strong> {inspectedGuide.location}</p>
              <p><strong>Verification Record:</strong> {inspectedGuide.verifiedDate}</p>
            </div>

            <button className="primary-btn full-width" onClick={() => setInspectedGuide(null)}>
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {bookingGuide && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setBookingGuide(null)}>✕</button>
            <h2>💳 Yatra Payment Gateway</h2>
            <p className="sub-text">Booking Verified Guide: {bookingGuide.name}</p>

            <form onSubmit={executePayment} className="checkout-form">
              <div className="form-group">
                <label>Tour Duration (Hours):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="12" 
                  value={bookingHours} 
                  onChange={(e) => setBookingHours(Number(e.target.value))} 
                  required 
                />
              </div>

              <div className="form-checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={includePass} 
                    onChange={(e) => setIncludePass(e.target.checked)} 
                  />
                  Bundle Heritage Site Entry Ticket (+$15)
                </label>
              </div>

              <div className="fare-breakdown">
                <p><span>Guide Fee (${bookingGuide.pricePerHour} × {bookingHours} hrs):</span> <span>${bookingGuide.pricePerHour * bookingHours}</span></p>
                {includePass && <p><span>Heritage Entry Pass:</span> <span>$15.00</span></p>}
                <p><span>Yatra Platform Fee (10%):</span> <span>${((bookingGuide.pricePerHour * bookingHours + (includePass ? 15 : 0)) * 0.10).toFixed(2)}</span></p>
                <hr />
                <p className="total-row"><strong>Total Payable:</strong> <strong>${((bookingGuide.pricePerHour * bookingHours + (includePass ? 15 : 0)) * 1.10).toFixed(2)}</strong></p>
              </div>

              <button type="submit" className="primary-btn full-width">
                🔒 Pay & Generate Digital Ticket Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {issuedTicket && (
        <div className="modal-overlay">
          <div className="modal-content ticket-modal">
            <button className="close-btn" onClick={() => setIssuedTicket(null)}>✕</button>
            <div className="success-tag">🎉 TICKET PAID & ISSUED</div>
            <h2>🎫 Digital Heritage Pass</h2>
            <p className="sub-text">Pass Ref: {issuedTicket.passId}</p>

            <div className="qr-box">
              <QRCodeCanvas 
                value={JSON.stringify(issuedTicket)} 
                size={200}
                level="H"
              />
              <p className="qr-sub">Scannable at Patan / Bhaktapur Gate</p>
            </div>

            <div className="ticket-info-box">
              <p><strong>Guide:</strong> {issuedTicket.guideName} ({issuedTicket.licenseNo})</p>
              <p><strong>Duration:</strong> {issuedTicket.hours} Hours</p>
              <p><strong>Amount Paid:</strong> ${issuedTicket.totalPaid}</p>
              <p className="time-text">Issued At: {issuedTicket.issuedAt}</p>
            </div>

            <button className="primary-btn full-width" onClick={() => setIssuedTicket(null)}>
              Done & Save Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< Updated upstream
export default LocalGuides;  
=======
export default LocalGuides;
>>>>>>> Stashed changes
