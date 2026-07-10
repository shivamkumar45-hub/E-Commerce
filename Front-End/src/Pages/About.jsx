import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import '../pageStyles/About.css'

const About = () => {
  return (
    <>
      <PageTitle title="About Us" />
      <Navbar />
      <div className="about-page-wrapper">
        <div className="about-container">
          <div className="about-header">
            <h1>About eShop</h1>
            <p className="about-subtitle">Bringing you premium quality products right to your doorstep.</p>
          </div>
          
          <div className="about-content">
            <div className="about-section">
              <h2>Our Story</h2>
              <p>
                Founded in 2025, eShop started as a small vision to make online shopping simpler, more reliable, and aesthetically pleasing. Over the years, we have grown into a leading e-commerce platform dedicated to offering curated, high-quality products.
              </p>
            </div>
            
            <div className="about-section">
              <h2>Our Mission</h2>
              <p>
                To provide a seamless, secure, and delightful shopping experience for our customers. We focus on curated selections, robust security, prompt shipping, and unmatched customer service.
              </p>
            </div>

            <div className="about-features">
              <div className="feature-card">
                <h3>High Quality</h3>
                <p>Every single product is verified for quality and durability.</p>
              </div>
              <div className="feature-card">
                <h3>Fast Delivery</h3>
                <p>Reliable logistics partners to deliver your goods securely and fast.</p>
              </div>
              <div className="feature-card">
                <h3>24/7 Support</h3>
                <p>Dedicated customer support team to resolve your queries instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
