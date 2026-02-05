import React, { useState, useEffect } from 'react';
import { Menu, Search, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setIsMenuOpen(false); // Close menu on click
        if (location.pathname !== '/') {
            navigate(`/${targetId}`); // This might need adjustment if routes are different
            // Actually, for #ids, we usually go to '/' then scroll.
            // But let's keep existing logic or improve it. 
            // If we are on /inventory, we probably want to go to /#home.
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-content">
                    <Link to="/" className="brand-logo">LBX World</Link>

                    <div className="nav-links">
                        <Link to="/" onClick={(e) => handleNavClick(e, '#home')}>Home</Link>
                        <Link to="/" onClick={(e) => handleNavClick(e, '#inventory')}>Inventory</Link>
                        <Link to="/" onClick={(e) => handleNavClick(e, '#services')}>Services</Link>
                        <Link to="/" onClick={(e) => handleNavClick(e, '#contact')}>Contact</Link>
                    </div>

                    <div className="nav-actions">
                        <button className="icon-btn menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full Screen Menu Overlay */}
            <div className={`fullscreen-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="menu-close-btn" onClick={() => setIsMenuOpen(false)}>
                    &times;
                </div>
                <div className="menu-links">
                    <Link to="/" onClick={(e) => handleNavClick(e, '#home')}>Home</Link>
                    <Link to="/" onClick={(e) => handleNavClick(e, '#inventory')}>Inventory</Link>
                    <Link to="/" onClick={(e) => handleNavClick(e, '#services')}>Services</Link>
                    <Link to="/inventory">Full Collection</Link>
                    <Link to="/" onClick={(e) => handleNavClick(e, '#contact')}>Contact</Link>
                    {/* Extra elements as requested */}
                    <span className="separator"></span>
                    <a href="#">About LBX</a>
                    <a href="#">Sell Your Car</a>
                    <a href="#">Finance</a>
                </div>
            </div>
        </>
    );
};

export default Navbar;
