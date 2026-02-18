import React from 'react';
import { Check } from 'lucide-react';
import './Experience.css';

const Experience = () => {
    const scrollToServices = () => {
        const element = document.getElementById('services');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <section className="experience section-padding" id="experience">
            <div className="container">
                <div className="experience-wrapper">
                    <div className="exp-content">
                        <span className="subtitle">MASTERFUL CRAFTSMANSHIP</span>
                        <h2>Impeccable Detailing<br />& Custom Wraps</h2>
                        <p className="exp-description">
                            Reimagine your vehicle with our premium customization services. From transformative vinyl wraps to showroom-grade detailing, our specialists ensure your car looks as exceptional as it drives.
                        </p>

                        <ul className="services-list">
                            <li>
                                <div className="check-icon"><Check size={16} /></div>
                                <span>Premium Vinyl Wraps & Color Change</span>
                            </li>
                            <li>
                                <div className="check-icon"><Check size={16} /></div>
                                <span>Paint Protection Film (PPF)</span>
                            </li>
                            <li>
                                <div className="check-icon"><Check size={16} /></div>
                                <span>Ceramic Coating & Paint Correction</span>
                            </li>
                            <li>
                                <div className="check-icon"><Check size={16} /></div>
                                <span>Concours-Level Interior Detailing</span>
                            </li>
                        </ul>

                        <button className="btn-outline" onClick={scrollToServices}>Discover Our Services</button>
                    </div>

                    <div className="exp-image-container">
                        <div className="exp-image glass">
                            <img src="https://teckwrap.ca/cdn/shop/products/725f69118b1ff15e0934cf64c60a0e82_1024x.jpg?v=1677118941" alt="Car Wrapping and Detailing" />
                        </div>
                        <div className="exp-deco"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
