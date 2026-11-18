'use strict';

const textEntries = Array.from(document.querySelectorAll('[data-en]'), element => ({
  element,
  ar: element.textContent,
  en: element.dataset.en,
}));

const labelEntries = Array.from(document.querySelectorAll('[data-label-en]'), element => ({
  element,
  ar: element.getAttribute('aria-label'),
  en: element.dataset.labelEn,
}));

const switcher = document.querySelector('.language-switch');
const languageButtons = Array.from(switcher.querySelectorAll('[data-language]'));
const copyEmail = document.querySelector('[data-copy-email]');
const emailAddress = document.querySelector('.email-address');
const contactStatus = document.querySelector('.contact-status');
const copyFeedback = {
  copied: { ar: 'نُسخ الإيميل.', en: 'Email copied.' },
  blocked: { ar: 'تقدر تحدد الإيميل وتنسخه يدويًا.', en: 'Select the email address to copy it manually.' },
};
let feedback = null;
const titles = {
  ar: 'معاذ المطيري | الموقع الشخصي',
  en: 'Muath Al-Mutairi | Personal Portfolio',
};

function setLanguage(language) {
  const isEnglish = language === 'en';
  document.documentElement.lang = language;
  document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
  document.title = titles[language];

  for (const entry of textEntries) entry.element.textContent = entry[language];
  for (const entry of labelEntries) entry.element.setAttribute('aria-label', entry[language]);
  if (feedback) contactStatus.textContent = copyFeedback[feedback][language];
  for (const button of languageButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
}

function languageFromUrl() {
  return new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'ar';
}

for (const button of languageButtons) {
  button.addEventListener('click', () => {
    const language = button.dataset.language;
    setLanguage(language);

    const url = new URL(window.location.href);
    if (language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    window.history.replaceState(null, '', url);
  });
}

setLanguage(languageFromUrl());
switcher.hidden = false;
window.addEventListener('popstate', () => setLanguage(languageFromUrl()));

if (window.isSecureContext && navigator.clipboard?.writeText) {
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress.textContent.trim());
      feedback = 'copied';
    } catch {
      feedback = 'blocked';
    }
    contactStatus.textContent = copyFeedback[feedback][document.documentElement.lang];
  });
}
