
import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import './ModelShowcase.css';

const ModelShowcase = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const frameIndexRef = useRef(0);
    const requestRef = useRef(null);

    // Sprite configuration
    const FRAME_COUNT = 192;
    const FRAME_WIDTH = 1280;
    const FRAME_HEIGHT = 720;

    // Scroll progress for the entire section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Transform scroll progress to frame index
    const currentFrame = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages = new Array(FRAME_COUNT);
        let mounted = true;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === FRAME_COUNT && mounted) {
                setImages(loadedImages);
                setLoading(false);
            }
        };

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/assets/model-showcase/frames/frame_${i.toString().padStart(3, '0')}.webp`;
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
            loadedImages[i] = img;
        }

        // Fast fallback: if network is slow, unlock the site after 2.5s and allow progressive loading
        const timeout = setTimeout(() => {
            if (mounted) {
                setImages(loadedImages);
                setLoading(false);
            }
        }, 2500);

        return () => {
            mounted = false;
            clearTimeout(timeout);
        };
    }, []);

    // Draw to canvas loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const context = canvas.getContext('2d');

        // Resize canvas to fit window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Draw immediately after resize
            renderFrame(context, frameIndexRef.current, canvas.width, canvas.height);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Animation loop
        const updateFrame = () => {
            renderFrame(context, frameIndexRef.current, canvas.width, canvas.height);
            requestRef.current = requestAnimationFrame(updateFrame);
        };

        requestRef.current = requestAnimationFrame(updateFrame);

        // Update the current frame index when scrolling
        const unsubscribe = currentFrame.on("change", (latest) => {
            frameIndexRef.current = Math.floor(latest);
        });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            unsubscribe();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [images, currentFrame]);

    const renderFrame = (ctx, frameIndex, width, height) => {
        const index = Math.max(0, Math.min(frameIndex, FRAME_COUNT - 1));
        const img = images[index];

        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.clearRect(0, 0, width, height);

        // Calculate 'cover' fill
        const scale = Math.max(width / FRAME_WIDTH, height / FRAME_HEIGHT);
        const dWidth = FRAME_WIDTH * scale;
        const dHeight = FRAME_HEIGHT * scale;
        const dx = (width - dWidth) / 2;
        const dy = (height - dHeight) / 2;

        ctx.drawImage(
            img,
            0, 0, FRAME_WIDTH, FRAME_HEIGHT, // Source
            dx, dy, dWidth, dHeight          // Destination
        );
    };

    return (
        <div ref={containerRef} className={`model-showcase-container ${loading ? 'loading' : ''}`}>
            <div className="sticky-wrapper">
                <canvas ref={canvasRef} className="showcase-canvas" />
                <div className="showcase-overlay"></div>
                <div className="gradient-overlay-showcase"></div>

                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-bg">
                            <img src="/assets/hero-bg.png" alt="Loading Background" />
                            <div className="loading-gradient"></div>
                        </div>

                        <div className="loading-content">
                            <div className="spinner"></div>
                        </div>
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
                </div>
            </div>
        </div>
    );
};

export default ModelShowcase;
