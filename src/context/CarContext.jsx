import React, { createContext, useContext, useState, useEffect } from 'react';
import { cars as initialCars } from '../data/cars';

const CarContext = createContext();

export const useCarContext = () => useContext(CarContext);

export const CarProvider = ({ children }) => {
    // ---- State ----
    const [allCars, setAllCars] = useState([]);
    const [recentCarIds, setRecentCarIds] = useState([]); // IDs of cars to show in "Recently Parked"
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    // ---- Load Data on Mount ----
    useEffect(() => {
        // Check local storage for persisted data
        const savedCars = localStorage.getItem('lbx_allCars_v3');
        const savedRecentIds = localStorage.getItem('lbx_recentCarIds_v3');
        const savedAdmin = localStorage.getItem('lbx_isAdmin');

        try {
            if (savedCars) {
                setAllCars(JSON.parse(savedCars));
            } else {
                // First time load: use the static data
                setAllCars(initialCars);
                const initialRecents = initialCars.slice(0, 6).map(c => c.id);
                setRecentCarIds(initialRecents);
                localStorage.setItem('lbx_allCars_v3', JSON.stringify(initialCars));
                localStorage.setItem('lbx_recentCarIds_v3', JSON.stringify(initialRecents));
            }

            if (savedRecentIds) {
                setRecentCarIds(JSON.parse(savedRecentIds));
            }
        } catch (error) {
            console.error("Error parsing data from localStorage:", error);
            // Fallback to initial data if localStorage is corrupted
            setAllCars(initialCars);
            const initialRecents = initialCars.slice(0, 6).map(c => c.id);
            setRecentCarIds(initialRecents);
            // Optional: Clear corrupted data
            localStorage.removeItem('lbx_allCars_v3');
            localStorage.removeItem('lbx_recentCarIds_v3');
        }

        if (savedAdmin === 'true') {
            setIsAdmin(true);
        }

        // Mark loading as complete
        setIsLoading(false);
    }, []);

    // ---- Actions ----

    const login = (username, password) => {
        // Simple hardcoded check for demo purposes
        if (username === 'admin' && password === 'admin123') {
            setIsAdmin(true);
            localStorage.setItem('lbx_isAdmin', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('lbx_isAdmin');
    };

    const addCar = (newCar) => {
        // Assign a new ID if not present (simple max+1 strategy)
        const id = newCar.id || (allCars.length > 0 ? Math.max(...allCars.map(c => c.id)) + 1 : 1);
        const carWithId = { ...newCar, id };

        const updatedCars = [carWithId, ...allCars]; // Add to front
        setAllCars(updatedCars);
        localStorage.setItem('lbx_allCars_v3', JSON.stringify(updatedCars));

        // Automatically add to recent list (as per requirement: "newly added ones should show on the recently park list")
        const updatedRecents = [id, ...recentCarIds];
        setRecentCarIds(updatedRecents);
        localStorage.setItem('lbx_recentCarIds_v3', JSON.stringify(updatedRecents));
    };

    const editCar = (updatedCar) => {
        const updatedCars = allCars.map(c => c.id === updatedCar.id ? updatedCar : c);
        setAllCars(updatedCars);
        localStorage.setItem('lbx_allCars_v3', JSON.stringify(updatedCars));
    };

    const deleteCar = (id) => {
        const updatedCars = allCars.filter(c => c.id !== id);
        setAllCars(updatedCars);
        localStorage.setItem('lbx_allCars_v3', JSON.stringify(updatedCars));

        // Also remove from recents if present
        if (recentCarIds.includes(id)) {
            const updatedRecents = recentCarIds.filter(rid => rid !== id);
            setRecentCarIds(updatedRecents);
            localStorage.setItem('lbx_recentCarIds_v3', JSON.stringify(updatedRecents));
        }
    };

    const updateRecentList = (ids) => {
        setRecentCarIds(ids);
        localStorage.setItem('lbx_recentCarIds_v3', JSON.stringify(ids));
    };

    // Bulk Import for JSON data
    const importData = (data) => {
        if (data.allCars && Array.isArray(data.allCars)) {
            setAllCars(data.allCars);
            localStorage.setItem('lbx_allCars_v3', JSON.stringify(data.allCars));
        }
        if (data.recentCarIds && Array.isArray(data.recentCarIds)) {
            setRecentCarIds(data.recentCarIds);
            localStorage.setItem('lbx_recentCarIds_v3', JSON.stringify(data.recentCarIds));
        }
    };

    // Derived state for consumers
    // Map IDs back to full car objects for the "Recently Parked" component
    // We want to preserve the order of recentCarIds
    const recentCars = recentCarIds
        .map(id => allCars.find(c => c.id === id))
        .filter(c => c !== undefined); // safe check

    return (
        <CarContext.Provider value={{
            allCars,
            recentCars,
            recentCarIds,
            isAdmin,
            isLoading,
            login,
            logout,
            addCar,
            editCar,
            deleteCar,
            updateRecentList,
            importData
        }}>
            {children}
        </CarContext.Provider>
    );
};
