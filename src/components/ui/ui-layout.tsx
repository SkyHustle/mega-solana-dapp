"use client";
import { ReactNode } from "react";
import { NavBar } from "./navbar";

export function UiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <NavBar />
      {children}
    </div>
  );
}
