import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import MessageCard from "./components/MessageCard";
import FloatingHearts from "./components/FloatingHearts";
import "./App.css";

// Add a loading state to manage initial rendering
const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid rgba(255, 105, 180, 0.1);
  border-top-color: #ff69b4;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

// Adding decorative elements
const DecorationCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.3) 0%, rgba(255, 105, 180, 0) 70%);
  filter: blur(8px);
  z-index: 1;
  will-change: opacity;
`;

const StarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: white;
  border-radius: 50%;
  opacity: ${(props) => props.opacity};
  animation: twinkle ${(props) => props.duration}s ease-in-out infinite;
  will-change: opacity, transform;

  @keyframes twinkle {
    0%,
    100% {
      opacity: ${(props) => props.opacity};
      transform: scale(1);
    }
    50% {
      opacity: ${(props) => props.opacity * 0.5};
      transform: scale(0.8);
    }
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(1.8rem, 5vw, 3rem);
  color: #ff69b4;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.7), 0 0 20px rgba(255, 105, 180, 0.5);
  margin-bottom: 20px;
  margin-top: 20px;
  z-index: 10;
  font-family: "Pacifico", cursive;
  letter-spacing: 1px;
  text-align: center;
  padding: 0 15px;
  width: 100%;
  max-width: 90vw;
  will-change: opacity, transform;

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.2rem, 3.5vw, 1.8rem);
    letter-spacing: 0.5px;
  }
`;

const PuppyContainer = styled(motion.div)`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  margin-bottom: 20px;
  position: relative;
  will-change: opacity, transform;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 10px;
    background: radial-gradient(ellipse at center, rgba(255, 105, 180, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    filter: blur(5px);
  }
`;

function App() {
  const modelViewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(0);
  const [totalAssets, setTotalAssets] = useState(1); // Start with 1 for the model

  // Generate stars once
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      // Reduced count for better performance
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.5 + 0.3;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 2;

      return <Star key={i} size={size} opacity={opacity} duration={duration} style={{ top: `${top}%`, left: `${left}%` }} />;
    });
  }, []);

  // Decorative circles
  const circles = useMemo(
    () => [
      { size: 300, x: "10%", y: "20%", delay: 0.2 },
      { size: 200, x: "85%", y: "15%", delay: 0.4 },
      { size: 250, x: "75%", y: "80%", delay: 0.6 },
      { size: 180, x: "15%", y: "75%", delay: 0.8 },
    ],
    []
  );

  const imgs = useMemo(() => ["/img/anh1.jpg", "/img/anh2.jpg", "/img/anh3.jpg", "/img/anh4.jpg", "/img/anh5.jpg", "/img/anh6.jpg", "/img/anh7.jpg", "/img/anh8.jpg"], []); // Reduced number of images

  useEffect(() => {
    // Preload 3D model
    if (window.document) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      script.type = "module";
      document.head.appendChild(script);

      script.onload = () => {
        setAssetsLoaded((prev) => prev + 1);
      };

      // Preload images
      setTotalAssets(1 + imgs.length); // Model + images

      imgs.forEach((imgSrc) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          setAssetsLoaded((prev) => prev + 1);
        };
        img.onerror = () => {
          setAssetsLoaded((prev) => prev + 1); // Count errors as loaded to avoid hanging
        };
      });
    }

    // Finish loading after max 3 seconds regardless of asset loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [imgs]);

  // Check if all assets are loaded
  useEffect(() => {
    if (assetsLoaded >= totalAssets) {
      // Give a slight delay for smoother transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [assetsLoaded, totalAssets]);

  // Function to scroll to bottom of page
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // Add a new useEffect to scroll to bottom once loading is complete
  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to ensure all components are rendered
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
      </AnimatePresence>

      <AppContainer>
        {/* Background stars */}
        <StarContainer>{stars}</StarContainer>

        {/* Decorative circles with staggered animations */}
        {circles.map((circle, index) => (
          <DecorationCircle
            key={index}
            style={{
              width: circle.size,
              height: circle.size,
              left: circle.x,
              top: circle.y,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: circle.delay, duration: 1.2 }}
          />
        ))}

        {/* Reduce count for better performance */}
        <FloatingHearts count={10} images={imgs} />

        <Title initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          Chúc mừng ngày 8/3, Hoàng Mỹ xinh yêu cụa anhhh !!!
        </Title>

        <PuppyContainer initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}>
          <model-viewer
            ref={modelViewerRef}
            src="/toon_cute_dog.glb"
            alt="A cute cartoon dog"
            auto-rotate
            camera-controls
            camera-orbit="0deg 10deg 2m"
            min-camera-orbit="auto auto auto"
            max-camera-orbit="auto auto auto"
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            loading="eager"
            reveal="auto"
            ar
            ar-modes="webxr scene-viewer quick-look"
            style={{ width: "100%", height: "90%" }}
          ></model-viewer>
        </PuppyContainer>

        <MessageCard marginBottom={true} />
      </AppContainer>
    </>
  );
}

export default App;
