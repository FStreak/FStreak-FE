import * as React from "react";
import { cn } from "@/lib/utils";

/* 🌟 Base Card Container */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "relative flex flex-col rounded-2xl border border-orange-100/60 dark:border-gray-800",
        "bg-white/90 dark:bg-gray-900/70 text-gray-800 dark:text-gray-100",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "backdrop-blur-sm hover:-translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

/* 🧭 Header */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col justify-start gap-1 px-6 pt-6 pb-3 border-b border-orange-50 dark:border-gray-800",
        className
      )}
      {...props}
    />
  );
}

/* 🏷️ Title */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold tracking-tight bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  );
}

/* 📜 Description */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-sm text-gray-500 dark:text-gray-400 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

/* ⚙️ Action (optional) */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto flex items-center px-6 py-3", className)}
      {...props}
    />
  );
}

/* 📦 Content */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 py-4 space-y-3", className)}
      {...props}
    />
  );
}

/* 🦶 Footer */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between px-6 py-4 border-t border-orange-50 dark:border-gray-800",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
