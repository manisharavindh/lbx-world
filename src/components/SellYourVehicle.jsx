import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import './SellYourVehicle.css';

const SellYourVehicle = () => {

    const scrollToContact = () => {
        const element = document.getElementById('contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="sell-vehicle-section" id="sell-vehicle">
            <div className="container">
                <div className="sell-content-wrapper">

                    {/* Left Content */}
                    <div className="sell-text-content">
                        <span className="badge-sell">Premium Consignment Service</span>
                        <h2>Sell Your Exotic<br />With Confidence.</h2>
                        <p>Let us handle the entire sale process for you. We leverage our global network of qualified buyers and handle all marketing, negotiations, and logistics to ensure you receive the maximum value for your asset.</p>

                        <ul className="sell-features">
                            <li><span className='check-icon'><TrendingUp size={16} /></span> access to Global Buyer Network</li>
                            <li><span className='check-icon'><ShieldCheck size={16} /></span> Secure & Private Transactions</li>
                            <li><span className='check-icon'><Zap size={16} /></span> Professional Marketing Suite</li>
                        </ul>

                        <button className="sell-cta-btn" onClick={scrollToContact}>
                            Submit Your Vehicle <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Right Content - Unique Element */}
                    <div className="sell-visual-content">
                        {/* Main Scanner Card */}
                        <div className="market-scanner-card glass-card">
                            <div className="scanner-header">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="dot live"></span>
                                    <span>Market Pulse</span>
                                </div>
                                <span className="scan-id">ID: #8X-92</span>
                            </div>

                            <div className="scanner-body">
                                <div className="car-wireframe">
                                    <img src="/assets/supercar_wireframe.png" alt="Supercar Wireframe" className="car-wireframe-img" />
                                    <div className="scan-overlay"></div>
                                </div>

                                <div className="scanner-stats">
                                    <div className="stat-item">
                                        <span className="label">Demand</span>
                                        <div className="bar-container">
                                            <div className="bar-fill" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="label">Trend</span>
                                        <span className="value up">+12.4%</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="label">Est. Time</span>
                                        <span className="value">48 Hrs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements for depth */}
                        <div className="floating-tag tag-1">
                            <BarChart2 size={16} color="#fff" />
                            <div>
                                <span style={{ display: 'block', fontSize: '10px', color: '#666' }}>Recent Sale</span>
                                <span className="price">Ferrari 488: $245k</span>
                            </div>
                        </div>
                        <div className="floating-tag tag-2">
                            <BarChart2 size={16} color="#fff" />
                            <div>
                                <span style={{ display: 'block', fontSize: '10px', color: '#666' }}>Recent Sale</span>
                                <span className="price">GT3 RS: $310k</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SellYourVehicle;
