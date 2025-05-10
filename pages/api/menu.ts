import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/db'
import { getAuthUser } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const menuItems = await prisma.menuItem.findMany()
    return res.json(menuItems)
  }

  const user = await getAuthUser(req)
  if (!user || user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { name, description, price, category, image } = req.body
    const menuItem = await prisma.menuItem.create({
      data: { name, description, price, category, image }
    })
    return res.json(menuItem)
  }

  if (req.method === 'PUT') {
    const { id, ...data } = req.body
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data
    })
    return res.json(menuItem)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await prisma.menuItem.delete({ where: { id } })
    return res.json({ message: 'Menu item deleted' })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}