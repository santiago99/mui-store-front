import { Card } from "@/components/ui/card";

export default function ProductCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="h-52 w-full bg-muted animate-pulse" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
      </div>
    </Card>
  );
}
