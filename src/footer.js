import React from "react";
import "./Footer.css"; // Import your CSS file for styling

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="text-muted">
          <p>
            &copy; {new Date().getFullYear()} by Pratik. All rights reserved.
          </p>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
