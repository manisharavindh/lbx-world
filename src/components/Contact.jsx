import React from 'react';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <section className="contact-luxury" id="contact">
            <div className="container">
                <div className="contact-header">
                    <span className="sub-header">Inquiries</span>
                    <h2>Contact Us</h2>
                </div>

                <div className="contact-grid">
                    {/* Column 1: The Form */}
                    <div className="contact-form-wrapper">
                        <h3>Send a Message</h3>
                        <form className="luxury-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <label>Your Name</label>
                                <input type="text" placeholder="John Doe" />
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john@example.com" />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input type="tel" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Message</label>
                                <textarea rows="4" placeholder="I'm interested in..."></textarea>
                            </div>

                            <button type="submit" className="luxury-btn">
                                Send Message <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>

                    {/* Column 2: Info & Map */}
                    <div className="contact-details-wrapper">

                        {/* Info Cards */}
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="icon-box"><Phone size={20} /></div>
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+1 (234) 567-8901</p>
                                    <p className="secondary-text">+1 (234) 567-8902</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="icon-box"><Mail size={20} /></div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p>concierge@lbxworld.com</p>
                                    <p className="secondary-text">sales@lbxworld.com</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="icon-box"><MapPin size={20} /></div>
                                <div>
                                    <h4>Visit Showroom</h4>
                                    <p>Coimbatore, Tamil Nadu</p>
                                    <p className="secondary-text">Avinasi Road, CBE - 641012</p>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="map-container">
                            <iframe
                                title="Showroom Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.51346879617!2d76.88483338290504!3d11.013957788108995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1770348948647!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy">
                            </iframe>
                        </div>

                        {/* Socials */}
                        <div className="social-links">
                            <a href="#" className="social-link"><Instagram size={20} /></a>
                            <a href="#" className="social-link"><Twitter size={20} /></a>
                            <a href="#" className="social-link"><Facebook size={20} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
