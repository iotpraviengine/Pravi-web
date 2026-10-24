"use client";

import { usePathname } from "next/navigation";
import { splitLocale } from "./config";
import { ui } from "./ui";

/** Language and language-free path of the current page, for client components. */
export function useLocalePath() {
  return splitLocale(usePathname() ?? "/");
}

/** Interface text in the current page's language. */
export function useUi() {
  return ui[useLocalePath().locale];
}
