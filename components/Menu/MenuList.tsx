import { useEffect, useState } from 'react'
import { useUser } from '../../lib/auth'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image?: string
}

export default function MenuList() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu')
        const data = await res.json()
        setMenuItems(data)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const addToCart = async (itemId: number) => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', itemId })
      })

      if (!response.ok) throw new Error('Failed to add to cart')

      alert('Item added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart')
    }
  }

  if (loading) return <div className="text-center">Loading menu...</div>

  return (
    <div className="row">
      {menuItems.map(item => (
        <div key={item.id} className="col-md-4 mb-4">
          <div className="card h-100">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <h3 className="card-title">{item.name}</h3>
              <p className="card-text">{item.description}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              <button 
                onClick={() => addToCart(item.id)} 
                className="btn btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}