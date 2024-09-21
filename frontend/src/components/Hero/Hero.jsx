import React from 'react';
import { Link } from 'react-scroll';
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
      <span className="hero-title">NEW ARRIVALS ONLY</span>
      <div>
          <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <Link
          to="new-collections"
          smooth={true}
          offset={-70}
          duration={500}
          className="hero-latest-btn"
        >
          <div>Latest Collection</div>
          <img src={arrow_icon} alt="" />
        </Link>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero;
