import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/ResetPasswordPage";
import { ProfilePage } from "@/features/auth/ProfilePage";
import { Frontpage } from "@/features/frontpage/Frontpage";
import DefaultLayout from "@/theme/layouts/DefaultLayout";
import CategoryPage from "@/features/category/CategoryPage";
import ProductPage from "@/features/product/ProductPage";
import CartPage from "@/features/cart/CartPage";
import MergeCartPage from "@/features/cart/MergeCartPage";
// import { categoryPreloader } from "@/features/category/categoryPreloader";

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
      // {
      //   path: "products",
      //   element: <ProductsPage />,
      // },
      {
        path: "category/:categoryId",
        element: <CategoryPage />,
        //loader: categoryPreloader,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "merge-cart",
        element: <MergeCartPage />,
      },
      {
        path: "product/:productId",
        element: <ProductPage />,
      },
      {
        path: "user/login",
        element: <LoginPage />,
      },
      {
        path: "user/register",
        element: <RegisterPage />,
      },
      {
        path: "user/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "user/reset-password",
        element: <ResetPasswordPage />,
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
      {
        path: "profile",
        element: <ProfilePage />,
      },
      /* {
        path: "orders",
        element: <Dashboard />,
      }, */
    ],
  },
]);
