import React from 'react'
import './Descriptionbox.css'

const Descriptionbox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">
          Description
        </div>
        <div className="descriptionbox-nav-box fade">
          Reviews(122)
        </div>

      </div>
      <div className="descriptionbox-description">
        <p>
          Website and shop
        </p>
        <p>
          Information
        </p>
      </div>
    </div>
  )
}

export default Descriptionbox