// src/components/Footer.jsx
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Yatra Nepal</h4>
            <p>Namaste! Discover the living heritages of Nepal. From ancient temples to majestic mountains, we connect you with the cultural soul of the Himalayas.</p>
            <div className="footer-contact">
              <p>📧 info@yatranepal.com</p>
              <p>📞 +977 1 1234567</p>
              <p>📍 Kathmandu, Nepal</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Heritage Sites</h4>
            <a href="/patan-durbar-square">Patan Durbar Square</a>
            <a href="/swayambhunath">Swayambhunath Stupa</a>
            <a href="/bhaktapur-durbar-square">Bhaktapur Durbar Square</a>
            <a href="/pashupatinath">Pashupatinath Temple</a>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/destinations">All Destinations</a>
            <a href="/tours">Heritage Tours</a>
            <a href="/guides">Local Guides</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">YouTube</a>
            </div>
            <div className="footer-safety">
              <p>🆘 Emergency Support</p>
              <p>🏥 24/7 Travel Assistance</p>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-text">Made with ❤️ for Nepal</p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Yatra Nepal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
