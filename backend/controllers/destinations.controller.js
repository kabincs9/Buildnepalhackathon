import { destinations } from '../data/destinations.js'

export function getAllDestinations(req, res) {
  res.json(destinations)
}

export function getDestinationById(req, res) {
  const id = Number(req.params.id)
  const destination = destinations.find((d) => d.id === id)
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' })
  }
  res.json(destination)
}

export function createDestination(req, res) {
  const { name, region, description, tags } = req.body
  if (!name || !region) {
    return res.status(400).json({ error: 'name and region are required' })
  }
  const newDestination = {
    id: destinations.length ? destinations[destinations.length - 1].id + 1 : 1,
    name,
    region,
    description: description || '',
    tags: tags || [],
  }
  destinations.push(newDestination)
  res.status(201).json(newDestination)
}
