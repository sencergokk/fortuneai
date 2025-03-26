"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

// Simply forward all props to NextThemesProvider without explicit typing
// Using React.ComponentProps makes TypeScript infer the correct types from NextThemesProvider
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
