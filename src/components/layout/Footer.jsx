import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <div>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </footer>
  )
}

export default Footer
