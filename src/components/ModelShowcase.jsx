
import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import './ModelShowcase.css';

const ModelShowcase = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [spriteSheet, setSpriteSheet] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sprite configuration
    const FRAME_COUNT = 192;
    const COLS = 12;
    const FRAME_WIDTH = 1280;
    const FRAME_HEIGHT = 720;

    // Scroll progress for the entire section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Transform scroll progress to frame index
    const currentFrame = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Load sprite sheet
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/model-showcase/sprite.jpg';
        img.onload = () => {
            setSpriteSheet(img);
            setLoading(false);
        };
        img.onerror = () => {
            console.error("Failed to load sprite sheet");
            setLoading(false); // Stop spinner even if failed
        };
    }, []);

    // Draw to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !spriteSheet) return;

        const context = canvas.getContext('2d');

        // Resize canvas to fit window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Draw immediately after resize
            const index = Math.floor(currentFrame.get());
            renderFrame(context, index, canvas.width, canvas.height);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Animation loop
        const unsubscribe = currentFrame.on("change", (latest) => {
            const index = Math.floor(latest);
            renderFrame(context, index, canvas.width, canvas.height);
        });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            unsubscribe();
        };
    }, [spriteSheet, currentFrame]);

    const renderFrame = (ctx, frameIndex, width, height) => {
        if (!spriteSheet) return;

        // Clamp index
        const index = Math.max(0, Math.min(Math.floor(frameIndex), FRAME_COUNT - 1));

        // Calculate source position
        const col = index % COLS;
        const row = Math.floor(index / COLS);
        const sx = col * FRAME_WIDTH;
        const sy = row * FRAME_HEIGHT;

        ctx.clearRect(0, 0, width, height);

        // Calculate 'cover' fill
        // We want to scale the 640x360 frame to cover the screen
        const scale = Math.max(width / FRAME_WIDTH, height / FRAME_HEIGHT);
        const dWidth = FRAME_WIDTH * scale;
        const dHeight = FRAME_HEIGHT * scale;
        const dx = (width - dWidth) / 2;
        const dy = (height - dHeight) / 2;

        // Draw from sprite
        ctx.drawImage(
            spriteSheet,
            sx, sy, FRAME_WIDTH, FRAME_HEIGHT, // Source
            dx, dy, dWidth, dHeight            // Destination
        );
    };

    return (
        <div ref={containerRef} className={`model-showcase-container ${loading ? 'loading' : ''}`}>
            <div className="sticky-wrapper">
                <canvas ref={canvasRef} className="showcase-canvas" />
                <div className="showcase-overlay"></div>

                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-bg">
                            <img src="/assets/hero-bg.png" alt="Loading Background" />
                            <div className="loading-gradient"></div>
                        </div>

                        <div className="loading-content">
                            <div className="spinner"></div>
                            {/* <p>Initializing M Performance...</p> */}
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
