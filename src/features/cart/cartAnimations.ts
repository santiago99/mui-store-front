import { keyframes } from "@emotion/react";

// Bounce/shake animation for cart icon
export const cartBounceAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  50% {
    transform: scale(1.05) rotate(5deg);
  }
  75% {
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

// Animation styles for cart icon
export const getCartIconAnimationStyles = (trigger: number) => ({
  animation: trigger > 0 ? `${cartBounceAnimation} 0.3s ease-in-out` : "none",
  transition: "color 0.2s ease-in-out",
});
