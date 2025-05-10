import { useEffect, useState } from 'react';
import Layout from '../components/Layouts/Layouts';
import { useCart } from '../context/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, cartCount, removeFromCart, checkout } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) setLoading(false);
  }, [session]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!session) {
    return (
      <Layout title="Cart">
        <div className="container mt-5 pt-5 text-center">
          <h1>Please login to view your cart</h1>
        </div>
      </Layout>
    );
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Layout title="Your Cart">
      <div className="container mt-5 pt-5">
        <h1 className="mb-4">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty</p>
            <Link href="/menu" legacyBehavior>
            <a className="btn btn-primary">Browse Menu</a>
            </Link>

          </div>
        ) : (
          <>
            <div className="list-group mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '15px'
                          }}
                        />
                      )}
                      <div>
                        <h5>{item.productName}</h5>
                        <p>
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
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
              <button onClick={checkout} className="btn btn-success">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
