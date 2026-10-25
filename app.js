(() => {
  "use strict";

  const techniques = window.GUIDE_TECHNIQUES;
  const sources = window.GUIDE_SOURCES;
  const list = document.getElementById("technique-list");
  const detail = document.getElementById("detail");
  const search = document.getElementById("search");
  const filters = [...document.querySelectorAll(".filter")];
  const storageKey = "prompt-injection-guide:studied:v1";

  let studied = new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(stored)) studied = new Set(stored.filter(id => techniques.some(item => item.id === id)));
  } catch { /* Прогресс необязателен: справочник работает и без storage. */ }

  let filter = "all";
  let selectedId = techniques.some(item => item.id === decodeURIComponent(location.hash.slice(1)))
    ? decodeURIComponent(location.hash.slice(1))
    : techniques[0].id;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function visibleTechniques() {
    const query = search.value.trim().toLocaleLowerCase("ru");
    return techniques.filter(item => {
      if (filter !== "all" && item.type !== filter) return false;
      if (!query) return true;
      return [item.title, item.subtitle, item.surface, item.boundary, item.mechanism]
        .some(value => value.toLocaleLowerCase("ru").includes(query));
    });
  }

  function updateProgress() {
    document.getElementById("progress-value").textContent = `${studied.size} / ${techniques.length}`;
    document.getElementById("progress-fill").style.width = `${(studied.size / techniques.length) * 100}%`;
  }

  function renderList(items) {
    document.getElementById("result-count").textContent = String(items.length);
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-list";
      empty.textContent = "По этому запросу ничего не найдено. Попробуй другое слово или сбрось фильтр.";
      list.append(empty);
      return;
    }

    for (const item of items) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `technique${item.id === selectedId ? " selected" : ""}`;
      button.dataset.id = item.id;
      button.setAttribute("aria-current", item.id === selectedId ? "true" : "false");

      const index = document.createElement("span");
      index.className = "technique-index";
      index.textContent = String(techniques.indexOf(item) + 1).padStart(2, "0");
      const copy = document.createElement("span");
      copy.className = "technique-copy";
      const title = document.createElement("span");
      title.className = "technique-title";
      title.textContent = item.title;
      const subtitle = document.createElement("span");
      subtitle.className = "technique-subtitle";
      subtitle.textContent = item.subtitle;
      copy.append(title, subtitle);
      const check = document.createElement("span");
      check.className = "technique-check";
      check.setAttribute("aria-label", studied.has(item.id) ? "Изучено" : "");
      check.textContent = studied.has(item.id) ? "✓" : "";
      button.append(index, copy, check);
      button.addEventListener("click", () => select(item.id, true));
      list.append(button);
    }
  }

  function renderDetail() {
    const item = techniques.find(technique => technique.id === selectedId);
    if (!item) {
      detail.innerHTML = '<div class="no-detail"><h2>Ничего не найдено</h2><p>Измени поиск или фильтр, чтобы открыть технику.</p></div>';
      return;
    }
    const number = String(techniques.indexOf(item) + 1).padStart(2, "0");
    const typeName = item.type === "direct" ? "Прямая инъекция" : "Непрямая инъекция";
    const links = item.links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} ↗</a>`).join("");
    detail.innerHTML = `
      <div class="detail-topline">
        <div class="breadcrumbs"><span>Каталог</span><span aria-hidden="true">/</span><span class="current">${typeName}</span></div>
        <span class="detail-number">${number} / ${String(techniques.length).padStart(2, "0")}</span>
      </div>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="detail-lead">${escapeHtml(item.lead)}</p>
      <div class="chips"><span class="chip ${item.type}">${typeName}</span><span class="chip">${escapeHtml(item.level)}</span><span class="chip">≈ ${escapeHtml(item.time)}</span></div>
      <div class="boundary">
        <div class="boundary-cell"><span class="eyebrow">Где находится</span><strong>${escapeHtml(item.surface)}</strong></div>
        <div class="boundary-cell"><span class="eyebrow">Граница доверия</span><strong>${escapeHtml(item.boundary)}</strong></div>
      </div>
      <div class="detail-grid">
        <div>
          <section class="content-section"><h3>Как это работает</h3><p>${escapeHtml(item.mechanism)}</p></section>
          <section class="content-section"><h3>Лабораторный пример</h3><p><strong>Исходное правило:</strong> ${escapeHtml(item.baseline)}</p>
            <div class="example"><span class="example-label">Тестовый материал</span><pre>${escapeHtml(item.example)}</pre><div class="example-tools"><button class="copy-btn" type="button" id="copy-example">Скопировать пример ↗</button></div></div>
          </section>
          <section class="content-section"><h3>Как проверить</h3><ol class="steps">${item.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section>
        </div>
        <div class="results-rail">
          <div class="mini-panel good"><h3>✓ Граница удержана</h3><p>${escapeHtml(item.pass)}</p></div>
          <div class="mini-panel bad"><h3>↗ Возможный сбой</h3><p>${escapeHtml(item.fail)}</p></div>
          <div class="mini-panel"><h3>Что исправлять</h3><p>${escapeHtml(item.fix)}</p></div>
        </div>
      </div>
      <div class="detail-source"><span>Разобрать первоисточник</span>${links}</div>
      <div class="detail-actions"><button class="mark-btn${studied.has(item.id) ? " done" : ""}" type="button" id="mark-studied" aria-pressed="${studied.has(item.id)}">${studied.has(item.id) ? "✓ Изучено" : "Отметить изученным"}</button><button class="next-btn" type="button" id="next-technique">Следующая техника →</button></div>`;

    document.getElementById("mark-studied").addEventListener("click", () => {
      if (studied.has(item.id)) studied.delete(item.id); else studied.add(item.id);
      try { localStorage.setItem(storageKey, JSON.stringify([...studied])); } catch { /* см. выше */ }
      updateProgress();
      renderList(visibleTechniques());
      renderDetail();
    });
    document.getElementById("next-technique").addEventListener("click", () => {
      const items = visibleTechniques();
      const position = items.findIndex(value => value.id === item.id);
      if (items.length) select(items[(position + 1) % items.length].id, false);
    });
    document.getElementById("copy-example").addEventListener("click", async event => {
      const button = event.currentTarget;
      let copied = false;
      try {
        await navigator.clipboard.writeText(item.example);
        copied = true;
      } catch {
        const field = document.createElement("textarea");
        field.value = item.example;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        copied = document.execCommand("copy");
        field.remove();
      }
      button.textContent = copied ? "Скопировано ✓" : "Не удалось скопировать";
    });
  }

  function select(id, focusList) {
    selectedId = id;
    history.replaceState(null, "", `#${id}`);
    renderList(visibleTechniques());
    renderDetail();
    if (focusList) list.querySelector(`[data-id="${id}"]`)?.focus();
  }

  function renderSources() {
    const grid = document.getElementById("source-grid");
    for (const source of sources) {
      const link = document.createElement("a");
      link.className = "source-card";
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span class="source-type">${escapeHtml(source.type)} ↗</span><strong>${escapeHtml(source.title)}</strong><span class="source-desc">${escapeHtml(source.desc)}</span>`;
      grid.append(link);
    }
  }

  search.addEventListener("input", () => {
    const items = visibleTechniques();
    if (!items.some(item => item.id === selectedId)) selectedId = items[0]?.id || null;
    renderList(items);
    renderDetail();
  });
  filters.forEach(button => button.addEventListener("click", () => {
    filter = button.dataset.filter;
    filters.forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    const items = visibleTechniques();
    if (!items.some(item => item.id === selectedId)) selectedId = items[0]?.id || null;
    renderList(items);
    renderDetail();
  }));
  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (techniques.some(item => item.id === id)) {
      selectedId = id;
      filter = "all";
      search.value = "";
      filters.forEach(candidate => {
        const active = candidate.dataset.filter === "all";
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      renderList(visibleTechniques());
      renderDetail();
    }
  });

  renderSources();
  updateProgress();
  renderList(visibleTechniques());
  renderDetail();
})();
