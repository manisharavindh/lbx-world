import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cars } from '../data/cars';
import { Search, Filter, ArrowRight, Gauge, Fuel, Calendar } from 'lucide-react';
import './InventoryPage.css';

const InventoryPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialBrand = searchParams.get('brand') || '';
    const initialSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedBrand, setSelectedBrand] = useState(initialBrand.toUpperCase());
    const [priceRange, setPriceRange] = useState('all');

    useEffect(() => {
        if (initialBrand) {
            setSelectedBrand(initialBrand.toUpperCase());
        }
        if (initialSearch) {
            setSearchTerm(initialSearch);
        }
    }, [initialBrand, initialSearch]);

    const uniqueBrands = ['ALL', ...new Set(cars.map(car => car.brand))];

    const filteredCars = cars.filter(car => {
        const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = selectedBrand === 'ALL' || !selectedBrand || car.brand === selectedBrand;

        // Simple price filter logic
        let matchesPrice = true;
        if (priceRange === 'low') matchesPrice = car.price < 200000;
        if (priceRange === 'mid') matchesPrice = car.price >= 200000 && car.price < 500000;
        if (priceRange === 'high') matchesPrice = car.price >= 500000;

        return matchesSearch && matchesBrand && matchesPrice;
    });

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="inventory-page-header">
                <div className="container">
                    <h1>The Collection</h1>
                    {/* <p>Curated excellence for the discerning driver.</p> */}
                </div>
            </div>

            <div className="container inventory-controls-section">
                <div className="search-bar-wrapper glass">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by model or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters-wrapper">
                    <div className="brand-tags">
                        {uniqueBrands.map(brand => (
                            <button
                                key={brand}
                                className={`brand-tag ${selectedBrand === brand ? 'active' : ''}`}
                                onClick={() => setSelectedBrand(brand)}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>
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
                        </div>
                    </div>
                ))}

                {filteredCars.length === 0 && (
                    <div className="no-results">
                        <h3>No vehicles found matching your criteria.</h3>
                        <button onClick={() => { setSelectedBrand('ALL'); setSearchTerm(''); }} className="btn-link">Clear Filters</button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default InventoryPage;
