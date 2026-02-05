import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { cars } from './data/cars';
import { Search, Filter, ArrowRight } from 'lucide-react';
import './InventoryPage.css';

const InventoryPage = () => {
    const [searchParams] = useSearchParams();
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
                    <p>Curated excellence for the discerning driver.</p>
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
                    <div key={car.id} className="car-card glass">
                        <div className="card-badge">{car.brand}</div>
                        <div className="img-wrapper">
                            <img src={car.image} alt={car.model} />
                        </div>
                        <div className="card-content">
                            <div className="card-header-row">
                                <h3>{car.model}</h3>
                                <span className="year">{car.year}</span>
                            </div>
                            <p className="description">{car.description}</p>
                            <div className="price-tag-large">${car.price.toLocaleString()}</div>
                            <button className="btn-outline full-width">View Details</button>
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
