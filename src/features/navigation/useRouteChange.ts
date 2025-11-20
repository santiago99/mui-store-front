import { useEffect, useRef } from "react";
import {
  useLocation,
  matchPath,
  useMatches,
  type UIMatch,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setPath, type NavigationState } from "./navigationSlice";
import { useGetProductQuery, useGetCategoryQuery } from "@/app/apiSlice";

interface RouteHandle {
  breadcrumb?: string;
}

export function useRouteChange() {
  const location = useLocation();
  const matches = useMatches();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prevPath = useRef<string | null>(null);

  const categoryMatch = matchPath("/category/:categoryId", location.pathname);
  const productMatch = matchPath("/product/:productId", location.pathname);

  // Get product data if we're on a product route
  const productId = productMatch?.params.productId;
  const { data: product, isLoading: isLoadingProduct } = useGetProductQuery(
    productId!,
    {
      skip: !productId,
    }
  );

  // Verify product data matches current productId to avoid stale data
  const isValidProduct = product && product.id === productId;

  // Determine categoryId: from category route, or from product's categoryId
  let categoryId: number | null = null;
  if (categoryMatch) {
    const categoryIdParam = categoryMatch.params.categoryId;
    if (categoryIdParam) {
      const parsed = parseInt(categoryIdParam, 10);
      if (!isNaN(parsed)) {
        categoryId = parsed;
      }
    }
  } else if (isValidProduct && product.categoryId) {
    const parsed =
      typeof product.categoryId === "string"
        ? parseInt(product.categoryId, 10)
        : product.categoryId;
    if (!isNaN(parsed)) {
      categoryId = parsed;
    }
  }

  // Get category data if we have a categoryId
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryQuery(
    categoryId!,
    {
      skip: !categoryId,
    }
  );

  // Verify category data matches current categoryId to avoid stale data
  const isValidCategory =
    category &&
    categoryId !== null &&
    (typeof category.id === "string"
      ? parseInt(category.id, 10)
      : category.id) === categoryId;

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    const navData: NavigationState = {
      currentPath: location.pathname,
      route: "static",
      data: {},
      breadcrumbs: [],
      ancestors: [],
    };

    // Handle frontpage
    if (location.pathname === "/") {
      navData.route = "frontpage";
      navData.breadcrumbs = [];
      dispatch(setPath(navData));
      return;
    }

    // Handle dynamic routes (category/product)
    if (categoryMatch) {
      const { categoryId: catId } = categoryMatch.params;
      const categoryIdNumber = parseInt(catId!, 10);

      // Only set navigation state if we have valid category data matching the route
      if (!isNaN(categoryIdNumber) && isValidCategory && !isLoadingCategory) {
        navData.route = "category";
        navData.data = {
          categoryId: categoryIdNumber,
        };
        navData.ancestors = (category!.ancestors || []).map((ancestor) => ({
          id: ancestor.id,
          name: ancestor.name,
        }));

        // Build breadcrumbs for category route
        navData.breadcrumbs = [
          { path: "/", label: t("breadcrumb.home") },
          ...(category!.ancestors || []).map((ancestor) => ({
            path: `/category/${ancestor.id}`,
            label: ancestor.name,
          })),
          { label: category!.name },
        ];
        dispatch(setPath(navData));
        return;
      }
    } else if (productMatch && productId) {
      // Only set navigation state if we have valid product and category data matching the route
      if (
        isValidProduct &&
        isValidCategory &&
        !isLoadingProduct &&
        !isLoadingCategory
      ) {
        navData.route = "product";
        navData.data = {
          productId: productId,
          categoryId: categoryId!,
        };
        navData.ancestors = (category!.ancestors || []).map((ancestor) => ({
          id: ancestor.id,
          name: ancestor.name,
        }));

        // Build breadcrumbs for product route
        navData.breadcrumbs = [
          { path: "/", label: t("breadcrumb.home") },
          ...(category!.ancestors || []).map((ancestor) => ({
            path: `/category/${ancestor.id}`,
            label: ancestor.name,
          })),
          { path: `/category/${category!.id}`, label: category!.name },
          { label: product!.title },
        ];
        dispatch(setPath(navData));
        return;
      }
      // If we're on a product route but don't have valid data yet, don't update state
      return;
    } else {
      // Handle static routes - generate breadcrumbs from route handles
      const breadcrumbs: NavigationState["breadcrumbs"] = [
        { path: "/", label: t("breadcrumb.home") },
      ];

      // Process matches to build breadcrumbs
      matches.forEach((match: UIMatch) => {
        const handle = match.handle as RouteHandle | undefined;
        if (handle?.breadcrumb && handle.breadcrumb !== "dynamic") {
          // It's a translation key
          const label = t(handle.breadcrumb);
          // For static routes, we may not have a path, so check if match has pathname
          const path =
            match.pathname !== location.pathname ? match.pathname : undefined;
          breadcrumbs.push({
            ...(path && { path }),
            label,
          });
        }
      });

      navData.breadcrumbs = breadcrumbs;
      navData.route = "static";
      dispatch(setPath(navData));
    }
  }, [
    location,
    dispatch,
    matches,
    category,
    product,
    productId,
    categoryId,
    categoryMatch,
    productMatch,
    isValidProduct,
    isValidCategory,
    isLoadingProduct,
    isLoadingCategory,
    t,
  ]);
}
