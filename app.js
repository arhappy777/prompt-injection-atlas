(() => {
  "use strict";

  const I18N = window.ATLAS_I18N;
  const techniques = window.GUIDE_TECHNIQUES;
  const sources = window.GUIDE_SOURCES;
  const list = document.getElementById("technique-list");
  const detail = document.getElementById("detail");
  const search = document.getElementById("search");
  const filters = [...document.querySelectorAll(".filter")];
  const storageKey = "prompt-injection-guide:studied:v1";

  const L = () => I18N.lang;
  const t = (item) => item[L()];

  let studied = new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(stored)) studied = new Set(stored.filter(id => techniques.some(item => item.id === id)));
  } catch { /* progress optional: the handbook works without storage */ }

  let filter = "all";
  let selectedId = techniques.some(item => item.id === decodeURIComponent(location.hash.slice(1)))
    ? decodeURIComponent(location.hash.slice(1))
    : techniques[0].id;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function visibleTechniques() {
    const query = search.value.trim().toLocaleLowerCase();
    return techniques.filter(item => {
      if (filter !== "all" && item.type !== filter) return false;
      if (!query) return true;
      const c = t(item);
      return [c.title, c.subtitle, c.surface, c.boundary, c.mechanism]
        .some(value => value.toLocaleLowerCase().includes(query));
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
      empty.textContent = I18N.t("wt.empty");
      list.append(empty);
      return;
    }

    for (const item of items) {
      const c = t(item);
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
      title.textContent = c.title;
      const subtitle = document.createElement("span");
      subtitle.className = "technique-subtitle";
      subtitle.textContent = c.subtitle;
      copy.append(title, subtitle);
      const check = document.createElement("span");
      check.className = "technique-check";
      check.setAttribute("aria-label", studied.has(item.id) ? I18N.t("wt.studiedAria") : "");
      check.textContent = studied.has(item.id) ? "✓" : "";
      button.append(index, copy, check);
      button.addEventListener("click", () => select(item.id, true));
      list.append(button);
    }
  }

  function renderDetail() {
    const item = techniques.find(technique => technique.id === selectedId);
    if (!item) {
      detail.innerHTML = `<div class="no-detail"><h2>${escapeHtml(I18N.t("wt.notFound"))}</h2><p>${escapeHtml(I18N.t("wt.notFoundHint"))}</p></div>`;
      return;
    }
    const c = t(item);
    const number = String(techniques.indexOf(item) + 1).padStart(2, "0");
    const typeName = item.type === "direct" ? I18N.t("wt.direct") : I18N.t("wt.indirect");
    const links = item.links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link[L()])} ↗</a>`).join("");
    detail.innerHTML = `
      <div class="detail-topline">
        <div class="breadcrumbs"><span>${escapeHtml(I18N.t("wt.breadcrumb"))}</span><span aria-hidden="true">/</span><span class="current">${typeName}</span></div>
        <span class="detail-number">${number} / ${String(techniques.length).padStart(2, "0")}</span>
      </div>
      <h2>${escapeHtml(c.title)}</h2>
      <p class="detail-lead">${escapeHtml(c.lead)}</p>
      <div class="chips"><span class="chip ${item.type}">${typeName}</span><span class="chip">${escapeHtml(c.level)}</span><span class="chip">≈ ${escapeHtml(c.time)}</span></div>
      <div class="boundary">
        <div class="boundary-cell"><span class="eyebrow">${escapeHtml(I18N.t("wt.surface"))}</span><strong>${escapeHtml(c.surface)}</strong></div>
        <div class="boundary-cell"><span class="eyebrow">${escapeHtml(I18N.t("wt.boundary"))}</span><strong>${escapeHtml(c.boundary)}</strong></div>
      </div>
      <div class="detail-grid">
        <div>
          <section class="content-section"><h3>${escapeHtml(I18N.t("wt.mechanism"))}</h3><p>${escapeHtml(c.mechanism)}</p></section>
          <section class="content-section"><h3>${escapeHtml(I18N.t("wt.labExample"))}</h3><p><strong>${escapeHtml(I18N.t("wt.baseline"))}</strong> ${escapeHtml(c.baseline)}</p>
            <div class="example"><span class="example-label">${escapeHtml(I18N.t("wt.material"))}</span><pre>${escapeHtml(c.example)}</pre><div class="example-tools"><button class="copy-btn" type="button" id="copy-example">${escapeHtml(I18N.t("wt.copyExample"))}</button></div></div>
          </section>
          <section class="content-section"><h3>${escapeHtml(I18N.t("wt.howToTest"))}</h3><ol class="steps">${c.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section>
        </div>
        <div class="results-rail">
          <div class="mini-panel good"><h3>${escapeHtml(I18N.t("wt.pass"))}</h3><p>${escapeHtml(c.pass)}</p></div>
          <div class="mini-panel bad"><h3>${escapeHtml(I18N.t("wt.fail"))}</h3><p>${escapeHtml(c.fail)}</p></div>
          <div class="mini-panel"><h3>${escapeHtml(I18N.t("wt.fix"))}</h3><p>${escapeHtml(c.fix)}</p></div>
        </div>
      </div>
      <div class="detail-source"><span>${escapeHtml(I18N.t("wt.source"))}</span>${links}</div>
      <div class="detail-actions"><button class="mark-btn${studied.has(item.id) ? " done" : ""}" type="button" id="mark-studied" aria-pressed="${studied.has(item.id)}">${studied.has(item.id) ? escapeHtml(I18N.t("wt.markDone")) : escapeHtml(I18N.t("wt.markTodo"))}</button><button class="next-btn" type="button" id="next-technique">${escapeHtml(I18N.t("wt.next"))}</button></div>`;

    document.getElementById("mark-studied").addEventListener("click", () => {
      if (studied.has(item.id)) studied.delete(item.id); else studied.add(item.id);
      try { localStorage.setItem(storageKey, JSON.stringify([...studied])); } catch { /* see above */ }
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
        await navigator.clipboard.writeText(c.example);
        copied = true;
      } catch {
        const field = document.createElement("textarea");
        field.value = c.example;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        copied = document.execCommand("copy");
        field.remove();
      }
      button.textContent = copied ? I18N.t("wt.copied") : I18N.t("wt.copyFail");
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
    grid.replaceChildren();
    for (const source of sources) {
      const c = source[L()];
      const link = document.createElement("a");
      link.className = "source-card";
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span class="source-type">${escapeHtml(c.type)} ↗</span><strong>${escapeHtml(c.title)}</strong><span class="source-desc">${escapeHtml(c.desc)}</span>`;
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

  function renderAll() {
    renderSources();
    updateProgress();
    renderList(visibleTechniques());
    renderDetail();
  }

  renderAll();
  I18N.onChange(renderAll);
})();
