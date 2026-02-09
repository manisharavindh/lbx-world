import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BrandMarquee from '../components/BrandMarquee';
import Inventory from '../components/Inventory';
import Experience from '../components/Experience';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import ModelShowcase from '../components/ModelShowcase';
import Services from '../components/Services';

// import floatinf contact
import FC from '../components/FloatingContact';


const HomePage = () => (
    <>
        <Navbar />
        <Hero />
        <Inventory />
        <BrandMarquee />
        <ModelShowcase />
        <Experience />
        <Services />
        <Contact />
        <Footer />
        {/* <FC /> */}
    </>
);

export default HomePage;
