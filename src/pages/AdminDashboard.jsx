import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Edit2, Check, X, LogOut, Image as ImageIcon,
    ArrowUp, ArrowDown, Settings, Download, Upload, Star, Home, Package
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

    // Form State
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuel: 'Petrol',
        description: '',
        images: [''], // Start with one empty slot for the main image
        reg: 'New'
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
            reg: 'New'
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
            reg: car.reg
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

        const carData = {
            ...formData,
            id: editingId,
            year: String(formData.year),
            price: Number(formData.price),
            mileage: Number(formData.mileage) || 0,
            image: validImages[0], // First image is main image
            images: validImages      // Full gallery list
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
        // Ensure at least one input always remains if desired, or allow empty
        if (newImages.length === 0) {
            setFormData({ ...formData, images: [''] });
        } else {
            setFormData({ ...formData, images: newImages });
        }
    };

    // Move gallery image up/down (reorder images)
    const moveGalleryImage = (index, direction) => {
        const newImages = [...formData.images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newImages.length) {
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            setFormData({ ...formData, images: newImages });
        }
    };

    const handleDelete = (id, model) => {
        if (window.confirm(`Are you sure you want to delete ${model}?`)) {
            deleteCar(id);
        }
    };

    // Reordering logic for homepage
    const moveItem = (index, direction) => {
        const newIds = [...recentCarIds];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newIds.length) {
            // Swap
            [newIds[index], newIds[targetIndex]] = [newIds[targetIndex], newIds[index]];
            updateRecentList(newIds);
        }
    };

    // Export Data
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

    // Import Data
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
                    <div>
                        <h2 className="dashboard-title text-gradient">Inventory Manager</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your fleet and homepage showcase</p>
                    </div>
                    <div className="dashboard-actions">
                        <button className="btn-outline" onClick={() => navigate('/')} title="Go to Home">
                            <Home size={18} style={{ marginRight: '8px' }} /> Home
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/inventory')} title="View Inventory">
                            <Package size={18} style={{ marginRight: '8px' }} /> Inventory
                        </button>
                        <button className="btn-outline" onClick={handleExport} title="Export Data">
                            <Download size={18} style={{ marginRight: '8px' }} /> Export
                        </button>
                        <button className="btn-outline" onClick={handleImportClick} title="Import Data">
                            <Upload size={18} style={{ marginRight: '8px' }} /> Import
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".json"
                            onChange={handleFileChange}
                        />
                        <button className="btn-outline" onClick={handleLogout}>
                            <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
                        </button>
                        <button className="btn-outline" onClick={() => setIsReorderModalOpen(true)}>
                            <Settings size={18} style={{ marginRight: '8px' }} /> Order Recently Parked
                        </button>
                        <button className="btn-primary" onClick={openAddModal}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> Add Vehicle
                        </button>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {allCars.map(car => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="glass admin-card"
                        >
                            <div className="card-top">
                                <div className="card-details">
                                    <h3>{car.brand} {car.model}</h3>
                                    <p>{car.year} • ${car.price.toLocaleString()}</p>
                                </div>
                                <img src={car.image} alt={car.model} className="card-img-preview" />
                            </div>

                            <div className="card-controls">
                                <div
                                    className={`featured-toggle ${recentCarIds.includes(car.id) ? 'active' : ''}`}
                                    onClick={() => toggleRecent(car.id)}
                                >
                                    <div className="checkbox-visual">
                                        {recentCarIds.includes(car.id) && <Check size={12} />}
                                    </div>
                                    <span style={{ marginLeft: '8px' }}>Recently Parked</span>
                                </div>

                                <button className="control-btn edit" onClick={() => openEditModal(car)}>
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button className="control-btn delete" onClick={() => handleDelete(car.id, car.model)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Car Modal */}
            <AnimatePresence>
                {isFormModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsFormModalOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 className="text-2xl font-bold">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                                <button onClick={() => setIsFormModalOpen(false)}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="form-grid">
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
                                    <label className="input-label">Price ($)</label>
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

                                <div className="input-group full-width">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ paddingLeft: '12px' }}
                                    ></textarea>
                                </div>

                                {/* Consolidated Gallery Section */}
                                <div className="input-group full-width">
                                    <h4 className="gallery-section-title">Vehicle Images</h4>
                                    <p className="text-sm text-gray-400 mb-2">The first image will be used as the Main Image.</p>

                                    <div className="gallery-inputs">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="gallery-input-row" style={{ alignItems: 'flex-start' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '10px' }}>
                                                    <span style={{ fontSize: '0.8rem', color: index === 0 ? 'var(--color-accent)' : '#666' }}>
                                                        {/* {index === 0 ? '1' : index + 1} */}
                                                        {index + 1}
                                                    </span>
                                                    {/* {index === 0 && <Star size={12} fill="currentColor" color="var(--color-accent)" />} */}
                                                </div>

                                                <div className="input-wrapper" style={{ flex: 1 }}>
                                                    <ImageIcon className="input-icon" size={18} />
                                                    <input
                                                        type="url"
                                                        className="form-input"
                                                        value={img}
                                                        onChange={(e) => handleGalleryChange(index, e.target.value)}
                                                        placeholder={index === 0 ? "Main Image URL" : `Gallery Image URL ${index}`}
                                                        required={index === 0}
                                                    />
                                                </div>

                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        type="button"
                                                        className="reorder-btn"
                                                        onClick={() => moveGalleryImage(index, 'up')}
                                                        disabled={index === 0}
                                                        title="Move Up (Make Main)"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="reorder-btn"
                                                        onClick={() => moveGalleryImage(index, 'down')}
                                                        disabled={index === formData.images.length - 1}
                                                        title="Move Down"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="remove-img-btn"
                                                    onClick={() => handleGalleryRemove(index)}
                                                    title="Remove Image"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn-outline"
                                            onClick={handleGalleryAdd}
                                            style={{ marginTop: '0.5rem', alignSelf: 'start' }}
                                        >
                                            <Plus size={16} style={{ marginRight: '6px' }} /> Add Image
                                        </button>
                                    </div>

                                    {/* Mini Grid Preview */}
                                    {formData.images.some(url => url) && (
                                        <div className="preview-grid">
                                            {formData.images.map((url, i) => url ? (
                                                <div key={i} className="preview-item">
                                                    <img src={url} alt={`Preview ${i}`} />
                                                    {i === 0 && (
                                                        <div style={{
                                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                                            background: 'rgba(255,255,255,0.9)', color: 'black',
                                                            fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center',
                                                            padding: '2px'
                                                        }}>
                                                            MAIN
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null)}
                                        </div>
                                    )}
                                </div>

                                <div className="full-width" style={{ marginTop: '1rem' }}>
                                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        {editingId ? 'Save Changes' : 'Add Vehicle to Inventory'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reorder Modal */}
            <AnimatePresence>
                {isReorderModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsReorderModalOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="modal-content"
                            style={{ maxWidth: '500px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 className="text-xl font-bold">Reorder Recently Parked</h3>
                                <button onClick={() => setIsReorderModalOpen(false)}><X size={24} /></button>
                            </div>

                            <p className="text-sm text-gray-400 mb-4">
                                Use the arrows to change the display order on the homepage.
                            </p>

                            <div className="reorder-list">
                                {recentCarsOrdered.map((car, index) => (
                                    <div key={car.id} className="reorder-item">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ color: 'var(--color-text-secondary)', width: '20px', textAlign: 'center' }}>{index + 1}</span>
                                            <img src={car.image} alt="" style={{ width: '50px', height: '35px', borderRadius: '4px', objectFit: 'cover' }} />
                                            <span style={{ fontWeight: '500' }}>{car.model}</span>
                                        </div>
                                        <div className="reorder-controls">
                                            <button
                                                className="reorder-btn"
                                                disabled={index === 0}
                                                onClick={() => moveItem(index, 'up')}
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                className="reorder-btn"
                                                disabled={index === recentCarsOrdered.length - 1}
                                                onClick={() => moveItem(index, 'down')}
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {recentCarsOrdered.length === 0 && (
                                    <p style={{ textAlign: 'center', padding: '2rem' }}>No recently parked cars selected.</p>
                                )}
                            </div>

                            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                <button className="btn-primary" onClick={() => setIsReorderModalOpen(false)}>Done</button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsLogoutModalOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="modal-content"
                            style={{ maxWidth: '400px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 className="text-xl font-bold">Confirm Logout</h3>
                                <button onClick={() => setIsLogoutModalOpen(false)}><X size={24} /></button>
                            </div>

                            <p className="text-sm text-gray-400 mb-6">
                                Are you sure you want to log out of the admin portal?
                            </p>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button className="btn-outline" onClick={() => setIsLogoutModalOpen(false)}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={confirmLogout} style={{ background: 'var(--color-accent)' }}>
                                    <LogOut size={16} style={{ marginRight: '8px' }} /> Logout
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default AdminDashboard;
