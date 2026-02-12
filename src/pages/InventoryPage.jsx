import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCarContext } from '../context/CarContext';
import { Search, Filter, ArrowRight, Gauge, Fuel, Calendar, Phone, Mail, Copy, Check, X, RotateCcw } from 'lucide-react';

import './InventoryPage.css';

const InventoryPage = () => {
    const { allCars } = useCarContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialBrand = searchParams.get('brand') || '';
    const initialSearch = searchParams.get('search') || '';



    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedBrand, setSelectedBrand] = useState(initialBrand.toUpperCase());
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [vehicleType, setVehicleType] = useState('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

    useEffect(() => {
        if (initialBrand) {
            setSelectedBrand(initialBrand.toUpperCase());
        }
        if (initialSearch) {
            setSearchTerm(initialSearch);
        }
    }, [initialBrand, initialSearch]);

    // Helper to determine vehicle type
    const getCarType = (car) => {
        const motorcycleBrands = ['DUCATI ', 'HONDA', 'KAWASIKI'];
        if (motorcycleBrands.includes(car.brand)) return 'motorcycle';
        if (car.brand === 'BMW' && car.model === 'HP4') return 'motorcycle';
        return 'car';
    };

    const uniqueBrands = ['ALL', ...new Set(allCars.filter(car => {
        if (vehicleType === 'all') return true;
        return getCarType(car) === vehicleType;
    }).map(car => car.brand))];

    // Filter Logic
    const filteredCars = allCars.filter(car => {
        const type = getCarType(car);
        const query = searchTerm.toLowerCase();

        const matchesType = vehicleType === 'all' || type === vehicleType;
        const matchesSearch = !searchTerm.trim() ||
            car.brand.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.year.toString().includes(query) ||
            car.price.toString().includes(query);
        const matchesBrand = selectedBrand === 'ALL' || !selectedBrand || car.brand === selectedBrand;

        // Price filter logic
        let matchesPrice = true;
        if (priceRange === 'low') matchesPrice = parseFloat(car.price) < 200000;
        if (priceRange === 'mid') matchesPrice = parseFloat(car.price) >= 200000 && parseFloat(car.price) < 500000;
        if (priceRange === 'high') matchesPrice = parseFloat(car.price) >= 500000;

        return matchesType && matchesSearch && matchesBrand && matchesPrice;
    }).sort((a, b) => {
        if (sortBy === 'lowest') return a.price - b.price;
        if (sortBy === 'highest') return b.price - a.price;
        if (sortBy === 'newest') return b.year - a.year; // Assuming year is number
        if (sortBy === 'oldest') return a.year - b.year;
        return 0;
    });

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="inventory-page-header">
                <div className="container">
                    <h1>The Collection</h1>
                </div>

                <div className="search-filter-section">

                    {/* Main Controls Bar */}
                    {/* <div className="main-controls-bar"> */}
                    <div className="search-group">
                        <div className="search-input-wrapper-inventory">
                            <Search size={20} className="search-icon-inventory" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input-inventory"
                            />
                        </div>
                    </div>

                    <div className="controls-right">
                        {/* Sort By - Always Visible */}
                        <div className="custom-select-wrapper sort-wrapper">
                            <select
                                className="custom-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="lowest">Price: Low to High</option>
                                <option value="highest">Price: High to Low</option>
                            </select>
                            {/* <div className="custom-select-arrow">▼</div> */}
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            className={`filter-toggle-btn ${isFilterModalOpen ? 'active' : ''}`}
                            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                        >
                            <span>Filters</span>
                            <Filter size={18} style={{ color: '#9DA2AF' }} />
                        </button>

                        <div className="results-count-display">
                            Showing {filteredCars.length} of {allCars.length}
                        </div>
                    </div>
                </div>

                {/* Filter Modal / Expandable Section */}
                {isFilterModalOpen && (
                    <div className="filter-modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
                        <div className="filter-modal glass" onClick={e => e.stopPropagation()}>
                            <div className="filter-modal-header">
                                <h3>Filters</h3>
                                <button className="close-modal-btn" onClick={() => setIsFilterModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="filter-modal-content">
                                {/* Type Filter */}
                                <div className="filter-group-vertical">
                                    <span className="filter-label">Vehicle Type</span>
                                    <div className="custom-select-wrapper">
                                        <select
                                            className="custom-select"
                                            value={vehicleType}
                                            onChange={(e) => {
                                                setVehicleType(e.target.value);
                                                setSelectedBrand('ALL');
                                            }}
                                        >
                                            <option value="all">All Vehicles</option>
                                            <option value="car">Cars</option>
                                            <option value="motorcycle">Motorcycles</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Make Filter */}
                                <div className="filter-group-vertical">
                                    <span className="filter-label">Make</span>
                                    <div className="custom-select-wrapper">
                                        <select
                                            className="custom-select"
                                            value={selectedBrand}
                                            onChange={(e) => setSelectedBrand(e.target.value)}
                                        >
                                            {uniqueBrands.map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="filter-group-vertical">
                                    <span className="filter-label">Price Range</span>
                                    <div className="price-filters-grid">
                                        <button
                                            className={`filter-btn ${priceRange === 'all' ? 'active' : ''}`}
                                            onClick={() => setPriceRange('all')}
                                        >
                                            All Prices
                                        </button>
                                        <button
                                            className={`filter-btn ${priceRange === 'low' ? 'active' : ''}`}
                                            onClick={() => setPriceRange('low')}
                                        >
                                            &lt; $200k
                                        </button>
                                        <button
                                            className={`filter-btn ${priceRange === 'mid' ? 'active' : ''}`}
                                            onClick={() => setPriceRange('mid')}
                                        >
                                            $200k - $500k
                                        </button>
                                        <button
                                            className={`filter-btn ${priceRange === 'high' ? 'active' : ''}`}
                                            onClick={() => setPriceRange('high')}
                                        >
                                            &gt; $500k
                                        </button>
                                    </div>
                                </div>

                                {/* Reset & Apply Actions */}
                                <div className="filter-actions">
                                    <button
                                        className="reset-btn"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedBrand('ALL');
                                            setPriceRange('all');
                                            setSortBy('newest');
                                            setVehicleType('all');
                                        }}
                                    >
                                        <RotateCcw size={16} />
                                        Reset All
                                    </button>
                                    <button
                                        className="apply-btn"
                                        onClick={() => setIsFilterModalOpen(false)}
                                    >
                                        Show {filteredCars.length} Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* </div> */}
            </div>

            <div className="container inventory-grid-full">
                {filteredCars.map(car => (
                    <div
                        key={car.id}
                        className="car-card glass"
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

                {filteredCars.length === 0 && (
                    <div className="no-results">
                        <h3>No vehicles found matching your criteria.</h3>
                        <button onClick={() => { setSelectedBrand('ALL'); setSearchTerm(''); setPriceRange('all'); }} className="btn-link">Clear All Filters</button>
                    </div>
                )}
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

            <Footer />
        </div>
    );
};

export default InventoryPage;


