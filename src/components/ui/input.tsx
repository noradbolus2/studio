import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Check if placeholder_en or placeholder_hi exist and apply them if needed.
    // This is a workaround for React's default typings not including custom props.
    const customProps = props as any;
    const placeholder = customProps.placeholder_en || customProps.placeholder_hi || props.placeholder;

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
        placeholder={placeholder}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
