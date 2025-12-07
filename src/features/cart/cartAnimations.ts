// Bounce/shake animation for cart icon
// This animation is defined in CSS (index.css) as @keyframes cart-bounce
// and can be used with the class "animate-cart-bounce"

// Animation styles for cart icon
export const getCartIconAnimationStyles = (trigger: number) => ({
  animation: trigger > 0 ? "cart-bounce 0.3s ease-in-out" : "none",
  transition: "color 0.2s ease-in-out",
});
