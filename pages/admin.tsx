import { useState, useEffect } from 'react'
import Layout from '../components/Layouts/Layouts'
import { useUser } from '../lib/auth'
import { getAllOrders, updateOrderStatus } from '../lib/order'
import { getMenuItems, createMenuItem, deleteMenuItem } from '../lib/menu'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'main',
    image: ''
  })
  const { user } = useUser()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return

    const fetchData = async () => {
      try {
        if (activeTab === 'orders') {
          const data = await getAllOrders()
          setOrders(data)
        } else {
          const data = await getMenuItems()
          setMenuItems(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab, user])

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleAddItem = async () => {
    try {
      const createdItem = await createMenuItem(newItem)
      setMenuItems([...menuItems, createdItem])
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: 'main',
        image: ''
      })
    } catch (error) {
      console.error('Error adding menu item:', error)
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteMenuItem(id)
      setMenuItems(menuItems.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout title="Admin Dashboard">
        <div className="container mt-5 pt-5 text-center">
          <h1>Unauthorized Access</h1>
          <p>You must be an admin to view this page.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-4">Admin Dashboard</h1>
        
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu Management
            </button>
          </li>
        </ul>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : activeTab === 'orders' ? (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user.name || order.user.email}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      >
                        {['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'].map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-info">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="mb-3">Add New Menu Item</h3>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={handleAddItem}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.category}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}