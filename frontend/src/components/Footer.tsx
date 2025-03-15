import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="text-center">
        <div className="footer-brand">
          TripSync
        </div>
        <div className="footer-text">
          © 2025 TripSync. Connect. Share. Explore.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;