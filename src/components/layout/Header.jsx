import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'

function Header() {
  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="StayConnected365" className="logo-image" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/account">Account</Link>
        </div>
      </nav>
    </header>
  )
}

export default Header
