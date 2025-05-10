import { useEffect, useState } from 'react'
import Layout from '../components/Layouts/Layouts'
import { useUser } from '../lib/auth'
import { getUserOrders } from '../lib/order'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(user.id)
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <Layout title="Order History">
        <div className="container mt-5 pt-5 text-center">
          <h1>Please login to view your order history</h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Order History">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-4">Your Order History</h1>
        
        {loading ? (
          <div className="text-center">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center">
            <p>You haven't placed any orders yet.</p>
            <a href="/menu" className="btn btn-primary">Browse Menu</a>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <ul className="list-unstyled">
                        {order.items.map((item: any) => (
                          <li key={item.id}>
                            {item.quantity}x {item.menuItem.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'DELIVERED' ? 'bg-success' :
                        order.status === 'CANCELLED' ? 'bg-danger' :
                        'bg-warning text-dark'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}