"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

type PlacementOptions = "top" | "bottom" | "left" | "right";

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-card px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TooltipProps = {
  children: React.ReactNode;
  title: string | undefined;
  placement?: PlacementOptions;
  className?: string;
};

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, title, placement, className }, ref) => {
    return (
      <TooltipPrimitive.Provider delayDuration={100}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            {children}
          </TooltipPrimitive.Trigger>
          {title && title.trim() !== "" && (
            <TooltipContent
              side={placement}
              sideOffset={4}
              ref={ref}
              className={className}
            >
              {title}
            </TooltipContent>
          )}
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }
);
Tooltip.displayName = "Tooltip";

export default Tooltip;
