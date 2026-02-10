import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.button === 0) {
            navigate(`/inventory?search=${encodeURIComponent(searchValue)}`);
        }
    };

    const scrollToInventory = () => {
        const element = document.getElementById('inventory');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero" id="home">
            <div className="hero-bg">
                <img src="/assets/hero-bg.png" alt="Luxury Car Background" />
                <div className="gradient-overlay"></div>
            </div>

            <div className="container hero-content">
                <motion.p
                    className="welcome-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Welcome to the Dream Destination for car Lovers.
                </motion.p>
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <span className="bold">Luxury</span> <span className="light">Without Limits</span>
                </motion.h1>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search Your Dream Car Here"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <button className="search-btn-icon" onClick={handleSearch}>
                            <Search size={20} color="rgba(255,255,255,0.7)" />
                        </button>
                    </div>

                    <button className="discover-btn" onClick={scrollToInventory}>
                        Discover Collection <ArrowRight size={20} />
                    </button>
                </motion.div>
            </div>

            <motion.div
                className="hero-scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            >
                <span onClick={scrollToInventory} className='scroll-down'>SCROLL DOWN</span>
            </motion.div>
        </section>
    );
};

export default Hero;
