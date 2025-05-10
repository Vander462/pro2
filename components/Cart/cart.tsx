import { useEffect, useState } from 'react'
import { useUser } from '../../lib/auth'

interface CartItem {
  id: number
  menuItem: {
    id: number
    name: string
    price: number
    image?: string
  }
  quantity: number
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    async function fetchCart() {
      try {
        const res = await fetch('/api/cart')
        const data = await res.json()
        setCartItems(data)
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user])

  const removeFromCart = async (itemId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', itemId })
      })

      if (!response.ok) throw new Error('Failed to remove from cart')

      setCartItems(cartItems.filter(item => item.menuItem.id !== itemId))
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert('Failed to remove item from cart')
    }
  }

  const checkout = async () => {
    if (!user) {
      alert('Please login to checkout')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to checkout')

      // Clear cart
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      })

      setCartItems([])
      alert('Order placed successfully!')
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Failed to place order')
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

  if (loading) return <div className="text-center mt-3">Loading cart...</div>

  return (
    <div>
      <h1 className="mb-4">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <a href="/menu" className="btn btn-primary">Browse Menu</a>
        </div>
      ) : (
        <>
          <div className="list-group mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {item.menuItem.image && (
                      <img 
                        src={item.menuItem.image} 
                        alt={item.menuItem.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                      />
                    )}
                    <div>
                      <h5>{item.menuItem.name}</h5>
                      <p>${item.menuItem.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-0">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.menuItem.id)} 
                      className="btn btn-sm btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={checkout} className="btn btn-success">Checkout</button>
          </div>
        </>
      )}
    </div>
  )
}