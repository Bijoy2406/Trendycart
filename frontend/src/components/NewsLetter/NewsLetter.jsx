import React from 'react'
import './NewsLetter.css'

function NewsLetter() {
  return (
    <div className='newsletter'>
        <h1>
            Connected us with your Email
        </h1>
        <p>
            Subscribe with us to stay updated
        </p>
        <div>
            <input type="email" placeholder='Your Email id' />
            <button>Subscribe</button>
        </div>

    </div>
  )
}

export default NewsLetter