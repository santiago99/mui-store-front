import * as React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useGetCategoriesTreeQuery } from "@/app/apiSlice";
import type { Category } from "@/features/category/categoryApi";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function CategoriesMegamenu() {
  const { data: categories, isLoading } = useGetCategoriesTreeQuery();
  const location = useLocation();

  if (isLoading || !categories) {
    return null;
  }

  const renderCategoryContent = (category: Category) => {
    if (!category.children || category.children.length === 0) {
      return null;
    }

    return (
      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px]">
        {category.children.map((child: Category) => (
          <CategoryLink
            key={child.id}
            category={child}
            href={`/category/${child.id}`}
            isActive={location.pathname === `/category/${child.id}`}
          />
        ))}
      </div>
    );
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {categories.map((category: Category) => {
          const hasChildren = category.children && category.children.length > 0;
          const isActive = location.pathname === `/category/${category.id}`;

          if (hasChildren) {
            return (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger
                  className={cn(isActive && "bg-accent text-accent-foreground")}
                >
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {renderCategoryContent(category)}
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          } else {
            return (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <RouterLink to={`/category/${category.id}`}>
                    {category.name}
                  </RouterLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function CategoryLink({
  category,
  href,
  isActive,
}: {
  category: Category;
  href: string;
  isActive: boolean;
}) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <NavigationMenuLink asChild>
      <RouterLink
        to={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <div className="text-sm font-medium leading-none">{category.name}</div>
        {category.description && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {category.description}
          </p>
        )}
        {hasChildren && category.children && (
          <div className="mt-2 space-y-1">
            {category.children.map((child: Category) => (
              <CategoryLink
                key={child.id}
                category={child}
                href={`/category/${child.id}`}
                isActive={false}
              />
            ))}
          </div>
        )}
      </RouterLink>
    </NavigationMenuLink>
  );
}
