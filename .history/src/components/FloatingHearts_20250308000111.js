import React, { useState } from "react";
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

const FloatingImage = styled.img`
  position: fixed;
  bottom: -100px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: ${float} ${(props) => props.duration}s linear infinite;
  left: ${(props) => props.left}%;
  animation-delay: ${(props) => props.delay}s;
  z-index: 10;
  cursor: pointer;
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 100;
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

const FloatingHearts = ({ count = 15, images = [] }) => {
  const [popupImage, setPopupImage] = useState(null);

  const hearts = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 20 + 10;
    const colors = ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493", "#db7093"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 15;
    const delay = Math.random() * 10;

    return <Heart key={`heart-${i}`} size={size} color={color} left={left} duration={duration} delay={delay} />;
  });

  const floatingImages = images.map((src, i) => {
    const size = Math.random() * 20 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 15;
    const delay = Math.random() * 10;

    return <FloatingImage key={`image-${i}`} src={src} size={size} left={left} duration={duration} delay={delay} onClick={() => setPopupImage(src)} />;
  });

  return (
    <>
      {[...hearts, ...floatingImages]}
      {popupImage && (
        <>
          <Overlay onClick={() => setPopupImage(null)} />
          <Popup>
            <img src={popupImage} alt="Popup" style={{ width: "100%" }} />
          </Popup>
        </>
      )}
    </>
  );
};

export default FloatingHearts;
