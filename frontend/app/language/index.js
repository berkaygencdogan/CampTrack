import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "./translations";

const i18n = new I18n(translations);

// Desteklediğin diller:
const supportedLocales = [
  "en",
  "tr",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "ru",
  "ar",
  "zh",
  "ja",
  "ko",
];

// Cihaz dili → "tr-TR" → "tr"
const deviceLocale = Localization.getLocales()[0].languageCode;

// Eğer destekleniyorsa deviceLocale, değilse "en"
i18n.locale = supportedLocales.includes(deviceLocale) ? deviceLocale : "en";

i18n.enableFallback = true;

export default i18n;
