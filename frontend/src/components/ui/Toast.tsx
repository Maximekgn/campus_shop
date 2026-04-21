"use client"

import * as React from "react"
import { Toast as ToastPr, Toaster as ToasterPr } from "react-hot-toast"

import { cn } from "@/lib/utils"

const Toast = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ToastPr>
>(({ className, ...props }, ref) => {
  return (
    <ToastPr
      ref={ref}
      className={cn(
        "group pointer-coarse:cursor-pointer toast group-[.toast]:bg-white group-[.toast]:text-slate-950",
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toaster"

const Toaster = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ToasterPr>
>(({ className, ...props }, ref) => {
  return (
    <ToasterPr
      ref={ref}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toast]:bg-white group-[.toast]:text-slate-950",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500",
        },
      }}
      {...props}
    />
  )
})
Toaster.displayName = "Toaster"

export { Toast, Toaster }