import React, { useState, useCallback, memo, useMemo } from "react";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
`;

const Heart = styled.div`
  position: fixed;
  bottom: -100px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  animation: ${float} ${(props) => props.duration}s linear infinite;
  left: ${(props) => props.left}%;
  animation-delay: ${(props) => props.delay}s;
  z-index: 10;
  will-change: transform;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: inherit;
    border-radius: 50%;
  }

  &:before {
    transform: translateX(-50%);
  }

  &:after {
    transform: translateY(-50%);
  }
`;

// Optimized heart shape with better performance
const FloatingImage = styled.div`
  position: fixed;
  bottom: -100px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: ${float} ${(props) => props.duration}s linear infinite;
  left: ${(props) => props.left}%;
  animation-delay: ${(props) => props.delay}s;
  z-index: 10;
  cursor: pointer;
  will-change: transform;

  /* Heart shape styling */
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    width: 52%;
    height: 80%;
    background: url(${(props) => props.src}) center center/cover;
    border-radius: 50% 50% 0 0;
    backface-visibility: hidden;
  }

  &:before {
    left: 50%;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }

  &:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  z-index: 100;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  transition: all 0.3s ease-in-out;
`;

const PopupImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  margin: 0 auto;
`;

// Memoized heart component
const MemoizedHeart = memo(({ size, color, left, duration, delay }) => <Heart size={size} color={color} left={left} duration={duration} delay={delay} />);

// Memoized floating image component
const MemoizedFloatingImage = memo(({ src, size, left, duration, delay, onClick }) => <FloatingImage src={src} size={size} left={left} duration={duration} delay={delay} onClick={onClick} />);

const FloatingHearts = ({ count = 15, images = [] }) => {
  const [popupImage, setPopupImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Prevent unnecessary re-renders when setting popup image
  const handleImageClick = useCallback((src) => {
    setIsImageLoaded(false);
    setPopupImage(src);
  }, []);

  // Close popup handler
  const handleClosePopup = useCallback(() => {
    setPopupImage(null);
  }, []);

  // Handle image load
  const handleImageLoad = useCallback((e) => {
    e.target.style.opacity = 1;
    setIsImageLoaded(true);
  }, []);

  // Generate hearts once with useMemo
  const hearts = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 20 + 10;
      const colors = ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493", "#db7093"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 10;

      return <MemoizedHeart key={`heart-${i}`} size={size} color={color} left={left} duration={duration} delay={delay} />;
    });
  }, [count]);

  // Generate floating images once with useMemo
  const floatingImages = useMemo(() => {
    return images.map((src, i) => {
      const size = Math.random() * 20 + 30;
      // More centered distribution
      const left = Math.random() * 60 + 20;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 10;

      return <MemoizedFloatingImage key={`image-${i}`} src={src} size={size} left={left} duration={duration} delay={delay} onClick={() => handleImageClick(src)} />;
    });
  }, [images, handleImageClick]);

  return (
    <>
      {[...hearts, ...floatingImages]}
      {popupImage && (
        <>
          <Overlay onClick={handleClosePopup} />
          <Popup>
            <PopupImage
              src={popupImage}
              alt="Popup"
              loading="eager"
              onLoad={handleImageLoad}
              style={{
                opacity: 0,
                transition: "opacity 0.3s",
                width: isImageLoaded ? "auto" : "300px",
                height: isImageLoaded ? "auto" : "300px",
              }}
            />
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                onClick={handleClosePopup}
                style={{
                  padding: "8px 16px",
                  background: "#ff69b4",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </Popup>
        </>
      )}
    </>
  );
};

export default memo(FloatingHearts);
