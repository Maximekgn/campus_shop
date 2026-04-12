import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} CampusShop - La plateforme d'échange entre étudiants.</p>
      </div>
    </footer>
  );
};

export default Footer;
