"use client";
import { ReactNode, Suspense } from "react";
import { NavBar } from "./navbar";

export function UiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <NavBar />

      <Suspense
        fallback={
          <div className="text-center my-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + "..." + str.substring(str.length - len, str.length);
  }
  return str;
}
