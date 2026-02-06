
import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import './ModelShowcase.css';

const ModelShowcase = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scroll progress for the entire section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Transform scroll progress to frame index (0 to 39 for 40 frames)
    const frameCount = 124;
    const currentFrame = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = [];
            const placeholderSrc = '/assets/hb3.png'; // Fallback

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                // File naming: ezgif-frame-001.jpg
                const paddedIndex = i.toString().padStart(3, '0');
                const imgSrc = `/assets/car-side/ezgif-frame-${paddedIndex}.jpg`;

                img.src = imgSrc;

                await new Promise((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.warn(`Failed to load frame ${i}, falling back`);
                        img.src = placeholderSrc;
                        resolve();
                    };
                });
                loadedImages.push(img);
            }

            setImages(loadedImages);
            setLoading(false);
        };

        loadImages();
    }, []);

    // Draw to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');

        // Resize canvas to fit window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Draw immediately after resize
            const index = Math.floor(currentFrame.get());
            if (images[index]) {
                renderFrame(images[index], context, canvas.width, canvas.height);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Animation loop
        const unsubscribe = currentFrame.on("change", (latest) => {
            const index = Math.floor(latest);
            if (images.length > 0 && images[index]) {
                renderFrame(images[index], context, canvas.width, canvas.height);
            }
        });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            unsubscribe();
        };
    }, [images, currentFrame]);

    const renderFrame = (image, ctx, width, height) => {
        ctx.clearRect(0, 0, width, height);

        // "Cover" fit logic for canvas
        const scale = Math.max(width / image.width, height / image.height);
        const x = (width / 2) - (image.width / 2) * scale;
        const y = (height / 2) - (image.height / 2) * scale;

        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

        // NO overlay needed anymore as we don't have text reading issues
        // But a very subtle vignette could be nice? Let's keep it clean for now as user asked for "perfect" car view.
    };

    return (
        <div ref={containerRef} className="model-showcase-container">
            <div className="sticky-wrapper">
                <canvas ref={canvasRef} className="showcase-canvas" />
                <div className="showcase-overlay"></div>

                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Initializing M Performance...</p>
                    </div>
                )}

                {/* Static Bestseller Badge */}
                <div className="static-info">
                    <div className="bestseller-badge">
                        <span className="badge-highlight">#1 BESTSELLER</span>
                        <h1>BMW M340i xDrive</h1>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span>Scroll to Rotate</span>
                    {/* <div className="mouse-icon"></div> */}
                </div>
            </div>
        </div>
    );
};

export default ModelShowcase;
