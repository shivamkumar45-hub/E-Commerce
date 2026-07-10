import React from 'react'
import '../componentStyles/NoProducts.css'

const NoProducts = ({keyword}) => {
  return (
    <div className="no-products-content">
      <div className="no-products-icon">⚠️</div>
        <h3 className="no-products-title">No Product Found</h3>
        <p className="no-products-message">
          {keyword?`we couldn't find any product matching "${keyword}". try using different keyword or browse our complete catalog`:'no product are completely availabe'}
        </p>
    </div>
  )
}

export default NoProducts