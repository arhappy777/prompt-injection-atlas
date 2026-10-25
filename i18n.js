/* Shared RU/EN layer for both pages. Single source of UI strings + language toggle.
   Dynamic strings used inside catalog.js / app.js are read via window.ATLAS_I18N.t(key). */
(() => {
  "use strict";
  const STORAGE_KEY = "pi-atlas:lang";
  const SUPPORTED = ["en", "ru"];

  const DICT = {
    // ---- shared ----
    "brand.name": { en: "Prompt Injection Atlas", ru: "Атлас промпт-инъекций" },
    "doc.title.index": { en: "Prompt Injection Atlas", ru: "Атлас промпт-инъекций" },
    "doc.title.catalog": { en: "Full source catalog · Prompt Injection Atlas", ru: "Полный каталог источников · Атлас промпт-инъекций" },
    "toggle.aria": { en: "Switch language", ru: "Сменить язык" },
    "toggle.other": { en: "RU", ru: "EN" },

    // ---- index.html (walkthroughs) ----
    "index.subtitle": { en: "Read → understand → test", ru: "Читай → понимай → проверяй" },
    "index.edition": { en: "Study handbook · 2026", ru: "Учебный справочник · 2026" },
    "index.fullCatalog": { en: "Full catalog ↗", ru: "Полный каталог ↗" },
    "index.sourcesJump": { en: "Sources", ru: "Источники" },
    "index.h1": { en: "From technique to test", ru: "От техники к проверке" },
    "index.intro": {
      en: 'Fourteen detailed study walkthroughs. The <a href="./catalog.html">full catalog</a> holds more than 2,000 recorded entries from eight sources: methods, strategies, probes, articles and papers. The entry count is not the number of unique techniques.',
      ru: 'Здесь 14 подробных учебных разборов. <a href="./catalog.html">Полный каталог</a> содержит более 2 тысяч учтённых записей восьми источников: методы, стратегии, пробы, статьи и работы. Их количество не равно числу уникальных техник.'
    },
    "index.studied": { en: "studied", ru: "изучено" },
    "index.findLabel": { en: "Find a technique", ru: "Найти технику" },
    "index.findPh": { en: "Name, surface, mechanism…", ru: "Название, поверхность, механизм…" },
    "filter.all": { en: "All", ru: "Все" },
    "filter.direct": { en: "Direct", ru: "Прямые" },
    "filter.indirect": { en: "Indirect", ru: "Непрямые" },
    "index.listHeading": { en: "Detailed walkthroughs", ru: "Подробные разборы" },
    "index.markerNote": { en: "Examples use only the training marker “BEACON”.", ru: "Примеры используют только учебный маркер «МАЯК»." },
    "index.sourcesTitle": { en: "Source library", ru: "Библиотека источников" },
    "index.sourcesDesc": { en: "The links this handbook was built from. Tools and benchmarks are kept separate from the techniques themselves.", ru: "Ссылки, с которых собран справочник. Инструменты и бенчмарки здесь отделены от самих техник." },
    "index.sourcesCount": { en: "8 sources", ru: "8 источников" },
    "index.footer": { en: "Local study handbook · examples and test criteria were written for this app.", ru: "Локальный учебный справочник · примеры и критерии проверки составлены для этого приложения." },

    // ---- app.js (walkthrough detail) ----
    "wt.empty": { en: "Nothing matches this query. Try another word or clear the filter.", ru: "По этому запросу ничего не найдено. Попробуй другое слово или сбрось фильтр." },
    "wt.studiedAria": { en: "Studied", ru: "Изучено" },
    "wt.direct": { en: "Direct injection", ru: "Прямая инъекция" },
    "wt.indirect": { en: "Indirect injection", ru: "Непрямая инъекция" },
    "wt.breadcrumb": { en: "Catalog", ru: "Каталог" },
    "wt.surface": { en: "Where it lives", ru: "Где находится" },
    "wt.boundary": { en: "Trust boundary", ru: "Граница доверия" },
    "wt.mechanism": { en: "How it works", ru: "Как это работает" },
    "wt.labExample": { en: "Lab example", ru: "Лабораторный пример" },
    "wt.baseline": { en: "Original rule:", ru: "Исходное правило:" },
    "wt.material": { en: "Test material", ru: "Тестовый материал" },
    "wt.copyExample": { en: "Copy example ↗", ru: "Скопировать пример ↗" },
    "wt.howToTest": { en: "How to test", ru: "Как проверить" },
    "wt.pass": { en: "✓ Boundary held", ru: "✓ Граница удержана" },
    "wt.fail": { en: "↗ Possible failure", ru: "↗ Возможный сбой" },
    "wt.fix": { en: "What to fix", ru: "Что исправлять" },
    "wt.source": { en: "Study the primary source", ru: "Разобрать первоисточник" },
    "wt.markDone": { en: "✓ Studied", ru: "✓ Изучено" },
    "wt.markTodo": { en: "Mark as studied", ru: "Отметить изученным" },
    "wt.next": { en: "Next technique →", ru: "Следующая техника →" },
    "wt.copied": { en: "Copied ✓", ru: "Скопировано ✓" },
    "wt.copyFail": { en: "Copy failed", ru: "Не удалось скопировать" },
    "wt.notFound": { en: "Nothing found", ru: "Ничего не найдено" },
    "wt.notFoundHint": { en: "Change the search or filter to open a technique.", ru: "Измени поиск или фильтр, чтобы открыть технику." },

    // ---- catalog.html ----
    "cat.back": { en: "← Detailed walkthroughs", ru: "← Подробные разборы" },
    "cat.brandSub": { en: "Full verifiable catalog", ru: "Полный проверяемый каталог" },
    "cat.eyebrow": { en: "Eight sources", ru: "Восемь источников" },
    "cat.h1": { en: "Register of eight sources", ru: "Реестр восьми источников" },
    "cat.intro": {
      en: "On the left, every row of the selected tables, modules, probes and publication indexes. On the right, a description, an example use, and the direct link. The entry count is not the number of unique techniques: some papers describe several methods, and some mechanisms are only named in aggregate at the source.",
      ru: "Слева — все строки выбранных таблиц, модулей, проб и индексов публикаций. Справа — описание, пример использования и прямая ссылка. Число записей не равно числу уникальных техник: некоторые работы содержат несколько методов, а часть механизмов названа в источнике только агрегированно."
    },
    "cat.metricUnit": { en: "entries with a primary source", ru: "записей с первоисточником" },
    "cat.searchLabel": { en: "Search the catalog", ru: "Поиск по каталогу" },
    "cat.searchPh": { en: "Name, category, description…", ru: "Название, категория, описание…" },
    "cat.sourceLabel": { en: "Source", ru: "Источник" },
    "cat.kindLabel": { en: "Entry type", ru: "Тип записи" },
    "cat.allSources": { en: "All 8 sources", ru: "Все 8 источников" },
    "cat.allKinds": { en: "All types", ru: "Все типы" },
    "cat.modeMethods": { en: "Methods & components", ru: "Способы и компоненты" },
    "cat.modeResearch": { en: "Articles & papers", ru: "Статьи и работы" },
    "cat.modeAll": { en: "Everything", ru: "Всё" },
    "cat.more": { en: "Show 100 more", ru: "Показать ещё 100" },

    // ---- catalog.js (catalog detail) ----
    "cat.methodsCount": { en: "{n} entries on methods, components and probes", ru: "{n} записей о методах, компонентах и пробах" },
    "cat.found": { en: "Found {total} · showing {shown}", ru: "Найдено {total} · показано {shown}" },
    "cat.nothingTitle": { en: "Nothing found", ru: "Ничего не найдено" },
    "cat.nothingHint": { en: "Change the query or the filter.", ru: "Измени запрос или фильтр." },
    "cat.exampleUse": { en: "Example use", ru: "Пример использования" },
    "cat.howToTestAgent": { en: "How to test it on an agent", ru: "Как проверить на агенте" },
    "cat.permissionNote": { en: "Only test systems you are authorized to test. Record the original rule, the input, and the actual response.", ru: "Проверяй только системы, на которые у тебя есть разрешение. Зафиксируй исходное правило, вход и фактический ответ." },
    "cat.primarySource": { en: "Primary source", ru: "Первоисточник" },
    "cat.recordId": { en: "Entry ID: {id}", ru: "ID записи: {id}" },
    "cat.origEn": { en: "Original description (English)", ru: "Исходное описание на английском" },
    "cat.arxivEn": { en: "Full arXiv abstract (English)", ru: "Полная аннотация arXiv на английском" },
    "cat.noteCurated": { en: "Editorial explanation based on the primary source. Verify the details against the original.", ru: "Редакторское объяснение по первоисточнику. Сверяй детали с оригиналом." },
    "cat.noteAuto": { en: "Machine translation of the source description. Verify the details against the original.", ru: "Автоматический перевод описания из источника. Сверяй детали с оригиналом." },
    "cat.notePaper": { en: "Machine translation of the start of the research abstract. Not a confirmation of a distinct technique; check the full text in the paper.", ru: "Машинный перевод начала аннотации исследования. Это не подтверждение отдельной техники; полный текст проверь в работе." },
    "cat.limitMeta": { en: "The metadata names the entry but does not fully explain the mechanism. Open the primary source for an exact breakdown.", ru: "Метаданные называют запись, но не объясняют механизм полностью. Для точного разбора открой первоисточник." },
    "cat.limitVariant": { en: "This is a separate implementation version. The short description matches the base method; verify the differences in the code.", ru: "Это отдельная версия реализации. Краткое описание совпадает с базовым методом; различия нужно сверить в коде." },
    "cat.mobileBack": { en: "← List", ru: "← Список" },
    "cat.prevAria": { en: "Previous entry", ru: "Предыдущая запись" },
    "cat.nextAria": { en: "Next entry", ru: "Следующая запись" },
    "cat.fallbackDesc": { en: "Description in the primary source.", ru: "Описание в первоисточнике." },

    // kind labels
    "kind.strategy": { en: "Strategy", ru: "Стратегия" },
    "kind.method": { en: "Named method", ru: "Именованный метод" },
    "kind.variant": { en: "Method variant", ru: "Вариант метода" },
    "kind.converter": { en: "Converter", ru: "Преобразователь" },
    "kind.module": { en: "Utility module", ru: "Служебный модуль" },
    "kind.probe": { en: "Probe", ru: "Проба" },
    "kind.mechanism": { en: "Mechanism", ru: "Механизм" },
    "kind.article": { en: "Article / case", ru: "Статья / кейс" },
    "kind.paper": { en: "Research paper", ru: "Научная работа" },
    "kind.release": { en: "Tool release", ru: "Релиз инструмента" }
  };

  let lang = "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) lang = saved;
  } catch { /* storage optional */ }

  const subscribers = [];

  function t(key, vars) {
    const entry = DICT[key];
    let str = entry ? (entry[lang] ?? entry.en) : key;
    if (vars) for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v);
    return str;
  }

  function applyStatic(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    root.querySelectorAll("[data-i18n-html]").forEach(node => { node.innerHTML = t(node.dataset.i18nHtml); });
    root.querySelectorAll("[data-i18n-ph]").forEach(node => { node.placeholder = t(node.dataset.i18nPh); });
    root.querySelectorAll("[data-i18n-aria]").forEach(node => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
    const titleKey = document.body?.dataset.titleKey;
    if (titleKey) document.title = t(titleKey);
    document.documentElement.lang = lang;
  }

  function setLang(next) {
    if (!SUPPORTED.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
    render();
  }

  function render() {
    applyStatic();
    updateToggle();
    for (const cb of subscribers) { try { cb(lang); } catch { /* ignore */ } }
  }

  let toggleBtn = null;
  function updateToggle() {
    if (!toggleBtn) return;
    toggleBtn.textContent = t("toggle.other");
    toggleBtn.setAttribute("aria-label", t("toggle.aria"));
  }

  function mountToggle() {
    const slot = document.getElementById("lang-toggle-slot");
    if (!slot) return;
    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.id = "lang-toggle";
    toggleBtn.addEventListener("click", () => setLang(lang === "en" ? "ru" : "en"));
    slot.append(toggleBtn);
    updateToggle();
  }

  // minimal toggle styling, injected so both pages share it without editing two CSS files
  const style = document.createElement("style");
  style.textContent = "#lang-toggle{font:inherit;font-size:12px;font-weight:800;letter-spacing:.06em;color:#fff;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:7px 12px;cursor:pointer;line-height:1}#lang-toggle:hover{background:rgba(255,255,255,.22)}";
  document.head.append(style);

  window.ATLAS_I18N = {
    get lang() { return lang; },
    t,
    setLang,
    onChange(cb) { if (typeof cb === "function") subscribers.push(cb); }
  };

  function init() { mountToggle(); render(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
