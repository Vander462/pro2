import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/db'
import { getAuthUser } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getAuthUser(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { menuItem: true }
    })
    return res.json(cartItems)
  }

  if (req.method === 'POST') {
    const { action, itemId, quantity } = req.body

    if (action === 'add') {
      const existingItem = await prisma.cartItem.findFirst({
        where: { userId: user.id, menuItemId: itemId }
      })

      if (existingItem) {
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + (quantity || 1) }
        })
        return res.json(updatedItem)
      } else {
        const newItem = await prisma.cartItem.create({
          data: {
            userId: user.id,
            menuItemId: itemId,
            quantity: quantity || 1
          },
          include: { menuItem: true }
        })
        return res.json(newItem)
      }
    }

    if (action === 'remove') {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id, menuItemId: itemId }
      })
      return res.json({ message: 'Item removed' })
    }

    if (action === 'clear') {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id }
      })
      return res.json({ message: 'Cart cleared' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}