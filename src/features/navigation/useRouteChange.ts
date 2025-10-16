import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { useDispatch } from "react-redux";
//import { setPath } from "../store/navigationSlice";
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

    //if (productMatch) {
    //const { categoryId, productId } = productMatch.params;
    // dispatch(
    //   fetchProductById({ categoryId: categoryId!, productId: productId! })
    // );
    if (categoryMatch) {
      const { categoryId } = categoryMatch.params;
      console.log({
        type: "category",
        id: categoryId,
      });
      //dispatch(fetchCategoryById(categoryId!));
      //dispatch(clearProduct());
    } else {
      console.log({
        type: "front",
        id: null,
      });
      //dispatch(clearProduct());
    }
  }, [location, dispatch]);
}
