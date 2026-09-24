"use client";

import { useLangBoot } from "@/lib/lang";

/** Restores the visitor's saved language (en/ur) after mount and applies
 *  html[lang] / html[dir] so RTL typography + layout follow. Renders nothing. */
export function LangBoot() {
  useLangBoot();
  return null;
}
