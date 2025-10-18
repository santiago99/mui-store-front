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

  console.log({ location });
  
  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    //dispatch(setPath(location.pathname));

    
    const navData: NavigationState = {
      currentPath: location.pathname,
      route: "default",
      data: {},
    };

    const categoryMatch = matchPath("/category/:categoryId", location.pathname);
    const productMatch = matchPath("/product/:productId", location.pathname);

    if (categoryMatch) {
      const { categoryId } = categoryMatch.params;
      const categoryIdNumber = parseInt(categoryId!, 10);

      if (!isNaN(categoryIdNumber)) {
        navData.route = "category";
        navData.data = {
          categoryId: categoryIdNumber,
        };
      }
    } else if (productMatch) {
      const { productId } = productMatch.params;
      const productIdNumber = parseInt(productId!, 10);

      if (!isNaN(productIdNumber)) {
        navData.route = "product";
        navData.data = { productId: productIdNumber };
      }
    }

    console.log({ navData });

    dispatch(setPath(navData));
  }, [location, dispatch]);
}
