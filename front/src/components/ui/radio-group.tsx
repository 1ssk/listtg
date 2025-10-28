"use client";

import * as React from "react";
import { cn } from "./utils";

interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

function RadioGroup({
  className,
  value,
  onValueChange,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div
        role="radiogroup"
        className={cn("grid gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
}

function RadioGroupItem({
  className,
  value,
  id,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const checked = context.value === value;

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={(e) => {
        if (e.target.checked && context.onValueChange) {
          context.onValueChange(value);
        }
      }}
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-input transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem };
