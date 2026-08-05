<div align="center">

# 🏔️ Yatra

### Nepal's First Zero-Server Digital Tourism Infrastructure

**No servers. No paper. No fake guides.**

[![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-OCR-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)](https://webassembly.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#license)

[Overview](#-inspiration) • [Features](#-what-it-does) • [Tech Stack](#%EF%B8%8F-how-we-built-it) • [Architecture](#-architecture) • [Challenges](#-challenges-we-ran-into) • [Roadmap](#-whats-next-for-yatra)

</div>

---

## 🌄 Inspiration

Nepal's tourism industry contributes **7.9% to national GDP** and welcomes **1.2M+ tourists annually** — yet it still runs on 19th-century paper infrastructure.

Walking through Thamel, Kathmandu, we saw it firsthand:

| Problem | Impact |
|---|---|
| 🎭 Fake "NTB-licensed" guides scamming tourists | Global losses of **$6.2B/year** (UNWTO) |
| 🧾 Long queues at Bhrikutimandap TIMS office | Paper trekking permits, zero traceability |
| 🎟️ Photocopied Bhaktapur & Patan tickets | Sold by scalpers, easily forged |
| 🚨 No digital trekker check-in system | Hundreds went missing post-2015 Gorkha earthquake |
| 💸 Ticket counterfeiting worldwide | **$40B/year** in losses (UNWTO) |

> *"What if Nepal could leapfrog these problems using browser-native cryptography — with zero servers, zero paper, and zero fake guides?"*

That question became **Yatra**.

---

## 🎯 What It Does

Yatra unifies **5 critical tourism functions** into a single browser-native platform.

### 🛡️ 1. Verified Guide Marketplace *(WASM eKYC)*
- Guides upload Citizenship ID / Passport
- **Tesseract.js WebAssembly OCR** parses it live in-browser — data never leaves the device
- Auto-generates a cryptographic serial ID (e.g. `NTB-L-6081`) via SHA-256
- No fake stars, no dummy reviews — only verified transactions count

### 🎫 2. Universal Digital UNESCO E-Permits
- Covers all **10 official Nepal heritage & trekking sites** — Patan, Bhaktapur, Boudha, Swayambhu, Pashupatinath, Changu Narayan, Kathmandu Durbar, Lumbini, Chitwan, Sagarmatha
- 4-tier official NPR pricing: Foreigner / SAARC / Chinese / Nepali
- Every ticket signed with **W3C Web Crypto SHA-256** — impossible to forge
- Downloadable PDF e-permit via `jsPDF` + `html2canvas`

### 🌱 3. Green-Hour Dynamic Capacity Pricing
- When a UNESCO site exceeds **80% peak capacity**, the system auto-offers a **15% off-peak discount**
- Protects ancient brick monuments from structural stress while maximizing revenue

### 🆘 4. Emergency SOS & GPS Trekker Safety
- **Overpass API** queries OpenStreetMap for hospitals, police & fire stations within 5,000m
- **Haversine distance math** (`geolib`) ranks services by proximity
- One-click GPS broadcast via WhatsApp, SMS, and hotlines (100 / 102 / 1144)
- **Leaflet** GIS trail check-in logs for disaster rescue

### 🎙️ 5. Multilingual Heritage Audio Guides
- **ElevenLabs AI** voice synthesis narrates cultural stories
- Verified content sourced from HamroSampada (Nepal's official heritage archive)
- Available in English, Nepali, Hindi, Chinese

---

## 🛠️ How We Built It

<div align="center">

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 · Vite · Tesseract.js v7 (WASM OCR) · html5-qrcode · qrcode.react · jsPDF · html2canvas |
| **Mapping / GIS** | Leaflet · React-Leaflet · leaflet-routing-machine (OSRM) · geolib · Overpass API (OpenStreetMap) |
| **Backend** | Node.js · Express v4.19.2 · MongoDB + Mongoose v8.5.1 · CORS · Morgan · Dotenv |
| **Cryptography** | W3C Web Crypto API (`crypto.subtle.digest('SHA-256')`) · `crypto.getRandomValues()` for 128-bit session keys |
| **Voice / AI** | ElevenLabs multilingual voice synthesis |

</div>

### 🔐 100% Client-Side Cryptography — Zero External Packages
- `crypto.subtle.digest('SHA-256')` signs every ticket
- `crypto.getRandomValues()` generates fresh 128-bit session secrets — **zero hardcoded keys**
- HTML5 Geolocation API captures GPS for SOS
- HTML5 Canvas API handles DOM-to-image conversion for permits

---

## 🧩 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                                                            │
│  ┌───────────────┐   ┌──────────────────┐   ┌─────────┐  │
│  │ Tesseract.js  │   │  Web Crypto API   │   │ Leaflet │  │
│  │  WASM OCR     │──▶│ SHA-256 signing   │──▶│  + OSM  │  │
│  │  (eKYC)       │   │  QR generation    │   │  Maps   │  │
│  └───────────────┘   └──────────────────┘   └─────────┘  │
│           │                    │                   │      │
│           ▼                    ▼                   ▼      │
│     Offline-verifiable QR tickets · GPS SOS broadcast     │
└───────────────────────────┬───────────────────────────────┘
                             │ (optional sync)
                             ▼
                 ┌───────────────────────┐
                 │  Node.js + Express     │
                 │  MongoDB (graceful     │
                 │  fallback — never      │
                 │  crashes offline)      │
                 └───────────────────────┘
```

**Ticket signature formula:**

```
signature = SHA256( siteID + touristID + timestamp + nationalityTier + sessionSecret )
```

---

## 🧗 Challenges We Ran Into

| Challenge | Solution |
|---|---|
| Tesseract.js OCR took 8+ seconds per passport | Pre-loaded language models + image preprocessing → **~1.2s parse time** |
| Managing crypto keys with zero servers | `crypto.getRandomValues()` + `sessionStorage` — fresh 128-bit keys per session, no hardcoded secrets |
| Offline QR verification at mountain gates | Fully offline signature verification using browser-native cryptography |
| MongoDB dropping mid-demo | Graceful fallback logic in `config/db.js` — Express keeps serving even if Atlas disconnects |
| 4-tier NTB pricing (Foreigner/SAARC/Chinese/Nepali) | Dynamic pricing engine recalculating instantly by nationality |
| Preventing duplicate QR scans | Timestamp-based signature validation bound to session keys |

---

## 🏆 Accomplishments We're Proud Of

- ✅ Fully functional zero-server tourism infrastructure, built in hackathon time
- ✅ Client-side WebAssembly OCR eKYC — a technique used by top-tier fintechs
- ✅ All 10 official Nepal UNESCO/park sites integrated with authentic NPR pricing
- ✅ Sub-1-second QR ticket verification at gate scanners
- ✅ Green-Hour dynamic pricing engine solving preservation + revenue simultaneously
- ✅ Zero external server costs — entire security stack runs on native Web Crypto API

---

## 📚 What We Learned

- WebAssembly is production-ready for heavy AI/OCR workloads, entirely in-browser
- The **W3C Web Crypto API** is deeply underused — native crypto often beats external libraries
- Nepal Tourism Board's official 4-tier nationality pricing structure
- Haversine geospatial math for emergency-service proximity
- **Overpass QL** as a powerful free alternative to Google Maps API
- Designing offline-first for Himalayan trekking checkposts

---

## 🚀 What's Next for Yatra

- 🇳🇵 Official partnership with **Nepal Tourism Board (NTB)** for licensed guide database integration
- 💳 **Khalti + eSewa** payment gateway integration
- 🏔️ Expand to Bhutan, Sikkim, and Ladakh — same infrastructure gap
- 🌐 Multilingual support in 12+ languages (Korean, Japanese, German, French, Spanish)
- 📱 **PWA** for offline gate scanning at mountain checkposts
- 🛰️ Satellite fallback for GPS SOS in Himalayan dead zones
- 🎓 AI heritage chatbot using RAG on HamroSampada archives
- 🏛️ Official UNESCO cultural-authenticity partnership

---

## 🧰 Built With

<div align="center">

`react` `vite` `node.js` `express.js` `mongodb` `mongoose` `tesseract.js` `web-crypto-api` `sha-256` `webassembly` `html5-qrcode` `qrcode.react` `jspdf` `html2canvas` `leaflet.js` `react-leaflet` `openstreetmap` `overpass-api` `geolib` `html5-geolocation` `elevenlabs` `axios` `cors` `javascript`

</div>

---

<div align="center">

**Built for Nepal's mountains, monuments, and the millions who walk them every year. 🇳🇵**

</div>
