// Replaces the Jetpack contact form behaviour on the home pages. The markup is
// the original one; on submit the data is POSTed as JSON to
// PUBLIC_CONTACT_FORM_ENDPOINT (any form backend that accepts JSON: Formspree,
// Web3Forms, Basin, a Vercel/Cloudflare function...). Without an endpoint the
// browser's mail client is opened with the message pre-filled, so a visitor can
// always reach Swaane.
const ENDPOINT = import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT as string | undefined;
const TO = import.meta.env.PUBLIC_CONTACT_EMAIL || "info@swaanelauwaert.com";
const MSG: Record<string, { ok: string; fail: string; sending: string }> = {
  en: { ok: "Thank you! Your message has been sent.", fail: "Sorry, the message could not be sent. Please email me directly.", sending: "Sending…" },
  nl: { ok: "Dank je! Je bericht is verzonden.", fail: "Sorry, het bericht kon niet worden verzonden. Mail me gerust rechtstreeks.", sending: "Verzenden…" },
  fr: { ok: "Merci ! Votre message a bien été envoyé.", fail: "Désolé, le message n’a pas pu être envoyé. Écrivez-moi directement.", sending: "Envoi…" },
};
const lang = (document.documentElement.lang || "en").slice(0, 2);
const t = MSG[lang] ?? MSG.en;

document.querySelectorAll<HTMLFormElement>("form.jetpack-contact-form__form, form.contact-form").forEach((form) => {
  form.removeAttribute("novalidate");
  form.querySelectorAll("input[type=hidden]").forEach((i) => i.remove());
  const fieldValue = (part: string) => (form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name$="-${part}"], [name="${part}"]`)?.value ?? "").trim();
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    const data = { name: fieldValue("name"), email: fieldValue("email"), message: fieldValue("message"), page: location.href, _subject: `Contact via swaanelauwaert.com: ${fieldValue("name")}` };
    const button = form.querySelector<HTMLButtonElement>("button[type=submit], input[type=submit]");
    const status = document.createElement("p");
    status.className = "wp-block-paragraph has-small-font-size";
    status.setAttribute("role", "status");
    form.querySelector(".contact-form-status")?.remove();
    status.classList.add("contact-form-status");
    if (!ENDPOINT) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      location.href = `mailto:${TO}?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(body)}`;
      return;
    }
    if (button) { button.setAttribute("aria-disabled", "true"); button.classList.add("is-submitting"); }
    status.textContent = t.sending;
    form.append(status);
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.textContent = t.ok;
    } catch {
      status.textContent = `${t.fail} ${TO}`;
    } finally {
      if (button) { button.removeAttribute("aria-disabled"); button.classList.remove("is-submitting"); }
    }
  });
});
