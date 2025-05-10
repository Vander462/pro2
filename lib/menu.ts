import prisma from './db'

interface MenuItemInput {
  name: string
  description?: string
  price: number
  category: string
  image?: string
}

/**
 * Gets all menu items
 */
export async function getMenuItems() {
  return prisma.menuItem.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

/**
 * Gets a menu item by ID
 */
export async function getMenuItemById(id: number) {
  return prisma.menuItem.findUnique({
    where: { id }
  })
}

/**
 * Creates a new menu item
 */
export async function createMenuItem(menuItemData: MenuItemInput) {
  return prisma.menuItem.create({
    data: menuItemData
  })
}

/**
 * Updates a menu item
 */
export async function updateMenuItem(id: number, updateData: Partial<MenuItemInput>) {
  return prisma.menuItem.update({
    where: { id },
    data: updateData
  })
}

/**
 * Deletes a menu item
 */
export async function deleteMenuItem(id: number) {
  return prisma.menuItem.delete({
    where: { id }
  })
}

/**
 * Gets menu items by category
 */
export async function getMenuItemsByCategory(category: string) {
  return prisma.menuItem.findMany({
    where: { category },
    orderBy: {
      name: 'asc'
    }
  })
}

/**
 * Gets all unique categories
 */
export async function getMenuCategories() {
  const items = await prisma.menuItem.findMany({
    select: {
      category: true
    },
    distinct: ['category']
  })
  
  return items.map(item => item.category)
}