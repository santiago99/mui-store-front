import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "@/features/auth/LoginPage";
import { Frontpage } from "@/features/frontpage/Frontpage";
import DefaultLayout from "@/theme/layouts/DefaultLayout";
import ProductsPage from "@/features/product/ProductsPage";

import PrivateRoute from "./PrivateRoute";

//import { useGetCurrentUserQuery } from '@/features/users/usersSlice'

// const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
//   const authState = useAppSelector(selectAuthState);

//   return authState !== "guest" ? children : <Navigate to="/" />;
// };

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <Frontpage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      /* {
        path: "cart",
        element: <Cart />,
      }, */
      /* {
        path: "product/:productId",
        element: <Product />,
      }, */
      {
        path: "user/login",
        element: <LoginPage />,
      },
    ],
  },
  // private routes
  {
    path: "/user/*",
    element: (
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>
    ),
    children: [
      /* {
        path: "orders",
        element: <Dashboard />,
      }, */
      /* {
        path: "polls",
        element: <PollsPage />,
      }, */
      /* {
        path: 'news/:newsId"',
        element: <NewsPage />,
      },
      {
        path: 'pages/:pageId"',
        element: <StaticPage />,
      }, */
    ],
  },
]);
