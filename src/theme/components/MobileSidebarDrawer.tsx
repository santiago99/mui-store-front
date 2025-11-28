import { Drawer, DrawerContent } from "@/components/ui/drawer";
import CategoriesTree from "@/features/category/components/CategoriesTree";
import { layoutMath } from "../themePrimitives";

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebarDrawer({
  open,
  onClose,
}: MobileSidebarDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
      side="left"
    >
      <DrawerContent
        side="left"
        className="block sm:hidden box-border"
        style={{ width: `${layoutMath.sidebarWidth}px` }}
      >
        <div className="h-full flex flex-col">
          <CategoriesTree onClose={onClose} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
