import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Phone, Mail, Calendar, Gauge, Fuel, MapPin, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCarContext } from '../context/CarContext';
import './CarDetailsPage.css';

const CarDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allCars } = useCarContext();

    // Find the car
    const car = allCars.find(c => c.id === parseInt(id));
    const [currentImage, setCurrentImage] = React.useState(null);

    // Handle car not found
    useEffect(() => {
        if (!car) {
            navigate('/inventory');
        } else {
            setCurrentImage(car.image);
        }
    }, [car, navigate]);

    if (!car) return null;

    // Use images array or fallback to single image if array doesn't exist (backward compatibility)
    const galleryImages = car.images || [car.image];

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="container car-details-page">
                {/* Breadcrumb / Back */}
                <button onClick={() => navigate(-1)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#999',
                    marginBottom: '2rem',
                    fontSize: '0.9rem'
                }}>
                    <ArrowLeft size={16} /> Back to Inventory
                </button>

                <div className="details-grid">

                    {/* Main Content (Left) */}
                    <div className="details-main">
                        <div className="car-header">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {car.year} {car.brand} {car.model}
                            </motion.h1>
                            <div className="car-sub-header">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={16} /> {car.reg === 'Unregistered' ? 'Showroom' : car.reg}
                                </span>
                                <span>•</span>
                                <span>Stock #{1000 + car.id}</span>
                            </div>
                        </div>

                        <div className="gallery-section">
                            <div className="car-hero-image-container">
                                <motion.img
                                    key={currentImage}
                                    src={currentImage}
                                    alt={car.model}
                                    className="car-hero-image"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            <div className="thumbnails-row">
                                {galleryImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail-container ${currentImage === img ? 'active' : ''}`}
                                        onClick={() => setCurrentImage(img)}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Specifications Grid */}
                        <div className="specs-section">
                            <h3 className="section-title">
                                Vehicle Specifications
                            </h3>
                            <div className="specs-grid-large">
                                <div className="spec-box">
                                    <span className="spec-label">Mileage</span>
                                    <span className="spec-value">{car.mileage.toLocaleString()} mi</span>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-label">Fuel Type</span>
                                    <span className="spec-value">{car.fuel}</span>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-label">Transmission</span>
                                    <span className="spec-value">Automatic</span>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-label">Drive</span>
                                    <span className="spec-value">AWD / RWD</span>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-label">Exterior Color</span>
                                    <span className="spec-value">Factory Spec</span>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-label">Interior</span>
                                    <span className="spec-value">Premium Leather</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className='specs-section'>
                            <h3 className="section-title">Vehicle Overview</h3>
                            <div className="description-section">
                                <p>{car.description}</p>
                                {/* <p style={{ marginTop: '1rem' }}>
                                    This {car.year} {car.brand} {car.model} represents the pinnacle of automotive engineering.
                                    Meticulously maintained and presented in showroom condition, it offers an unparalleled driving experience.
                                    Featuring a comprehensive suite of luxury options and performance enhancements using the latest technology.
                                </p> */}
                            </div>
                        </div>

                        {/* Features List (Mocked) */}
                        <div className='specs-section'>
                            <h3 className="section-title">Key Features</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                {[
                                    'Premium Sound System', 'Adaptive Cruise Control', 'Heated & Ventilated Seats',
                                    '360 Degree Camera', 'Carbon Fiber Trim', 'Sport Exhaust',
                                    'Apple CarPlay / Android Auto', 'Active Suspension'
                                ].map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '50%' }}>
                                            <Check size={14} color="#fff" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="details-sidebar">
                        <div className="price-card">
                            <div className="price-label">Offered At</div>
                            <div className="price-amount">${car.price.toLocaleString()}</div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '10px', color: '#bbb', fontSize: '0.9rem' }}>
                                    <Shield size={18} /> Verified Dealer
                                </div>
                                <div style={{ display: 'flex', gap: '10px', color: '#bbb', fontSize: '0.9rem' }}>
                                    <Check size={18} /> Inspection Passed
                                </div>
                            </div>

                            <div className="inquiry-form">
                                <div className="form-group">
                                    <input type="text" placeholder="Your Name" />
                                </div>
                                <div className="form-group">
                                    <input type="email" placeholder="Your Email" />
                                </div>
                                <div className="form-group">
                                    <input type="tel" placeholder="Phone Number" />
                                </div>
                                <div className="form-group">
                                    <textarea placeholder="I am interested in this vehicle..."></textarea>
                                </div>
                                <button className="contact-button">
                                    Send Inquiry <Mail size={18} style={{ display: 'inline', marginLeft: '8px', verticalAlign: 'middle' }} />
                                </button>
                                <button className="call-button">
                                    <Phone size={18} /> (555) 123-4567
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CarDetailsPage;
