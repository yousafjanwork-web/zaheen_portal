import en from "./en.json";
import ur from "./ur.json";

type Lang = "en" | "ur";

const translations = {
  en,
  ur
};

const savedLang = localStorage.getItem("lang") as Lang | null;

let currentLang: Lang = savedLang || "en";

/* Apply direction on startup */
if (currentLang === "ur") {
  document.documentElement.dir = "rtl";
} else {
  document.documentElement.dir = "ltr";
}

/* Change language */

export const setLanguage = (lang: Lang) => {

  currentLang = lang;

  localStorage.setItem("lang", lang);

  if (lang === "ur") {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }

  window.location.reload();
};

/* Get current language */

export const getLanguage = (): Lang => {
  return currentLang;
};

/* Translate */

export const t = (path: string) => {

  const keys = path.split(".");
  let value: any = translations[currentLang];

  for (const key of keys) {
    value = value?.[key];
  }

  return value || path;
};