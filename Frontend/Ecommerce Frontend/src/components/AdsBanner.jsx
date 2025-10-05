import React, { useEffect, useState } from "react";
import "./AdsBanner.css";

function AdsBanner() {
  useEffect(() => {
  // Determine the correct base URL first
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Now, make the fetch call using the correct URL
  fetch(`${apiUrl}/api/ads`)
    .then((res) => res.json())
    .then(setAds)
    .catch((err) => console.error("Failed to fetch ads:", err));
}, []);

  return (
    <div className="ads-container">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.redirectUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className="ad-card"
        >
          <img src={ad.imageUrl} alt={ad.title} width="300" />
          <p>{ad.title}</p>
        </a>
      ))}
    </div>
  );
}

export default AdsBanner;
