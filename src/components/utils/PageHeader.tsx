import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-h-12 bg-page p-3 border-b-[1px] border-card/30 text-primary shadow-md z-40",
        className
      )}
    >
      {children}
    </div>
  );
}
