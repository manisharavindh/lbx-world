import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', gap: '2rem', paddingTop: '100px', paddingBottom: '100px' }}>
                <h1
                    className="text-gradient"
                    style={{ fontSize: '4rem', fontWeight: '800' }}
                >
                    404
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
                    The page you are looking for seems to have drifted away. Let's get you back on track.
                </p>
                <Link to="/" className="btn-primary">
                    Return Home
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default NotFoundPage;
