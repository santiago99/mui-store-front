import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ChevronRight } from "lucide-react";

import { useAppSelector } from "@/app/hooks";
import { cn } from "@/lib/utils";

export default function Breadcrumb() {
  const navigation = useAppSelector((state) => state.navigation);
  const { t } = useTranslation();

  // Don't show breadcrumb if there are no breadcrumbs or on frontpage
  if (!navigation.breadcrumbs || navigation.breadcrumbs.length === 0) {
    return null;
  }

  // Always prepend homepage breadcrumb
  const breadcrumbsWithHome = [
    { path: "/", label: t("breadcrumb.home") },
    ...navigation.breadcrumbs,
  ];

  return (
    <nav aria-label="breadcrumb" className="my-2">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {breadcrumbsWithHome.map((breadcrumb, index) => {
          const isLast = index === breadcrumbsWithHome.length - 1;
          const isHome = breadcrumb.path === "/";

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              {breadcrumb.path ? (
                <Link
                  to={breadcrumb.path}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors hover:text-foreground",
                    isLast && "font-medium text-foreground",
                    !isLast && "hover:underline"
                  )}
                >
                  {isHome && <Home className="h-4 w-4" />}
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className={cn("font-medium text-foreground")}>
                  {breadcrumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
