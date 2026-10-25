(() => {
  "use strict";
  const catalog = window.GUIDE_INVENTORY;
  const items = catalog.items;
  const notes = window.GUIDE_METHOD_NOTES || {};
  const curatedNotes = window.GUIDE_CURATED_NOTES || {};
  const paperNotes = window.GUIDE_PAPER_NOTES || {};
  const paperAbstracts = window.GUIDE_PAPER_ABSTRACTS || {};
  const sourceNames = {
    promptfoo: "Promptfoo", reddarwin: "RedDarwin", foundry: "Jailbreak Foundry",
    pyrit: "Microsoft PyRIT", jbb: "JailbreakBench", scanner: "0DIN AI Scanner",
    llmhacking: "LLM-Hacking", mlsanity: "ML Sanity"
  };
  const kindNames = {
    strategy: "Стратегия", method: "Именованный метод", variant: "Вариант метода",
    converter: "Преобразователь", module: "Служебный модуль", probe: "Проба", mechanism: "Механизм",
    article: "Статья / кейс", paper: "Научная работа", release: "Релиз инструмента"
  };
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const search = document.getElementById("search");
  const source = document.getElementById("source");
  const kind = document.getElementById("kind");
  const list = document.getElementById("records");
  const detail = document.getElementById("detail");
  const layout = document.getElementById("catalog-layout");
  const more = document.getElementById("more");
  let mode = "methods";
  let selectedId = null;
  let shown = 100;

  document.getElementById("snapshot-date").textContent = `Снимок ${catalog.snapshot_date}`;
  document.getElementById("total-count").textContent = items.length.toLocaleString("ru");
  const methodCount = items.filter(item => !["paper", "article", "release"].includes(item.kind)).length;
  document.getElementById("technique-count").textContent = `${methodCount} записей о методах, компонентах и пробах`;
  for (const [id, label] of Object.entries(sourceNames)) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${label} · ${catalog.counts[id]}`;
    source.append(option);
  }
  for (const [id, label] of Object.entries(kindNames)) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${label} · ${catalog.kinds[id]}`;
    kind.append(option);
  }

  function visible() {
    const q = search.value.trim().toLocaleLowerCase();
    return items.filter(item => {
      if (source.value !== "all" && item.source !== source.value) return false;
      if (kind.value !== "all" && item.kind !== kind.value) return false;
      if (mode === "methods" && ["article", "paper", "release"].includes(item.kind)) return false;
      if (mode === "research" && !["article", "paper", "release"].includes(item.kind)) return false;
      return !q || [item.id, item.title, item.description, notes[item.id], paperNotes[item.id], item.group, sourceNames[item.source], kindNames[item.kind]]
        .some(value => value?.toLocaleLowerCase().includes(q));
    });
  }

  function guidance(item) {
    if (item.source === "jbb") return {
      meaning: "Это семейство загруженных в JailbreakBench артефактов. Метаданные указывают тип атаки и модели, но не раскрывают алгоритм каждого метода.",
      steps: ["Открой папку артефактов и связанную работу метода.", "Отдели устройство алгоритма от готовых запросов и зафиксируй условия оценки.", "Воспроизведи только безопасный вариант на разрешённой цели и сравни с контрольным ответом."],
    };
    if (item.kind === "strategy") return {
      meaning: "Стратегия генерации или преобразования тестовых случаев. Само название не гарантирует, что это отдельный механизм атаки: например, базовый режим может служить контролем.",
      steps: ["Открой документацию стратегии и уточни её параметры.", "Выбери разрешённую тестовую цель и зафиксируй ответ на исходный запрос.", "Запусти стратегию с безвредным маркером, сравни ответы и сохрани трассу вызовов."],
    };
    if (item.kind === "method" || item.kind === "variant") return {
      meaning: "Именованный метод или его вариант. Описание ниже взято из доступной записи источника; подробный алгоритм проверяй по первоисточнику.",
      steps: ["Прочитай алгоритм по ссылке и определи, какой вход контролирует атакующий.", "Сформулируй для тестовой цели исходное правило и безопасный ожидаемый ответ.", "Воспроизведи приём на разрешённой цели, сравни с исходным ответом и проверь повторяемость."],
    };
    if (item.kind === "converter") return {
      meaning: "Компонент PyRIT для преобразования входа. Преобразователь может участвовать в атаке, но его наличие в коде не доказывает отдельный jailbreak.",
      steps: ["Проверь в исходном модуле, какой формат он принимает и выдаёт.", "Преобразуй нейтральную фразу с маркером и проверь обратимость или воспринимаемость результата.", "Сравни поведение разрешённой цели до и после преобразования, удерживая задачу одинаковой."],
    };
    if (item.kind === "probe") return {
      meaning: "Опубликованная тестовая проба 0DIN. Несколько проб могут проверять один механизм; здесь сохранены только метаданные без полного текста payload.",
      steps: ["Посмотри категорию, цель пробы и первоисточник.", "Задай критерий успеха для разрешённой цели и сделай базовый вызов.", "Прогони пробу в контролируемой среде и проверь, что результат вызван именно вводом, а не другой настройкой."],
    };
    if (item.kind === "mechanism") return {
      meaning: "Повторно используемый механизм из анализа RedDarwin. Это строительный блок метода, а не обязательно самостоятельная атака.",
      steps: ["Прочитай роль механизма в таблице исследования.", "Найди метод, в котором он используется, и определи входную поверхность.", "Проверь его вклад на разрешённой цели с безвредным маркером и контрольным вариантом без этого механизма."],
    };
    if (item.kind === "module") return {
      meaning: "Служебный программный модуль. Он включён для полного учёта исходного репозитория и не считается самостоятельной техникой.",
      steps: ["Открой код и проверь, какие методы используют этот модуль.", "Перейди к конкретной реализации метода для воспроизведения."],
    };
    if (item.kind === "release") return {
      meaning: "Запись истории выпуска PyRIT. Нужна для проверки старых или переименованных методов; сам релиз не является техникой.",
      steps: ["Открой примечания к выпуску и найди изменения атакующих сценариев или преобразователей.", "Сверь метод с текущим деревом и документацией.", "Для воспроизведения зафиксируй точную версию PyRIT и разрешённую тестовую цель."],
    };
    return {
      meaning: "Библиографическая или обзорная запись. Она включена для полноты охвата источника, но название публикации не считается автоматически новой техникой.",
      steps: ["Открой работу по ссылке и найди раздел с методом или экспериментом.", "Отдели новый механизм от варианта уже известной техники и от сравнения методов.", "Проверь указанные условия эксперимента перед тестом на разрешённой цели."],
    };
  }

  function renderDetail(item) {
    if (!item) {
      detail.innerHTML = '<h2>Ничего не найдено</h2><p>Измени запрос или фильтр.</p>';
      return;
    }
    const guide = guidance(item);
    const matches = visible();
    const position = matches.findIndex(match => match.id === item.id);
    const translated = notes[item.id];
    const paperNote = paperNotes[item.id];
    const arxivId = item.source === "mlsanity" ? item.id.split(":", 2)[1] : null;
    const abstract = arxivId ? paperAbstracts[arxivId]?.abstract : null;
    const curated = Object.prototype.hasOwnProperty.call(curatedNotes, item.id);
    const description = translated || paperNote || item.description || "Описание в первоисточнике.";
    const original = translated ? `<details class="original"><summary>Исходное описание на английском</summary><p>${escapeHtml(item.description)}</p></details>` : "";
    const researchAbstract = abstract ? `<details class="original"><summary>Полная аннотация arXiv на английском</summary><p>${escapeHtml(abstract)}</p></details>` : "";
    const limitedMetadata = (item.source === "scanner" || item.kind === "module" || item.source === "foundry")
      && item.description.length < 90;
    const sourceLimit = !curated && limitedMetadata
      ? '<p class="source-limit">Метаданные называют запись, но не объясняют механизм полностью. Для точного разбора открой первоисточник.</p>' : "";
    const variantLimit = item.source === "foundry" && item.kind === "variant"
      ? '<p class="source-limit">Это отдельная версия реализации. Краткое описание совпадает с базовым методом; различия нужно сверить в коде.</p>' : "";
    detail.innerHTML = `<div class="mobile-nav"><button type="button" id="mobile-back">← Список</button><span>${position + 1} / ${matches.length}</span><button type="button" id="mobile-prev" ${position <= 0 ? "disabled" : ""} aria-label="Предыдущая запись">←</button><button type="button" id="mobile-next" ${position >= matches.length - 1 ? "disabled" : ""} aria-label="Следующая запись">→</button></div>
      <div class="meta"><span class="tag">${escapeHtml(sourceNames[item.source])}</span><span class="tag muted">${escapeHtml(kindNames[item.kind])}</span>${item.group ? `<span class="tag muted">${escapeHtml(item.group)}</span>` : ""}</div>
      <h2>${escapeHtml(item.title)}</h2><p class="lead">${escapeHtml(description)}</p>${translated ? `<p class="translation-note">${curated ? "Редакторское объяснение по первоисточнику." : "Автоматический перевод описания из источника."} Сверяй детали с оригиналом.</p>` : ""}${paperNote ? '<p class="translation-note">Машинный перевод начала аннотации исследования. Это не подтверждение отдельной техники; полный текст проверь в работе.</p>' : ""}${sourceLimit}${variantLimit}${original}${researchAbstract}
      <section><h3>Что представляет собой запись</h3><p>${escapeHtml(guide.meaning)}</p></section>
      <section><h3>Как применить для проверки</h3><ul>${guide.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ul><p class="note">Проверка проводится только на системах, на которые у тебя есть разрешение. Зафиксируй исходное правило, вход и фактический ответ.</p></section>
      <section><h3>Первоисточник</h3><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url)} ↗</a><p class="note">ID записи: ${escapeHtml(item.id)}</p></section>`;
    document.getElementById("mobile-back").addEventListener("click", () => {
      layout.classList.remove("mobile-detail-open");
      layout.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    for (const [id, delta] of [["mobile-prev", -1], ["mobile-next", 1]]) {
      document.getElementById(id).addEventListener("click", () => {
        const next = matches[position + delta];
        if (!next) return;
        if (position + delta >= shown) shown = Math.ceil((position + delta + 1) / 100) * 100;
        selectedId = next.id;
        render();
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function render() {
    const matches = visible();
    document.getElementById("list-count").textContent = `Найдено ${matches.length.toLocaleString("ru")} · показано ${Math.min(shown, matches.length)}`;
    if (!matches.some(item => item.id === selectedId)) selectedId = matches[0]?.id || null;
    list.replaceChildren();
    for (const item of matches.slice(0, shown)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `record${item.id === selectedId ? " active" : ""}`;
      button.innerHTML = `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(sourceNames[item.source])} · ${escapeHtml(kindNames[item.kind])}</span>`;
      button.addEventListener("click", () => {
        selectedId = item.id;
        list.querySelectorAll(".record.active").forEach(node => node.classList.remove("active"));
        button.classList.add("active");
        renderDetail(item);
        if (window.innerWidth < 781) {
          layout.classList.add("mobile-detail-open");
          layout.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      list.append(button);
    }
    more.hidden = matches.length <= shown;
    renderDetail(matches.find(item => item.id === selectedId));
  }

  function reset() { shown = 100; render(); }
  search.addEventListener("input", reset);
  source.addEventListener("change", reset);
  kind.addEventListener("change", reset);
  more.addEventListener("click", () => { shown += 100; render(); });
  document.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => {
    mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach(other => {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    reset();
  }));

  const coverage = document.getElementById("coverage-grid");
  for (const [id, data] of Object.entries(catalog.sources)) {
    const card = document.createElement("div");
    card.className = "coverage-card";
    card.innerHTML = `<strong>${escapeHtml(sourceNames[id])} · ${catalog.counts[id]}</strong><span>${escapeHtml(data.basis)}</span><a href="${escapeHtml(data.url)}" target="_blank" rel="noopener noreferrer">Открыть источник ↗</a>`;
    coverage.append(card);
  }
  render();
})();
