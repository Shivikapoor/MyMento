import React from "react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand-block">
          <div className="footer-logo brand-inline brand-footer">
            <img src="/images/Logo.png" alt="MyMento logo" className="brand-logo brand-logo-footer" />
            <span>MYMENTO</span>
          </div>
          <p className="footer-lead">
            Calm support for busy minds through breathing, grounding, journaling,
            sleep help, and steady daily reset routines.
          </p>
          <div className="footer-trust-row">
            <span>Daily check-ins</span>
            <span>Gentle guided tools</span>
            <span>Private reflection space</span>
          </div>
        </div>

        <div className="footer-links-block">
          <h3>Helpful Spaces</h3>
          <ul className="footer-link-list">
            <li>2-Minute Breathing Calm</li>
            <li>Grounding for Anxiety</li>
            <li>Empty Your Mind Journal</li>
            <li>Sleep Reset Support</li>
          </ul>
        </div>

        <div className="footer-support-block">
          <h3>Need Support?</h3>
          <p>Start small: breathe, pause, write it out, then take the next kind step.</p>
          <a href="mailto:email@mymento.com">email@mymento.com</a>
          <p>Mon-Sat | 9:00 AM - 7:00 PM</p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>Made for calmer workdays and clearer nights.</span>
        <span>MyMento Wellness Companion</span>
      </div>
    </footer>
  );
};

export default Footer;
