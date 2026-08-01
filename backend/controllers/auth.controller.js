const users = []

// NOTE: prototype only — passwords are stored in plain text here.
// Before real use, hash with bcrypt and issue real JWTs.

export function register(req, res) {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' })
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' })
  }
  const user = { id: users.length + 1, name, email, password }
  users.push(user)
  res.status(201).json({ id: user.id, name: user.name, email: user.email })
}

export function login(req, res) {
  const { email, password } = req.body
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  res.json({ id: user.id, name: user.name, email: user.email, token: 'demo-token' })
}
