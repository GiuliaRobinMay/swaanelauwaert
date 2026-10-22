// Site-wide constants and per-language UI strings, taken verbatim from the
// original WordPress site (Twenty Twenty-Five + Polylang).
export const SITE_URL = "https://swaanelauwaert.com";
export const SITE_NAME = "Swaane Lauwaert";
export type Lang = "en" | "nl" | "fr";
export const LANGS: Lang[] = ["en", "nl", "fr"];
export const DEFAULT_LANG: Lang = "en";
export const TIME_ZONE = "Europe/Paris";
export const POSTS_PER_PAGE = 9;

export const HTML_LANG: Record<Lang, string> = { en: "en-GB", nl: "nl-BE", fr: "fr-FR" };
export const LOCALE: Record<Lang, string> = { en: "en-GB", nl: "nl-BE", fr: "fr-FR" };

export interface NavItem { label: string; href: string; children?: NavItem[] }

export const NAV: Record<Lang, NavItem[]> = {
  en: [
    { label: "Work with me", href: "/en/work-with-me/", children: [
      { label: "Retreats", href: "/en/rooted-rituals/" },
      { label: "The Eros Sanctuary", href: "/en/body-untamed/" },
      { label: "Flavours of Desire", href: "/en/flavours-of-desire/" },
      { label: "Sainte-Baume Guide", href: "/en/sainte-baume-guide/" },
    ] },
    { label: "Cookbook", href: "/en/cookbook/" },
    { label: "About me", href: "/en/about/" },
    { label: "The Journal", href: "/en/the-journal/" },
    { label: "Contact", href: "/en/#contact" },
  ],
  nl: [
    { label: "Werk met mij", href: "#", children: [
      { label: "Samenwerken", href: "/nl/samenwerken/" },
      { label: "Weekendretreat 27-28-29 november 2026: PLAY", href: "/nl/weekendretreat-27-28-29-november-2026-play/" },
      { label: "Maria Magdalena Retreat Zuid Frankrijk 2027", href: "/nl/maria-magdalena-retreat-zuid-frankrijk-2026/" },
      { label: "Flavours of Desire | Voeding, Verlangen & Zelfliefde", href: "/nl/flavours-of-desire-3/" },
      { label: "The Eros Sanctuary | Somatic Coaching & Sacred Sexuality", href: "/nl/the-eros-sanctuary/" },
      { label: "Sainte-Baume Gids", href: "/nl/sainte-baume-gids/" },
    ] },
    { label: "Kookboek", href: "/nl/kookboek/" },
    { label: "Over mij", href: "/nl/over-mij/" },
    { label: "The Journal", href: "/nl/journal/" },
    { label: "Contact", href: "/nl/#contact" },
  ],
  fr: [
    { label: "Accompagnement", href: "/fr/accompagnement/", children: [
      { label: "Retraites", href: "/fr/rituels-dancrage/" },
      { label: "Flavours of Desire", href: "/fr/flavours-of-desire-2/" },
      { label: "The Eros Sanctuary", href: "/fr/le-corps-libre/" },
      { label: "Guide Sainte-Baume", href: "/en/guide-sainte-baume/" },
    ] },
    { label: "Livre de Cuisine", href: "/fr/livre-de-cuisine/" },
    { label: "À propos de moi", href: "/fr/a-propos/" },
    { label: "Le Journal", href: "/fr/le-journal/" },
    { label: "Contact", href: "/fr/#contact" },
  ],
};

export const LANG_NAMES: Record<Lang, string> = { en: "English", nl: "Nederlands", fr: "Français" };
// Polylang's 16x11 flag PNGs, exactly as served by the original site.
export const FLAGS: Record<Lang, string> = {
  en: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAt1BMVEWSmb66z+18msdig8La3u+tYX9IaLc7W7BagbmcUW+kqMr/q6n+//+hsNv/lIr/jIGMnNLJyOP9/fyQttT/wb3/////aWn+YWF5kNT0oqz0i4ueqtIZNJjhvt/8gn//WVr/6+rN1+o9RKZwgcMPJpX/VFT9UEn+RUX8Ozv2Ly+FGzdYZrfU1e/8LS/lQkG/mbVUX60AE231hHtcdMb0mp3qYFTFwNu3w9prcqSURGNDaaIUMX5FNW5wYt7AAAAAjklEQVR4AR3HNUJEMQCGwf+L8RR36ajR+1+CEuvRdd8kK9MNAiRQNgJmVDAt1yM6kSzYVJUsPNssAk5N7ZFKjVNFAY4co6TAOI+kyQm+LFUEBEKKzuWUNB7rSH/rSnvOulOGk+QlXTBqMIrfYX4tSe2nP3iRa/KNK7uTmWJ5a9+erZ3d+18od4ytiZdvZyuKWy8o3UpTVAAAAABJRU5ErkJggg==",
  nl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAbFBMVEUAAADx7wD76QD29QryAgLrAAB5eXn8/G78+WH5U1NjY2NYWFj29k39/Uv6+kH29T31MDD0Jyf2QUFQUFD5+TT08TP1GxvmAAD39idwcHFHR0f18h3zDw8/Pz/HAAA2NjbV3wDi5ADg0gCmAAD9Uqo6AAAAX0lEQVR4AS3HtWFDURQD0KP7IMwLZP/Jfu/GzBYrICGnQmIiiGDf6ZG4R1ZFPBNzyvBbPL6WgfL37KmZehvmUfH4mGiO781J13S2b0VTt7+wRLzG80bF3ImPgH8ke4wzt8AM9KqOK78AAAAASUVORK5CYII=",
  fr: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAbFBMVEVzldTg4ODS0tLxDwDtAwDjAADD0uz39/fy8vL3k4nzgna4yOixwuXu7u7s6+zn5+fyd2rvcGPtZljYAABrjNCpvOHrWkxegsqfs93NAADpUUFRd8THAABBa7wnVbERRKa8vLyxsLCoqKigoKClCvcsAAAAXklEQVR4AS3JxUEAQQAEwZo13Mk/R9w5/7UERJCIGIgj5qfRJZEpPyNfCgJTjMR1eRRnJiExFJz5Mf1PokWr/UztIjRGQ3V486u0HO55m634U6dMcf0RNPfkVCTvKjO16xHA8miowAAAAABJRU5ErkJggg==",
};

export const UI = {
  en: { skip: "Skip to content", navAria: "Menu EN", openMenu: "Open menu", closeMenu: "Close menu", submenu: (l: string) => `${l} submenu`, languages: "Languages submenu",
    rights: "All Rights Reserved", copyright: "© Swaane Lauwaert", photography: "Photography", photoCredit: "Pinterest, Unsplash",
    journalIntro: "I write about what truly matters to me: family, my work, nature, art, Mary Magdalene, and the simple everyday life!", follow: "FOLLOW ME ON:",
    nextPage: "Next page", prevPage: "Previous page", paginationAria: "Pagination", writtenBy: "Written by", in: "in", on: "on", postNavAria: "Post navigation", comments: "Comments", morePosts: "More posts", discover: "Discover more from Swaane Lauwaert", subscribeText: "Subscribe to get the latest posts sent to your email.", subscribe: "Subscribe", likeShare: "Like and share", notFound: "Page not found", notFoundText: "The page you are looking for does not exist.", backHome: "Back to the homepage", category: "Category", tag: "Tag", author: "Author", month: "Month", year: "Year", noResults: "Sorry, nothing found yet.", protectedNotice: "This content is password protected. It is only available to participants of the programme." },
  nl: { skip: "Spring naar de inhoud", navAria: "Menu NL", openMenu: "Menu openen", closeMenu: "Menu sluiten", submenu: (l: string) => `${l} submenu`, languages: "Talen submenu",
    rights: "Alle Rechten Voorbehouden", copyright: "© Swaane Lauwaert", photography: "Fotografie", photoCredit: "Pinterest, Unsplash",
    journalIntro: "Ik schrijf over wat voor mij werkelijk van belang is: familie, mijn werk, de natuur, kunst, Maria Magdalena en het eenvoudige dagelijks leven!", follow: "VOLG ME OP:",
    nextPage: "Volgende pagina", prevPage: "Vorige pagina", paginationAria: "Paginering", writtenBy: "Geschreven door", in: "in", on: "op", postNavAria: "Bericht navigatie", comments: "Reacties", morePosts: "Meer berichten", discover: "Ontdek meer van Swaane Lauwaert", subscribeText: "Abonneer je om de nieuwste berichten in je e-mail te ontvangen.", subscribe: "Abonneren", likeShare: "Like and share", notFound: "Pagina niet gevonden", notFoundText: "De pagina die je zoekt bestaat niet.", backHome: "Terug naar de startpagina", category: "Categorie", tag: "Tag", author: "Auteur", month: "Maand", year: "Jaar", noResults: "Sorry, nog niets gevonden.", protectedNotice: "Deze inhoud is beveiligd met een wachtwoord en alleen beschikbaar voor deelnemers aan het programma." },
  fr: { skip: "Aller au contenu", navAria: "Menu FR", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", submenu: (l: string) => `Sous-menu ${l}`, languages: "Sous-menu des langues",
    rights: "Tous Droits Réservés", copyright: "© Swaane Lauwaert", photography: "Photographie", photoCredit: "Pinterest, Unsplash",
    journalIntro: "J’écris sur ce qui compte vraiment pour moi : la famille, mon travail, la nature, l’art, Marie-Madeleine et la vie quotidienne toute simple !", follow: "SUIVEZ MOI SUR :",
    nextPage: "Page suivante", prevPage: "Page précédente", paginationAria: "Pagination", writtenBy: "Écrit par", in: "dans", on: "le", postNavAria: "Navigation des articles", comments: "Commentaires", morePosts: "Plus d’articles", discover: "Découvrez plus de Swaane Lauwaert", subscribeText: "Abonnez-vous pour recevoir les derniers articles par e-mail.", subscribe: "S’abonner", likeShare: "Like and share", notFound: "Page introuvable", notFoundText: "La page que vous cherchez n’existe pas.", backHome: "Retour à l’accueil", category: "Catégorie", tag: "Étiquette", author: "Auteur", month: "Mois", year: "Année", noResults: "Désolé, rien trouvé pour le moment.", protectedNotice: "Ce contenu est protégé par un mot de passe et réservé aux participantes du programme." },
} as const;

export const JOURNAL_PATH: Record<Lang, string> = { en: "/en/the-journal/", nl: "/nl/journal/", fr: "/fr/le-journal/" };
export const SUBSTACK_URL = "https://substack.com/@swaanelauwaert1";
export const SOCIAL = [
  { name: "Instagram", href: "https://www.instagram.com/swaanelauwaert/", cls: "wp-social-link-instagram", path: "M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z" },
  { name: "Facebook", href: "https://www.facebook.com/swaane.lauwaert", cls: "wp-social-link-facebook", path: "M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z" },
];

export function formatDate(d: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE }).format(d);
}
export function isoLocal(d: Date): string {
  // WordPress prints site-local time with offset, e.g. 2018-10-17T14:39:14+02:00
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZoneName: "longOffset" }).formatToParts(d).map((p) => [p.type, p.value]));
  const off = (parts.timeZoneName as string).replace("GMT", "") || "+00:00";
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${off.length === 6 ? off : off + ":00"}`;
}
export function postPath(d: Date, slug: string): string {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d).map((x) => [x.type, x.value]));
  return `/nl/${p.year}/${p.month}/${p.day}/${slug}/`;
}
export function pageTitle(title: string | undefined, lang: Lang): string {
  return title && title !== SITE_NAME ? `${title} – ${SITE_NAME}` : SITE_NAME;
}
