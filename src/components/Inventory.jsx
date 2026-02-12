import React, { useRef, useState } from 'react';

import { Gauge, Fuel, Calendar, ArrowRight, ArrowLeft, Mail, Phone, Copy, Check, X } from 'lucide-react';
import { useCarContext } from '../context/CarContext';
import './Inventory.css';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { recentCars } = useCarContext();
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);

    // Contact Modals State
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleEmailClick = (e, car) => {
        e.stopPropagation();
        setSelectedCar(car);
        setEmailModalOpen(true);
    };

    const handlePhoneClick = (e, car) => {
        e.stopPropagation();
        setSelectedCar(car);
        setPhoneModalOpen(true);
    };

    const confirmEmailAction = () => {
        if (!selectedCar) return;
        window.location.href = `mailto:info@lbxworld.com?subject=Inquiry: ${selectedCar.year} ${selectedCar.brand} ${selectedCar.model}`;
        setEmailModalOpen(false);
    };

    const copyPhoneNumber = () => {
        navigator.clipboard.writeText('+44 7777 777 777');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stopAutoScroll = () => {
        setIsAutoScrollActive(false);
    };


    const scroll = (direction) => {
        stopAutoScroll();
        const { current } = scrollRef;
        if (current) {
            const isMobile = window.innerWidth <= 768;
            const cardWidth = isMobile ? 300 : 350;
            const scrollAmount = cardWidth + 30; // Card width + gap
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };


    // Auto-scroll on mobile
    React.useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile || !isAutoScrollActive) return;

        const interval = setInterval(() => {

            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const cardWidth = 300; // Mobile card width
                const scrollAmount = cardWidth + 30;


                // Check if we've reached the end
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 5000); // 5 seconds delay

        return () => clearInterval(interval);
    }, [isAutoScrollActive]);




    return (
        <section className="inventory section-padding" id="inventory">
            <div className="container">
                <div className="inventory-header">
                    <h2>Recently Parked</h2>
                    <div className="line-dec"></div>
                    <div className="inventory-controls">
                        <button className="nav-btn" onClick={() => scroll('left')}><ArrowLeft size={20} /></button>
                        <button className="nav-btn" onClick={() => scroll('right')}><ArrowRight size={20} /></button>
                        <button className="btn-primary" onClick={() => navigate('/inventory')}>All Collection</button>
                    </div>
                </div>

                <div
                    className="inventory-carousel"
                    ref={scrollRef}
                    onTouchStart={stopAutoScroll}
                    onMouseDown={stopAutoScroll}
                    onWheel={stopAutoScroll}
                >

                    {recentCars.map((car) => (
                        <div
                            key={car.id}
                            className="car-card glass carousel-item"
                            onClick={() => navigate(`/inventory/${car.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-badge">
                                {car.year} • {car.brand}
                            </div>

                            <div className="img-wrapper">
                                <img src={car.image} alt={car.model} draggable="false" />
                                <div className="hover-shine"></div>
                            </div>

                            <div className="card-content">
                                <h3>{car.model}</h3>
                                <div className="price-tag">${car.price.toLocaleString()}</div>

                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <Gauge size={16} />
                                        <div>
                                            <span className="label">Mileage</span>
                                            <span className="value">{car.mileage.toLocaleString()} mi</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <Fuel size={16} />
                                        <div>
                                            <span className="label">Fuel</span>
                                            <span className="value">{car.fuel}</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <Calendar size={16} />
                                        <div>
                                            <span className="label">Reg</span>
                                            <span className="value">{car.reg}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button
                                        className="action-btn email"
                                        onClick={(e) => handleEmailClick(e, car)}
                                    >
                                        <Mail size={16} />
                                        <span>Email</span>
                                    </button>
                                    <button
                                        className="action-btn phone"
                                        onClick={(e) => handlePhoneClick(e, car)}
                                    >
                                        <Phone size={16} />
                                        <span>Call</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Email Confirmation Modal */}
            {emailModalOpen && (
                <div className="modal-overlay" onClick={() => setEmailModalOpen(false)}>
                    <div className="modal-content-small" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Inquiry</h3>
                            <button className="close-modal-btn" onClick={() => setEmailModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                Are you sure you want to open your email client to inquire about the <strong>{selectedCar?.year} {selectedCar?.brand} {selectedCar?.model}</strong>?
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-outline" onClick={() => setEmailModalOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={confirmEmailAction}>Open Email</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Modal */}
            {phoneModalOpen && (
                <div className="modal-overlay" onClick={() => setPhoneModalOpen(false)}>
                    <div className="modal-content-small" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Contact Us</h3>
                            <button className="close-modal-btn" onClick={() => setPhoneModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Call us directly or copy the number below.
                            </p>
                            <div className="phone-display-box">
                                <span className="phone-number">+44 7777 777 777</span>
                                <button className="copy-btn" onClick={copyPhoneNumber}>
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                            <div className="mobile-only-action">
                                <a href="tel:+447777777777" className="btn-primary full-width-btn">
                                    <Phone size={16} /> Call Now
                                </a>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-outline full-width-btn" onClick={() => setPhoneModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Inventory;
