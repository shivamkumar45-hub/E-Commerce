import React from 'react'
import '../componentStyles/Footer.css'
import {Phone,Mail, GitHub, LinkedIn, YouTube, Instagram} from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className="footer-container">
        {/* section1 */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><Phone fontSize='small'/>Phone:+9876456372</p>
          <p><Mail fontSize='small'/>Email:example@example.com</p>
        </div>
        {/* section2 */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-Links">
            <a href="" target='_blank'>
            <GitHub className='social-icon' />
          </a>
          <a href="" target='_blank'>
            <LinkedIn className='social-icon' />
          </a>
          <a href="" target='_blank'>
            <YouTube className='social-icon' />
          </a>
          <a href="" target='_blank'>
            <Instagram className='social-icon' />
          </a>
          </div>
        </div>
        {/* section3 */}
        <div className="footer-section about">
          <h3>About</h3>
          <p>This is the Ecommerce website that provides a wide range of products for all your needs.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Ecommerce Website. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer