# tourism-nepal backend

Prototype Express API to pair with the tourism-nepal React/Vite frontend.

## Structure

```
backend/
├── server.js              # app entry point
├── config/db.js           # mongoose connection (optional, not wired by default)
├── routes/                # route definitions per resource
├── controllers/           # request handlers
├── middleware/             # error handling, etc.
└── data/                  # in-memory sample data (swap for a DB later)
```

## Run it

```
cd backend
npm install
cp .env.example .env
npm run dev
```

Server starts on `http://localhost:5000` by default.

## Endpoints

- `GET  /api/health` — status check
- `GET  /api/destinations` — list destinations
- `GET  /api/destinations/:id` — get one destination
- `POST /api/destinations` — create a destination
- `GET  /api/bookings` — list bookings
- `POST /api/bookings` — create a booking
- `POST /api/auth/register` — register a user
- `POST /api/auth/login` — login (returns a demo token, not a real JWT yet)

## Notes

This is a prototype: data lives in memory and resets on restart, and
auth is not production-safe (no password hashing, no real JWT signing).
`config/db.js` and `mongoose` are included so you can swap the in-memory
`data/destinations.js` for real MongoDB models when you're ready — the
controllers are the only files that would need to change.
