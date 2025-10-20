import { useAppSelector } from "@/app/hooks";
import { selectAuthState } from "@/features/auth/authSlice";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const authState = useAppSelector(selectAuthState);

  return authState !== "guest" ? children : <Navigate to="/user/login" />;
};

export default PrivateRoute;
