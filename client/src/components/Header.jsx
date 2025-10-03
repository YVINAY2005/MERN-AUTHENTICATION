import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import './Header.css'

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <header className="header">
      <div className="header-container">
        
        {/* Left Side - Text */}
        <div className="header-content">
          <h1>
            Hey {userData ? userData.name : 'Developer'}!{" "}
            <span className="wave">
              <img src={assets.hand_wave} alt="👋" />
            </span>
          </h1>
          <h2>Welcome to our app</h2>
          <p>
            Let's start with a quick product tour and we’ll have you up and running in no time!
          </p>
          <button className="cta-btn">Get Started</button>
        </div>

        {/* Right Side - Image */}
        <div className="header-image">
          <img src={assets.header_img} alt="header" />
        </div>
      </div>
    </header>
  )
}

export default Header
