import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import '../pageStyles/Contact.css'
import { Phone, Mail, Room, Send } from '@mui/icons-material'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Thank you for contacting us! We will get back to you shortly.', { position: 'top-center' })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <PageTitle title="Contact Us" />
      <Navbar />
      <div className="contact-page-wrapper">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-subtitle">We would love to hear from you. Reach out for any queries, support, or feedback.</p>
            <div className="info-item">
              <Phone className="info-icon" />
              <div>
                <h4>Phone</h4>
                <p>+98 7645 6372</p>
              </div>
            </div>
            <div className="info-item">
              <Mail className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>support@eshop.com</p>
              </div>
            </div>
            <div className="info-item">
              <Room className="info-icon" />
              <div>
                <h4>Address</h4>
                <p>123 Commerce St, Suite 100, Tech City</p>
              </div>
            </div>
          </div>
          <div className="contact-form-container">
            <h2>Send Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  required
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="form-group">
                <textarea
                  required
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="contact-btn">
                <span>Send Message</span>
                <Send className="btn-icon" fontSize="small" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact
