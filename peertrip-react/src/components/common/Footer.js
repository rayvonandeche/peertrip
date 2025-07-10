import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: "About Peer Trips",
      content: (
        <>
          <p>A premier travel platform connecting adventurers with authentic local experiences and travel buddies.</p>
          <div className="social-icons">
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
          </div>
        </>
      )
    },
    {
      title: "Destinations",
      links: [
        "Maasai Mara",
        "Diani Beach",
        "Mount Kenya",
        "Lamu Island",
        "Amboseli"
      ]
    },
    {
      title: "Travel Services",
      links: [
        "Safari Packages",
        "Beach Holidays",
        "Cultural Tours",
        "Adventure Travel",
        "Group Tours"
      ]
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Travel Insurance",
        "Safety Guidelines",
        "Contact Us",
        "Partner With Us"
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        {footerSections.map((section, index) => (
          <div key={index} className="footer-section">
            <h3>{section.title}</h3>
            {section.content && section.content}
            {section.links && (
              <ul className="footer-links">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Peer Trips Kenya. Crafted by Team Safari Innovators - Making Kenya travel accessible to everyone.</p>
      </div>
    </footer>
  );
};

export default Footer;
