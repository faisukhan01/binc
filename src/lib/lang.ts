"use client";

import { create } from "zustand";
import { useEffect } from "react";

export type Lang = "en" | "ur";

const LANG_KEY = "binc-lang";

/** Apply lang/dir to <html> so CSS + RTL layout follow. */
function applyLangDom(lang: Lang) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.lang = lang === "ur" ? "ur" : "en";
  html.dir = lang === "ur" ? "rtl" : "ltr";
  html.dataset.lang = lang;
}

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

export const useLang = create<LangState>((set, get) => ({
  lang: "en",
  setLang: (lang) => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* storage unavailable */
    }
    applyLangDom(lang);
    set({ lang });
  },
  toggle: () => get().setLang(get().lang === "ur" ? "en" : "ur"),
}));

/** Boot: restore saved language after mount (client only). */
export function useLangBoot() {
  const setLang = useLang((s) => s.setLang);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch {
      /* ignore */
    }
    if (saved === "ur") setLang("ur");
  }, [setLang]);
}

/** Convenience hook: current language + strings accessor. */
export function useT() {
  const lang = useLang((s) => s.lang);
  return { lang, isUr: lang === "ur" };
}
