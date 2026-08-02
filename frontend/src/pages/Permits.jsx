import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { officialPermitsData } from '../data/permitsData';
import { 
  generatePermitCryptoHash, 
  exportPermitToPdf, 
  getStoredPermitsRegistry, 
  savePermitToRegistry 
} from '../utils/permitSecurity';
import '../styles/pages/Permits.css';

const Permits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('foreign');

  // Permit Issue Modal State
  const [selectedSite, setSelectedSite] = useState(null);
  const [passportNumber, setPassportNumber] = useState('');
  const [touristName, setTouristName] = useState('');
  const [isOffPeakSlot, setIsOffPeakSlot] = useState(false);
  const [issuedPermit, setIssuedPermit] = useState(null);

  // Issued Permits Storage State
  const [permitsRegistry, setPermitsRegistry] = useState([]);

  // Load Registry from LocalStorage
  useEffect(() => {
    const registry = getStoredPermitsRegistry();
    setPermitsRegistry(registry);
  }, []);

  // Clear Permit Registry
  const clearPermitsData = () => {
    if (window.confirm("Clear all issued permit records from local storage?")) {
      localStorage.removeItem('yatra_real_issued_permits');
      setPermitsRegistry([]);
      alert("Permits registry reset!");
    }
  };

  // Issue Permit Handler
  const handleIssuePermit = async (e) => {
    e.preventDefault();
    if (!passportNumber || !touristName || !selectedSite) return;

    const basePrice = selectedSite.pricingNPR[selectedNationality];
    const discountMultiplier = isOffPeakSlot ? 0.85 : 1.0;
    const finalPriceNpr = basePrice * discountMultiplier;
    const permitId = `YATRA-${Math.floor(100000 + Math.random() * 900000)}`;

    const signature = await generatePermitCryptoHash({
      permitId,
      passportNumber,
      siteId: selectedSite.id,
      totalPaid: finalPriceNpr.toFixed(0)
    });

    const newPermit = {
      permitId,
      siteTitle: selectedSite.title,
      category: selectedSite.category,
      region: selectedSite.region,
      touristName,
      passportMasked: passportNumber.length > 4 ? `${passportNumber.substring(0, 4)}****` : passportNumber,
      nationalityCategory: selectedNationality === 'foreign' ? 'Foreign National' :
                           selectedNationality === 'saarc' ? 'SAARC National' :
                           selectedNationality === 'chinese' ? 'Chinese National' : 'Nepali Citizen',
      totalPaidNPR: finalPriceNpr.toFixed(0),
      cryptoSignature: signature,
      issuedAt: new Date().toLocaleString(),
    };

    const updated = savePermitToRegistry(newPermit);
    setPermitsRegistry(updated);

    setIssuedPermit(newPermit);
    setSelectedSite(null);
    setPassportNumber('');
    setTouristName('');
  };

  // Filter Logic
  const filteredSites = officialPermitsData.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="permits-page">
      {/* Header Section */}
      <div className="section-header">
        <h1>🏛️ Kathmandu Heritage & Permit Entry Guide</h1>
        <p>Explore World Heritage Sites & Trekking Permits in Nepal. Official Entry Fees & E-Pass Issuance.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <input 
          type="text" 
          className="search-input"
          placeholder="🔍 Search site or permit (e.g. Patan, Bhaktapur, ACAP)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          value={selectedNationality} 
          onChange={(e) => setSelectedNationality(e.target.value)}
          className="lang-select"
        >
          <option value="foreign">🌍 Foreign National Tier</option>
          <option value="saarc">🏛️ SAARC Country Tier</option>
          <option value="chinese">🇨🇳 Chinese Citizen Tier</option>
          <option value="nepali">🇳🇵 Nepali Citizen Tier</option>
        </select>

        {permitsRegistry.length > 0 && (
          <button className="reset-data-btn" onClick={clearPermitsData}>
            🗑️ Reset Passes ({permitsRegistry.length})
          </button>
        )}
      </div>

      {/* Permits Grid - Equalized Heights & Aligned Buttons */}
      <div className="permits-grid">
        {filteredSites.map((site) => (
          <div key={site.id} className="permit-card">
            <div className="card-top">
              <h3 className="card-title">{site.title}</h3>
              <span className={`capacity-badge ${site.currentCapacityPct > 80 ? 'peak' : 'optimal'}`}>
                📊 {site.currentCapacityPct}% Capacity
              </span>
            </div>

            <div className="category-chip">
              <span>Category: <strong>{site.category}</strong></span>
            </div>

            <p className="meta-text">📍 {site.region}</p>
            <p className="site-description">{site.description}</p>
            
            <div className="price-tag">
              💰 Permit Fee: <strong>{site.pricingNPR[selectedNationality] === 0 ? 'Free Entry' : `₹ ${site.pricingNPR[selectedNationality].toLocaleString()} NPR`}</strong>
            </div>

            {/* Warning Box Placeholder for Equal Height Alignment */}
            <div className="alert-slot">
              {site.currentCapacityPct > 80 ? (
                <div className="surge-warning-box">
                  <span>⚠️ Peak Hour Alert! Choose Off-Peak Slot during checkout for <strong>15% Green Discount</strong>!</span>
                </div>
              ) : (
                <div className="surge-placeholder"></div>
              )}
            </div>

            <button 
              className="primary-btn full-width issue-btn"
              onClick={() => setSelectedSite(site)}
            >
              Issue Digital E-Permit
            </button>
          </div>
        ))}
      </div>

      {/* MODAL 1: CHECKOUT FORM */}
      {selectedSite && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal">
            <button className="close-btn" onClick={() => setSelectedSite(null)}>✕</button>
            <h2 className="modal-heading">🎫 Issue Official Digital E-Permit</h2>
            <p className="modal-subheading">{selectedSite.title} ({selectedSite.category})</p>

            <form onSubmit={handleIssuePermit} className="checkout-form">
              <div className="form-group">
                <label className="form-label">Tourist Full Name:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={touristName} 
                  onChange={(e) => setTouristName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passport / National ID Number:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={passportNumber} 
                  onChange={(e) => setPassportNumber(e.target.value)} 
                  placeholder="e.g. N01928374"
                  required 
                />
              </div>

              {selectedSite.currentCapacityPct > 80 && (
                <div className="form-checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={isOffPeakSlot} 
                      onChange={(e) => setIsOffPeakSlot(e.target.checked)} 
                    />
                    🌱 Select Off-Peak Slot (Get 15% Green Tourist Discount!)
                  </label>
                </div>
              )}

              <div className="fare-breakdown">
                <p className="fare-item">
                  <span>Official Permit Price:</span> 
                  <span>₹ {(selectedSite.pricingNPR[selectedNationality] * (isOffPeakSlot ? 0.85 : 1.0)).toFixed(0)} NPR</span>
                </p>
                <hr />
                <p className="total-row">
                  <strong>Total Payable:</strong> 
                  <strong>₹ {(selectedSite.pricingNPR[selectedNationality] * (isOffPeakSlot ? 0.85 : 1.0)).toFixed(0)} NPR</strong>
                </p>
              </div>

              <button type="submit" className="primary-btn full-width pay-btn">
                🔒 Pay & Issue Digital E-Permit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: E-PERMIT CERTIFICATE WITH PDF DOWNLOAD */}
      {issuedPermit && (
        <div className="modal-overlay">
          <div className="modal-content permit-certificate-modal">
            <button className="close-btn" onClick={() => setIssuedPermit(null)}>✕</button>

            <div id="official-permit-cert-element" className="certificate-frame">
              <div className="cert-header">
                <strong>YATRA NEPAL - DIGITAL HERITAGE E-PERMIT</strong>
                <span className="cert-tag">OFFICIAL VERIFIED PASS</span>
              </div>

              <div className="cert-body">
                <p><strong>Permit Reference:</strong> {issuedPermit.permitId}</p>
                <p><strong>Site / Permit Zone:</strong> {issuedPermit.siteTitle}</p>
                <p><strong>Tourist Name:</strong> {issuedPermit.touristName}</p>
                <p><strong>Passport / NID Record:</strong> {issuedPermit.passportMasked}</p>
                <p><strong>Total Royalty Paid:</strong> ₹ {issuedPermit.totalPaidNPR} NPR</p>
                <p><strong>Cryptographic Signature:</strong> <code>{issuedPermit.cryptoSignature}</code></p>
              </div>

              <div className="qr-box">
                <QRCodeCanvas 
                  value={JSON.stringify(issuedPermit)} 
                  size={160}
                  level="H"
                />
                <p className="qr-sub">Scannable at Entry Gates & Mountain Checkposts</p>
              </div>
            </div>

            <div className="cert-actions">
              <button 
                className="secondary-btn full-width"
                onClick={() => exportPermitToPdf('official-permit-cert-element', `${issuedPermit.permitId}_E_Permit.pdf`)}
              >
                📄 Download PDF E-Permit
              </button>
              <button className="primary-btn full-width" onClick={() => setIssuedPermit(null)}>
                Done & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permits;