const PermitCard = ({ permit }) => {
  return (
    <div className="permit-card">
      <h3>{permit.name}</h3>

      <p><strong>Cost:</strong> {permit.cost}</p>

      <p><strong>Processing:</strong> {permit.processing}</p>

      <p><strong>Office:</strong> {permit.office}</p>

      <p><strong>Documents:</strong></p>

      <ul>
        {permit.documents.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
    </div>
  );
};

export default PermitCard;