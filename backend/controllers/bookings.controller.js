const bookings = []

export function getAllBookings(req, res) {
  res.json(bookings)
}

export function createBooking(req, res) {
  const { destinationId, name, email, date, travelers } = req.body
  if (!destinationId || !name || !email || !date) {
    return res
      .status(400)
      .json({ error: 'destinationId, name, email, and date are required' })
  }
  const booking = {
    id: bookings.length + 1,
    destinationId,
    name,
    email,
    date,
    travelers: travelers || 1,
    createdAt: new Date().toISOString(),
  }
  bookings.push(booking)
  res.status(201).json(booking)
}
