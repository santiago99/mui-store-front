import { RouterProvider } from "react-router-dom";
import { router } from "@/router/routes";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";

function App() {
  // Initialize auth on app load to restore session from cookies
  useGetCurrentUserQuery(undefined, {
    // Skip the query if we're not in a browser environment
    skip: typeof window === "undefined",
  });

  return <RouterProvider router={router} />;
}

export default App;
