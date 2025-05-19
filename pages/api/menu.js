// pages/api/menu.js
import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    // Get menu items from the database
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        category: 'asc'
      }
    })

    res.status(200).json(menuItems)
  } catch (error) {
    console.error('Error fetching menu:', error)
    res.status(500).json({ message: 'Failed to fetch menu items' })
  }
}
