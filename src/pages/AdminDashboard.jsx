import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';

import {
    Plus, Trash2, Check, X, LogOut, Image as ImageIcon,
    ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Settings, Download, Upload, Home, Package, Search
} from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
    const {
        allCars,
        recentCarIds,
        updateRecentList,
        addCar,
        editCar,
        deleteCar,
        importData,
        isAdmin,
        isLoading,
        logout
    } = useCarContext();

    // Derived state for reordering modal
    const recentCarsOrdered = recentCarIds
        .map(id => allCars.find(c => c.id === id))
        .filter(c => c !== undefined);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuel: 'Petrol',
        description: '',
        images: [''], // Start with one empty slot for the main image
        reg: 'New',
        type: 'Car',
        features: '',
        specifications: []
    });

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Filter cars based on search query
    const filteredCars = allCars.filter(car => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        return (
            car.brand.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.year.toString().includes(query) ||
            car.price.toString().includes(query)
        );
    });

    useEffect(() => {
        // Only redirect if loading is complete and user is not admin
        if (!isLoading && !isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, isLoading, navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <section className="section-padding" style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
                </div>
            </section>
        );
    }

    // Handle Form Opening
    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            price: '',
            mileage: '',
            fuel: 'Petrol',
            description: '',
            images: [''], // Ensure at least one input for the main image
            reg: 'New',
            type: 'Car',
            features: '',
            specifications: []
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (car) => {
        setEditingId(car.id);
        // Consolidate images: use existing gallery, or fallback to main image, or empty
        let imagesList = [];
        if (car.images && car.images.length > 0) {
            imagesList = [...car.images];
        } else if (car.image) {
            imagesList = [car.image];
        } else {
            imagesList = [''];
        }

        setFormData({
            brand: car.brand,
            model: car.model,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            fuel: car.fuel,
            description: car.description || '',
            images: imagesList,
            reg: car.reg,
            type: car.type || 'Car',
            features: car.features ? car.features.join(', ') : '',
            specifications: car.specifications || []
        });
        setIsFormModalOpen(true);
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/admin');
    };

    const toggleRecent = (id) => {
        const isRecent = recentCarIds.includes(id);
        let newIds;
        if (isRecent) {
            newIds = recentCarIds.filter(rid => rid !== id);
        } else {
            newIds = [id, ...recentCarIds];
        }
        updateRecentList(newIds);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Filter out empty strings
        const validImages = formData.images.filter(img => img.trim() !== '');

        // Validation
        if (!formData.brand || !formData.model || !formData.price || validImages.length === 0) {
            alert('Please fill in all required fields (Brand, Model, Price) and add at least one image.');
            return;
        }

        // Process features
        const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');

        const carData = {
            ...formData,
            id: editingId,
            year: String(formData.year),
            price: Number(formData.price),
            mileage: Number(formData.mileage) || 0,
            image: validImages[0], // First image is main image
            images: validImages,      // Full gallery list
            type: formData.type,
            features: featuresArray
        };

        if (editingId) {
            editCar(carData);
        } else {
            addCar(carData);
        }
        setIsFormModalOpen(false);
    };

    const handleGalleryAdd = () => {
        setFormData({
            ...formData,
            images: [...formData.images, '']
        });
    };

    const handleGalleryChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleGalleryRemove = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        // Ensure at least one input always remains
        if (newImages.length === 0) {
            setFormData({ ...formData, images: [''] });
        } else {
            setFormData({ ...formData, images: newImages });
        }
    };

    const moveGalleryImage = (index, direction) => {
        const newImages = [...formData.images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newImages.length) {
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            setFormData({ ...formData, images: newImages });
        }
    };

    // Specifications Handlers
    const handleAddSpec = () => {
        setFormData({
            ...formData,
            specifications: [...formData.specifications, { label: '', value: '' }]
        });
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData({ ...formData, specifications: newSpecs });
    };

    const handleRemoveSpec = (index) => {
        const newSpecs = formData.specifications.filter((_, i) => i !== index);
        setFormData({ ...formData, specifications: newSpecs });
    };

    const handleDelete = (id, model) => {
        if (window.confirm(`Are you sure you want to delete ${model}?`)) {
            deleteCar(id);
        }
    };

    const moveItem = (index, direction) => {
        const newIds = [...recentCarIds];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newIds.length) {
            [newIds[index], newIds[targetIndex]] = [newIds[targetIndex], newIds[index]];
            updateRecentList(newIds);
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify({ allCars, recentCarIds }, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `lbx_inventory_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (window.confirm("This will overwrite your current inventory. Are you sure?")) {
                    importData(data);
                    alert("Import successful!");
                }
            } catch (error) {
                alert("Invalid JSON file");
                console.error(error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <section className="section-padding" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <div className="container">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h2 className="dashboard-title">Inventory Management</h2>
                    </div>

                    <div className="admin-navbar">
                        <div className="admin-nav-section">
                            <button className="admin-nav-btn" onClick={() => navigate('/')} title="Go to Home">
                                <Home size={18} />
                                Home
                            </button>
                            <button className="admin-nav-btn" onClick={() => navigate('/inventory')} title="View Inventory">
                                <Package size={18} />
                                Inventory
                            </button>

                            <div className="admin-nav-divider"></div>

                            <button className="admin-nav-btn" onClick={handleExport} title="Export Data">
                                <Download size={18} />
                                Export
                            </button>
                            <button className="admin-nav-btn" onClick={handleImportClick} title="Import Data">
                                <Upload size={18} />
                                Import
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".json"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="admin-nav-section">
                            <button className="admin-nav-btn" onClick={() => setIsReorderModalOpen(true)} title="Reorder Recently Parked">
                                <Settings size={18} />
                                Order
                            </button>
                            <button className="admin-nav-btn danger" onClick={handleLogout} title="Logout">
                                <LogOut size={18} />
                                Logout
                            </button>

                            <div className="admin-nav-divider"></div>

                            <button className="admin-nav-btn primary" onClick={openAddModal}>
                                <Plus size={18} />
                                Add Vehicle
                            </button>
                        </div>
                    </div>
                </div>

                <div className="search-container">
                    <div className="search-input-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by brand, model, year, or price..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <span className="search-results-count">
                                Found {filteredCars.length} of {allCars.length} vehicles
                            </span>
                        )}

                    </div>
                </div>

                <div className="dashboard-grid">
                    {filteredCars.map(car => (
                        <div className="glass admin-card" key={car.id}>
                            <div className="card-image-container">
                                <img src={car.image} alt={car.model} className="card-main-image" />
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{car.brand} {car.model}</h3>
                                <p className="card-info">{car.year} • ₹{car.price.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="card-controls">
                                <div
                                    className={`featured-toggle ${recentCarIds.includes(car.id) ? 'active' : ''}`}
                                    onClick={() => toggleRecent(car.id)}
                                >
                                    <div className="checkbox-visual">
                                        {recentCarIds.includes(car.id) && <Check size={12} />}
                                    </div>
                                    <span>RP</span>
                                </div>

                                <button className="control-btn edit" onClick={() => openEditModal(car)}>
                                    Edit
                                </button>
                                <button className="control-btn delete" onClick={() => handleDelete(car.id, car.model)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Car Modal */}
            {isFormModalOpen && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsFormModalOpen(false);
                    }}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                        </div>

                        <div className="modal-body">
                            <form id="car-form" onSubmit={handleFormSubmit}>
                                {/* Basic Details Section */}
                                <div className="form-section">
                                    <div className="form-section-header">
                                        <span className="form-section-title">Vehicle Information</span>
                                        <div className="form-section-line"></div>
                                    </div>

                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label className="input-label">Type</label>
                                            <select
                                                className="form-input"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="Car">Car</option>
                                                <option value="Motorcycle">Motorcycle</option>
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Fuel Type</label>
                                            <select
                                                className="form-input"
                                                value={formData.fuel}
                                                onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                                            >
                                                <option value="Petrol">Petrol</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="Electric">Electric</option>
                                                <option value="Hybrid">Hybrid</option>
                                            </select>
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label">Brand</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                required
                                                placeholder="e.g. BMW"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Model</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.model}
                                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                required
                                                placeholder="e.g. M4 Competition"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Year</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Price (₹)</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Mileage</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={formData.mileage}
                                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Registration</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.reg}
                                                onChange={(e) => setFormData({ ...formData, reg: e.target.value })}
                                                placeholder="e.g. CA, Unregistered"
                                            />
                                        </div>

                                        <div className="input-group full-width">
                                            <label className="input-label">Key Features (comma separated)</label>
                                            <textarea
                                                className="form-input"
                                                rows="2"
                                                value={formData.features}
                                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                                placeholder="e.g. Sunroof, Heated Seats, Bluetooth, AWD"
                                            ></textarea>
                                        </div>

                                        <div className="input-group full-width">
                                            <label className="input-label">Description</label>
                                            <textarea
                                                className="form-input"
                                                rows="3"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Specifications Section */}
                                <div className="form-section">
                                    <div className="form-section-header">
                                        <span className="form-section-title">Technical Specifications</span>
                                        <div className="form-section-line"></div>
                                        <button
                                            type="button"
                                            className="btn-outline"
                                            onClick={handleAddSpec}
                                            style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
                                        >
                                            <Plus size={14} style={{ marginRight: '4px' }} /> Add Spec
                                        </button>
                                    </div>

                                    <div className="specs-form-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                                        {formData.specifications && formData.specifications.length > 0 ? (
                                            formData.specifications.map((spec, index) => (
                                                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Label (e.g. Engine)"
                                                        value={spec.label}
                                                        onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                                                        style={{ flex: 1 }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Value (e.g. V8)"
                                                        value={spec.value}
                                                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                                        style={{ flex: 1 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="gallery-tool-btn delete"
                                                        onClick={() => handleRemoveSpec(index)}
                                                        title="Remove Specification"
                                                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                                No specific technical details added. Click "Add Spec" to customize.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery Section */}
                                <div className="form-section">
                                    <div className="form-section-header">
                                        <span className="form-section-title">Gallery & Media</span>
                                        <div className="form-section-line"></div>
                                    </div>

                                    <div className="gallery-grid">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className={`gallery-card ${index === 0 ? 'main-image' : ''}`}>
                                                <div className="gallery-card-preview">
                                                    {img ? (
                                                        <img src={img} alt={`Preview ${index}`} onError={(e) => e.target.style.display = 'none'} />
                                                    ) : (
                                                        <div className="placeholder">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                    {index === 0 && <div className="main-badge">MAIN</div>}
                                                </div>

                                                <div className="gallery-card-actions">
                                                    <input
                                                        type="text"
                                                        className="gallery-url-input"
                                                        value={img}
                                                        onChange={(e) => handleGalleryChange(index, e.target.value)}
                                                        placeholder="Image URL..."
                                                    />
                                                    <div className="gallery-buttons">
                                                        <button
                                                            type="button"
                                                            className="gallery-tool-btn"
                                                            onClick={() => moveGalleryImage(index, 'up')}
                                                            disabled={index === 0}
                                                            title="Move Up"
                                                        >
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="gallery-tool-btn"
                                                            onClick={() => moveGalleryImage(index, 'down')}
                                                            disabled={index === formData.images.length - 1}
                                                            title="Move Down"
                                                        >
                                                            <ArrowRight size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="gallery-tool-btn delete"
                                                            onClick={() => handleGalleryRemove(index)}
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add New Button Card */}
                                        <button
                                            type="button"
                                            className="gallery-card"
                                            style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                borderStyle: 'dashed',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '200px',
                                                color: 'var(--color-text-secondary)'
                                            }}
                                            onClick={handleGalleryAdd}
                                        >
                                            <Plus size={24} style={{ marginBottom: '0.5rem' }} />
                                            <span style={{ fontSize: '0.9rem' }}>Add Image</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-outline" onClick={() => setIsFormModalOpen(false)}>
                                Cancel
                            </button>
                            <button type="submit" form="car-form" className="btn-primary">
                                {editingId ? 'Save Changes' : 'Add Vehicle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reorder Modal */}
            {isReorderModalOpen && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsReorderModalOpen(false);
                    }}
                >
                    <div
                        className="modal-content"
                        style={{ maxWidth: '450px', maxHeight: '80vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title">Reorder Featured</h3>
                        </div>

                        <div className="modal-body">
                            {recentCarsOrdered.length === 0 ? (
                                <div className="reorder-empty">
                                    <p>No vehicles selected as "Recent".</p>
                                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Toggle "RP" on vehicles to add them here.</p>
                                </div>
                            ) : (
                                <div className="reorder-list">
                                    {recentCarsOrdered.map((car, index) => (
                                        <div key={car.id} className="reorder-item">
                                            <div className="reorder-content">
                                                <span className="reorder-index">{index + 1}</span>
                                                <img src={car.image} alt="" className="reorder-thumb" />
                                                <span className="reorder-name">{car.model}</span>
                                            </div>
                                            <div className="reorder-controls">
                                                <button
                                                    className="reorder-control-btn"
                                                    disabled={index === 0}
                                                    onClick={() => moveItem(index, 'up')}
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button
                                                    className="reorder-control-btn"
                                                    disabled={index === recentCarsOrdered.length - 1}
                                                    onClick={() => moveItem(index, 'down')}
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-outline" onClick={() => setIsReorderModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={() => setIsReorderModalOpen(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsLogoutModalOpen(false);
                    }}
                >
                    <div
                        className="modal-content"
                        style={{ maxWidth: '400px', height: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title">Confirm Logout</h3>
                            <button className="modal-close-btn" onClick={() => setIsLogoutModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                Are you sure you want to log out of the admin portal? You will need to sign in again to access inventory management.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-outline" onClick={() => setIsLogoutModalOpen(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={confirmLogout}
                                style={{ background: 'var(--color-accent)', color: '#000' }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section >
    );
};

export default AdminDashboard;
