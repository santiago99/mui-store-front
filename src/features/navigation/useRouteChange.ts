import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPath, type NavigationState } from "./navigationSlice";
//import { fetchCategoryById } from "../store/categoriesSlice";
//import { fetchProductById, clearProduct } from "../store/productsSlice";

export function useRouteChange() {
  const location = useLocation();
  const dispatch = useDispatch();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    //dispatch(setPath(location.pathname));

    const categoryMatch = matchPath("/category/:categoryId", location.pathname);

    const navData: NavigationState = {
      currentPath: location.pathname,
      route: "default",
      data: {},
    };

    if (categoryMatch) {
      const { categoryId } = categoryMatch.params;
      const categoryIdNumber = parseInt(categoryId!, 10);

      if (!isNaN(categoryIdNumber)) {
        navData.route = "category";
        navData.data = {
          categoryId: categoryIdNumber,
        };
      }
    }

    dispatch(setPath(navData));
  }, [location, dispatch]);
}
