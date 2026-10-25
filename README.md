# Prompt Injection Atlas

[Русский](README.ru.md)

A personal, offline-first reference for prompt-injection work. It keeps a large catalog of published techniques with their primary sources next to a short set of hands-on walkthroughs, so that a new idea from someone's research can be looked up and reproduced against an authorized agent quickly. The interface is bilingual (English / Russian) with a toggle in the top bar; the choice is remembered per browser.

> [!NOTE]
> This is a study and red-team reference. Examples stay at the mechanism level and use a neutral marker (`BEACON` / `МАЯК`) instead of any harmful payload — full payloads live at the linked primary sources. Run anything only against systems you are authorized to test.

## Two views

- **Detailed walkthroughs** (`index.html`) — 14 hand-written cases, direct and indirect, each with the mechanism, a lab example with the safe marker, how to test it, pass/fail signals, and what to fix.
- **Full catalog** (`catalog.html`) — more than 2,000 entries from eight sources (methods, strategies, probes, modules, converters, articles and papers). Each entry shows a description, an **example use**, concrete steps for **how to test it on an agent**, and a direct link to the primary source. The entry count is not the number of unique techniques.

## Open it

It is a static site — no build step.

- Open `index.html` in a browser, or serve the folder (`python -m http.server`) and open `http://localhost:8000/`.
- Served over HTTPS it installs as a PWA and works offline.

## Sources

Promptfoo, Microsoft PyRIT, JailbreakBench, Jailbreak Foundry, 0DIN AI Scanner, ML Sanity, LLM-Hacking and RedDarwin. Every entry links back to its source; the full list is in the app (Sources section / catalog). Third-party material belongs to its respective authors.

## License

Original written content here is under [CC BY 4.0](https://github.com/arhappy777/llm_pentesting/blob/main/LICENSE). Quoted source descriptions, abstracts and links remain subject to their own terms.
