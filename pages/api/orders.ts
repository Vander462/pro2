import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/db'
import { getAuthUser } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getAuthUser(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return res.json(orders)
  }

  if (req.method === 'POST') {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { menuItem: true }
    })

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const total = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        address: '123 Main St', // Should come from user profile or form
        phone: '555-1234', // Should come from user profile or form
        items: {
          create: cartItems.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.menuItem.price
          }))
        }
      }
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    })

    return res.json(order)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}