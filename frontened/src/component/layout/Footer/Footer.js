import React from 'react'
import './Footer.css'
import playStore from "../../../images/playStore.png"
import appStore from "../../../images/appStore.png"
const Footer = () => {
  return (
    <footer id="footer">
    <div className="leftFooter">
       <h4>DOWNLOAD OUR APP</h4>
       <p>Download App for Android and IOS mobile phone</p>
       <img src={playStore} alt="Playstore"/>
       <img src={appStore} alt="Appstore"/>
    </div>

    <div className="midFooter">
      <h1>ECCOMMERCE.</h1>
      <p>High Quality is our first priority</p>
      <p>Copyrights 2023 &copy; MeDkpandey</p>
    </div>

    <div className="rightFooter">
      <h4>Follow Us</h4>
      <a href='http://instagram.com/meDkPandey'>Instagram</a>
      <a href='http://Youtube.com/meDkPandey'>Youtube</a>
      <a href='http://Facebook.com/meDkPandey'>Facebook</a>
    </div>


    </footer>
  )
}

export default Footer