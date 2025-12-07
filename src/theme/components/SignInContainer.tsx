import * as React from "react";
import { cn } from "@/lib/utils";

interface SignInContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SignInContainer = React.forwardRef<
  HTMLDivElement,
  SignInContainerProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 sm:p-8 flex items-center justify-center min-h-screen w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SignInContainer.displayName = "SignInContainer";
