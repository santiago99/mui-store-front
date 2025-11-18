import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "@/router/routes";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
import { useAppDispatch } from "@/app/hooks";
import { initializeLocalCart } from "@/features/cart/cartSlice";
import { prefetchCurrentUser } from "@/features/auth/authApi";

function App() {
  const dispatch = useAppDispatch();

  // Initialize auth on app load to restore session from cookies
  useGetCurrentUserQuery(undefined, {
    // Skip the query if we're not in a browser environment
    skip: typeof window === "undefined",
  });

  // Initialize local cart from localStorage
  // Get current user data
  useEffect(() => {
    dispatch(initializeLocalCart());
    dispatch(prefetchCurrentUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
