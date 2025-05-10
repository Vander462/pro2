import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../../lib/auth'

export default function Navbar() {
  const router = useRouter()
  const { user, loading, logout } = useUser()
  
  const isActive = (pathname: string) => router.pathname === pathname

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link href="/">
          <a className="navbar-brand">Vander</a>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/">
                <a className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/menu">
                <a className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/order">
                <a className={`nav-link ${isActive('/order') ? 'active' : ''}`}>Order</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact">
                <a className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</a>
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link href="/cart">
                    <a className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
                      Cart ({user.cartCount || 0})
                    </a>
                  </Link>
                </li>
                {user.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link href="/admin">
                      <a className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</a>
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/auth">
                  <a className={`nav-link ${isActive('/auth') ? 'active' : ''}`}>Login</a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}