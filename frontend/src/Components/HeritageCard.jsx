const HeritageCard = ({ site }) => {
  return (
    <div className="heritage-card">
      <h2>{site.name}</h2>

      <div className="fee-section">
        <h4> Entry Fees</h4>

        <p><strong>Foreign:</strong> {site.foreignFee}</p>
        <p><strong>SAARC:</strong> {site.saarcFee}</p>
        <p><strong>Chinese:</strong> {site.chineseFee}</p>
        <p><strong>Nepali:</strong> {site.nepaliFee}</p>
      </div>

      <div className="contact-section">
        <h4> Contact</h4>
        <p>{site.contact || "Not Available"}</p>
      </div>

      <div className="remarks-section">
        <h4>ℹ Remarks</h4>
        <p>{site.remarks || "No additional information."}</p>
      </div>
    </div>
  );
};

export default HeritageCard;