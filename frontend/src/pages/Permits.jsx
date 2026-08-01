import { useState } from "react";
import heritageSites from "../data/heritageSites";
import HeritageCard from "../Components/HeritageCard";
import "../styles/pages/Permits.css";

const Permits = () => {
  const [search, setSearch] = useState("");

  const filteredSites = heritageSites.filter((site) =>
  site.name.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div className="permits-page">
      <div className="permits-header">
        <h1>🏛 Kathmandu Heritage Entry Guide</h1>

        <p>
          Explore UNESCO World Heritage Sites in Kathmandu Valley.
          Check official entry fees, contact information, and visitor
          guidelines before your visit.
        </p>
      </div>

      <input
        type="text"
        className="heritage-search"
        placeholder="🔍 Search heritage site..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="permit-list">
        {filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <HeritageCard key={site.id} site={site} />
          ))
        ) : (
          <p>No heritage site found.</p>
        )}
      </div>
    </div>
  );
};

export default Permits;