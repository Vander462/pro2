import { useEffect, useState } from 'react'
import { useUser } from '../../lib/auth'

interface MenuItem {
  id: number
  name: string
  price: number
}

export default function Order() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const { user } = useUser()

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu')
        const data = await res.json()
        setMenuItems(data)
        // Initialize quantities with 0
        const initialQuantities = data.reduce((acc: Record<number, number>, item: MenuItem) => {
          acc[item.id] = 0
          return acc
        }, {})
        setQuantities(initialQuantities)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const handleQuantityChange = (itemId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, value)
    }))
  }

  const placeOrder = async () => {
    if (!user) {
      alert('Please login to place an order')
      return
    }

    const itemsToOrder = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ itemId: Number(id), quantity: qty }))

    if (itemsToOrder.length === 0) {
      alert('Please select at least one item to order')
      return
    }

    try {
      // Add items to cart
      await Promise.all(
        itemsToOrder.map(item => 
          fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', itemId: item.itemId, quantity: item.quantity })
          })
        )
      )

      // Proceed to checkout
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to place order')

      alert('Order placed successfully!')
      // Reset quantities
      setQuantities(prev => {
        const reset = {...prev}
        Object.keys(reset).forEach(key => {
          reset[Number(key)] = 0
        })
        return reset
      })
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    }
  }

  if (loading) return <div className="text-center">Loading menu...</div>

  return (
    <div>
      <h1 className="text-center mb-4">Order Online</h1>
      
      <div className="card">
        <div className="card-body">
          <h3 className="mb-3">Select Items</h3>
          
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={quantities[item.id] || 0}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td>${(item.price * (quantities[item.id] || 0)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>
              Total: $
              {menuItems.reduce(
                (sum, item) => sum + (item.price * (quantities[item.id] || 0)),
                0
              ).toFixed(2)}
            </h4>
            <button 
              onClick={placeOrder} 
              className="btn btn-primary btn-lg"
              disabled={!user}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}