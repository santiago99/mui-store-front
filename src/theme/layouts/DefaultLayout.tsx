import { Outlet } from "react-router-dom";

import Sidebar from "@/theme/components/Sidebar";
import Navbar from "@/theme/components/Navbar";
import Breadcrumb from "@/theme/components/Breadcrumb";
import { useRouteChange } from "@/features/navigation/useRouteChange";

import { layoutMath } from "@/lib/layout";

export default function DefaultLayout() {
  useRouteChange();

  return (
    <div
      className="flex mt-16"
      style={
        {
          "--sidebar-width": `${layoutMath.sidebarWidth}px`,
        } as React.CSSProperties
      }
    >
      <Navbar />

      <main
        className="flex-grow w-full sm:w-[calc(100%-var(--sidebar-width))] mx-auto flex flex-row"
        style={{
          maxWidth: `${layoutMath.maxWidth}px`,
        }}
      >
        <Sidebar />
        <div className="w-full px-2">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
