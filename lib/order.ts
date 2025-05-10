import prisma from './db';
import { OrderStatus } from '@prisma/client';

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  userId: number
  items: OrderItemInput[]
  total: number
  address: string
  phone: string
}

/**
 * Creates a new order in the database
 */
export async function createOrder(orderData: CreateOrderInput) {
  return prisma.order.create({
    data: {
      userId: orderData.userId,
      total: orderData.total,
      address: orderData.address,
      phone: orderData.phone,
      items: {
        create: orderData.items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    }
  })
}

/**
 * Gets all orders for a specific user
 */
export async function getUserOrders(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

/**
 * Gets all orders (admin only)
 */
export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true
        }
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

/**
 * Updates an order's status
 */
export async function updateOrderStatus(orderId: number, status: string) {
  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    throw new Error('Invalid status');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });
}

/**
 * Gets order details by ID
 */
export async function getOrderById(orderId: number) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          menuItem: true
        }
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  })
}