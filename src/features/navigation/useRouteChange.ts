import { useEffect /*, useRef */ } from "react";
import {
  useLocation,
  useParams,
  //matchPath,
  useMatches,
  type UIMatch,
} from "react-router-dom";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectCategoryAncestors } from "@/features/category/categoriesSlice";
import { useGetCategoryQuery, useGetProductQuery } from "@/app/apiSlice";
import {
  setNavigationState,
  type NavigationState,
  type BreadcrumbItem,
} from "./navigationSlice";

interface RouteHandle {
  breadcrumb?: string;
  path?: string;
}

const extractStaticBreadcrumb = (match: UIMatch, t: TFunction) => {
  const handle = match.handle as RouteHandle | undefined;
  if (!handle) return null;

  const bc = handle.breadcrumb;
  if (!bc) return null;

  if (typeof bc === "string" && bc !== "dynamic") {
    return { label: t(bc), path: "path" in handle ? handle.path : undefined };
  }
  // dynamic routes handled later
  return null;
};

export function useRouteChange() {
  console.log("useRouteChange hook");
  const location = useLocation();
  const matches = useMatches();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  //const prevPath = useRef<string | null>(null);
  let categoryId = null;
  let productId = null;
  const isDynamicRoute = matches.some(
    (match) => (match.handle as RouteHandle)?.breadcrumb === "dynamic"
  );

  if (isDynamicRoute) {
    console.log("dynamic route");

    if (params.categoryId) {
      categoryId = parseInt(params.categoryId);
      console.log("categoryId", categoryId);
    } else if (params.productId) {
      console.log("productId", params.productId);
      productId = params.productId;
    } else {
      console.error("No categoryId or productId found");
    }
  } else {
    console.log("static route");
    categoryId = null;
    productId = null;
  }

  const { data: product } = useGetProductQuery(productId!, {
    skip: !productId,
  });

  if (productId !== null && product && product.categoryId !== null) {
    console.log("product", product);
    categoryId = product.categoryId;
  }

  const { data: category } = useGetCategoryQuery(categoryId!, {
    skip: !categoryId,
  });

  const ancestors = useAppSelector((state) =>
    selectCategoryAncestors(state, categoryId)
  );
  console.log("ancestors", ancestors);

  useEffect(() => {
    console.log("useRouteChange effect");

    const navState: NavigationState = {
      currentPath: location.pathname,
      route: "static",
      data: {},
      breadcrumbs: [],
      ancestors: [],
    };

    // Fill nav stte data depending on the route
    if (location.pathname === "/") {
      console.log("frontpage route");
      navState.route = "frontpage";
    } else if (categoryId !== null) {
      // Dynamic route (category or product)
      console.log("dynamic route");
      navState.data.categoryId = categoryId;
      navState.ancestors = ancestors;

      // Create breadcrumbs from ancestors list
      const breadcrumbs: BreadcrumbItem[] = ancestors?.map((ancestor) => ({
        label: ancestor.name,
        path: `/category/${ancestor.id}`,
      }));

      if (product !== undefined) {
        // Product route
        console.log("product route");
        navState.route = "product";
        navState.data.productId = product.id;

        // Add category to breadcrumbs
        breadcrumbs.push({
          label: category?.name || "",
          path: `/category/${category?.id}`,
        });
        // Add product to breadcrumbs
        breadcrumbs.push({
          label: product.title,
        });
      } else {
        // Category route
        console.log("category route");
        navState.route = "category";
        // Add category to breadcrumbs (last in the list without path)
        breadcrumbs.push({
          label: category?.name || "",
        });
      }
      navState.breadcrumbs = breadcrumbs;
      //console.log("ancestors", ancestors);
    } else {
      const breadcrumbs = matches
        .map((match) => extractStaticBreadcrumb(match, t))
        .filter(Boolean) as BreadcrumbItem[];

      console.log(breadcrumbs);
      navState.breadcrumbs = breadcrumbs;
    }

    dispatch(setNavigationState(navState));
  }, [
    location,
    params,
    matches,
    t,
    categoryId,
    product,
    category,
    ancestors,
    dispatch,
  ]);
}
