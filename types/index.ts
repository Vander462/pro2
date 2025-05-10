// User types
export interface User {
    id: number
    email: string
    name?: string
    role: 'ADMIN' | 'CUSTOMER'
    createdAt: Date
    updatedAt: Date
  }
  
  // Menu item types
  export interface MenuItem {
    id: number
    name: string
    description?: string
    price: number
    category: string
    image?: string
    createdAt: Date
    updatedAt: Date
  }
  
  // Cart item types
  export interface CartItem {
    id: number
    userId: number
    menuItemId: number
    quantity: number
    menuItem: MenuItem
  }
  
  // Order types
  export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'
  
  export interface OrderItem {
    id: number
    orderId: number
    menuItemId: number
    quantity: number
    price: number
    menuItem: MenuItem
  }
  
  export interface Order {
    id: number
    userId: number
    total: number
    status: OrderStatus
    address: string
    phone: string
    createdAt: Date
    updatedAt: Date
    items: OrderItem[]
    user: Pick<User, 'id' | 'email' | 'name'>
  }
  
  // API response types
  export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
  }
  
  // Auth types
  export interface AuthPayload {
    id: number
    email: string
    role: 'ADMIN' | 'CUSTOMER'
  }
  
  // Form types
  export interface LoginFormData {
    email: string
    password: string
  }
  
  export interface RegisterFormData extends LoginFormData {
    name: string
  }
  
  // Component props
  export interface LayoutProps {
    children: React.ReactNode
    title?: string
  }
  
  export interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'ADMIN' | 'CUSTOMER'
  }