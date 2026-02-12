import React, { useState } from 'react';
import { Phone, MessageCircle, X, ChevronUp } from 'lucide-react';
import './FloatingContact.css';

const FloatingContact = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const contactOptions = [
        {
            icon: <Phone size={20} />,
            label: 'Call Sales',
            action: () => window.location.href = 'tel:+1234567890',
            color: '#25D366' // WhatsApp/Phone green-ish, or keep theme
        },
        {
            icon: <MessageCircle size={20} />,
            label: 'Whatapp Us',
            action: () => window.open('https://wa.me/1234567890', '_blank'),
            color: '#25D366'
        }
    ];

    return (
        <div className="floating-contact-wrapper">
            {isOpen && (
                <div
                    className="contact-options"
                >
                    {contactOptions.map((option, index) => (
                        <button
                            key={index}
                            className="contact-option-btn glass"
                            onClick={option.action}
                        >
                            <span className="icon">{option.icon}</span>
                            <span className="label">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}

            <button
                className={`main-fab ${isOpen ? 'open' : ''}`}
                onClick={toggleOpen}
            >
                {isOpen ? <X size={24} /> : <Phone size={24} />}
            </button>
        </div>
    );
};

export default FloatingContact;
