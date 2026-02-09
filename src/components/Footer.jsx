import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <h3>LBX World</h3>
                        <p>Luxury is not just about what you own—it's about how it makes you feel. We exist to redefine that feeling.</p>
                    </div>

                    <div className="footer-links-group">
                        <div className="footer-column">
                            <h4>Website</h4>
                            <a href="#home">Home</a>
                            <a href="#services">Our services</a>
                            <a href="#about">About us</a>
                            <a href="#why">Why us?</a>
                        </div>

                        <div className="footer-column">
                            <h4>Contact</h4>
                            <a href="#">Get a quote</a>
                            <a href="#">Contact form</a>
                            <a href="#">Email us</a>
                        </div>

                        <div className="footer-column">
                            <h4>Social Media</h4>
                            <a href="#">Facebook</a>
                            <a href="#">Instagram</a>
                            <a href="#">Twitter</a>
                            <a href="#">Youtube</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>LBX World © 2026</span>
                    <div className="legal-links">
                        <a href="#">Cookie policy</a>
                        <a href="#">Terms of service</a>
                        <a href="#">Privacy policy</a>
                        <a href="/admin-dashboard">Admin</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
