"use strict";
(() => {
  const bank = window.ENI_QCM_BANK;
  const chapters = window.ENI_QCM_CHAPTERS;
  const GLOBAL_QUOTAS = [2, 2, 3, 4, 4, 3, 6, 6, 4, 3, 3];
  const CHAPTER_SIZE = 20;
  const GLOBAL_SIZE = 40;
  const STORAGE_PREFIX = "eni-linux-qcm-state-v2-";
  const USAGE_KEY = "eni-linux-qcm-usage-v2";
  const byId = new Map((bank || []).map(q => [q.id, q]));
  const el = id => document.getElementById(id);
  const chaptersFiles = [
    "01-introduction", "02-historique", "03-installation", "04-demarrage",
    "05-maintenance-demarrage", "06-reseau", "07-paquets", "08-stockage",
    "09-utilisateurs-groupes", "10-permissions", "11-maintenance-production"
  ];
  const sectionBounds = {
    1: [4], 2: [5, 6], 3: [7, 8, 9, 10],
    4: [12, 14, 17, 18], 5: [19, 20, 21], 6: [22, 23],
    7: [26, 28, 30, 33, 34], 8: [40, 43, 48, 55, 56],
    9: [60, 67, 69], 10: [71, 72, 73],
    11: [77, 80, 83, 85]
  };
  const pageTopic = q => {
    const limits = sectionBounds[q.ch] || [];
    const index = limits.findIndex(last => q.page <= last);
    return index === -1 ? limits.length : index;
  };
  const shuffle = values => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const load = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item === null ? fallback : JSON.parse(item);
    } catch { return fallback; }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  const params = new URLSearchParams(location.search);
  const requestedChapter = Number(params.get("chapitre"));
  const mode = Number.isInteger(requestedChapter) && requestedChapter >= 1 && requestedChapter <= 11
    ? "ch" + requestedChapter : "global";
  const chapter = mode === "global" ? 0 : Number(mode.slice(2));
  const size = chapter ? CHAPTER_SIZE : GLOBAL_SIZE;
  const stateKey = STORAGE_PREFIX + mode;

  const badBank = !Array.isArray(bank) || !Array.isArray(chapters) || chapters.length !== 11 ||
    byId.size !== bank.length || GLOBAL_QUOTAS.reduce((a, b) => a + b, 0) !== GLOBAL_SIZE ||
    bank.some(q => !Number.isInteger(q.id) || !Number.isInteger(q.ch) || q.ch < 1 || q.ch > 11 ||
      !Number.isInteger(q.page) || !q.q || !q.why || !Array.isArray(q.choices) ||
      q.choices.length !== 4 || new Set(q.choices).size !== 4 ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) ||
    chapters.some((_, i) => bank.filter(q => q.ch === i + 1).length < CHAPTER_SIZE);
  if (badBank) {
    el("quiz-intro").textContent = "La banque de questions est incomplète ou corrompue. Actualise la page.";
    return;
  }

  const validState = s => {
    if (!s || s.mode !== mode || !Array.isArray(s.quiz) || s.quiz.length !== size ||
        !Number.isInteger(s.pos) || s.pos < 0 || s.pos >= size ||
        !s.answers || typeof s.answers !== "object" || Array.isArray(s.answers)) return false;
    const ids = new Set();
    for (const entry of s.quiz) {
      const q = entry && byId.get(entry.id);
      if (!q || (chapter && q.ch !== chapter) || ids.has(entry.id) ||
          !Array.isArray(entry.order) || entry.order.length !== 4 ||
          entry.order.some(v => !Number.isInteger(v) || v < 0 || v > 3) ||
          new Set(entry.order).size !== 4) return false;
      ids.add(entry.id);
    }
    for (const [k, answer] of Object.entries(s.answers)) {
      if (!/^(0|[1-9][0-9]*)$/.test(k) || +k >= size ||
          !Number.isInteger(answer) || answer < 0 || answer > 3) return false;
    }
    if (s.done && Object.keys(s.answers).length !== size) return false;
    return s.choice === null || (Number.isInteger(s.choice) && s.choice >= 0 && s.choice < 4);
  };

  let state = load(stateKey, null);
  if (!validState(state)) state = null;
  let usage = load(USAGE_KEY, { counts: {}, recent: {} });
  if (!usage || typeof usage !== "object" || !usage.counts || !usage.recent) {
    usage = { counts: {}, recent: {} };
  }
  const persist = () => save(stateKey, state);
  const panel = id => {
    for (const name of ["quiz-intro", "quiz-active", "quiz-done"]) {
      el(name).hidden = name !== id;
    }
  };

  // Chaque sous-thème du chapitre reçoit d'abord une place ; les autres
  // questions sont ensuite choisies parmi celles les moins utilisées.
  const pickFromChapter = (ch, amount, recentIds) => {
    const pool = bank.filter(q => q.ch === ch);
    const recent = new Set(recentIds);
    const score = q => {
      const count = Number(usage.counts[q.id]) || 0;
      return count * 100 + (recent.has(q.id) ? 40 : 0) + Math.random() * 20;
    };
    const choose = arr => arr.map(q => ({ q, rank: score(q) }))
      .sort((a, b) => a.rank - b.rank)[0].q;

    const groups = new Map();
    for (const q of pool) {
      const topic = pageTopic(q);
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push(q);
    }

    const chosen = [];
    for (const group of groups.values()) {
      if (chosen.length < amount) chosen.push(choose(group));
    }
    while (chosen.length < amount) {
      const selected = new Set(chosen.map(q => q.id));
      const remaining = pool.filter(q => !selected.has(q.id));
      chosen.push(choose(remaining));
    }
    return chosen;
  };

  const pickQuiz = () => {
    const recentIds = Array.isArray(usage.recent[mode]) ? usage.recent[mode] : [];
    const selected = [];
    if (chapter) selected.push(...pickFromChapter(chapter, CHAPTER_SIZE, recentIds));
    else GLOBAL_QUOTAS.forEach((quota, index) =>
      selected.push(...pickFromChapter(index + 1, quota, recentIds)));

    // L'ordre des questions et l'ordre des quatre propositions varient aussi.
    const quiz = shuffle(selected).map(q => ({ id: q.id, order: shuffle([0, 1, 2, 3]) }));
    for (const entry of quiz) usage.counts[entry.id] = (Number(usage.counts[entry.id]) || 0) + 1;
    usage.recent[mode] = quiz.map(entry => entry.id);
    save(USAGE_KEY, usage);
    return quiz;
  };

  const correctCount = () => !state ? 0 : state.quiz.reduce((sum, entry, i) => {
    const answered = Object.prototype.hasOwnProperty.call(state.answers, i);
    return sum + (answered && state.answers[i] === byId.get(entry.id).answer ? 1 : 0);
  }, 0);

  const updateIntro = () => {
    el("total-bank").textContent = bank.length;
    chapters.forEach((_, i) => {
      const target = el("bank-ch-" + (i + 1));
      if (target) target.textContent = bank.filter(q => q.ch === i + 1).length;
    });
    document.querySelectorAll(".mode-card").forEach(card => {
      const active = card.dataset.mode === mode;
      card.classList.toggle("selected", active);
      if (active) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    el("selected-title").textContent = chapter
      ? "Chapitre " + String(chapter).padStart(2, "0") + " · " + chapters[chapter - 1]
      : "Révision générale · Tous les chapitres";
    el("selected-description").textContent = chapter
      ? "20 questions ciblées tirées de " + bank.filter(q => q.ch === chapter).length +
        " questions disponibles. Chaque nouvelle session alterne les notions et les formulations."
      : "40 questions équilibrées sur les 11 chapitres, dans une banque de " + bank.length + " questions.";
    el("start-quiz").textContent = "Lancer " + size + " questions";
    const quotas = el("quota-list");
    quotas.replaceChildren();
    const rows = chapter ? [[chapter, CHAPTER_SIZE]] : GLOBAL_QUOTAS.map((n, i) => [i + 1, n]);
    for (const [ch, count] of rows) {
      const row = document.createElement("div");
      row.className = "quota-item";
      const title = document.createElement("span");
      title.textContent = String(ch).padStart(2, "0") + " · " + chapters[ch - 1];
      const number = document.createElement("strong");
      number.textContent = count + " question" + (count > 1 ? "s" : "");
      row.append(title, number);
      quotas.append(row);
    }
    const resume = el("resume-quiz");
    resume.hidden = !state;
    if (state) resume.textContent = state.done
      ? "Revoir le dernier résultat"
      : "Reprendre (" + (state.pos + 1) + "/" + size + ")";
  };

  const showIntro = () => {
    updateIntro();
    panel("quiz-intro");
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const start = () => {
    state = { mode, quiz: pickQuiz(), pos: 0, answers: {}, choice: null, locked: false, done: false };
    persist();
    showQuestion(true);
  };

  el("start-quiz").addEventListener("click", () => {
    if (state && !state.done && !confirm("Remplacer la session en cours pour ce chapitre ?")) return;
    start();
  });
  el("resume-quiz").addEventListener("click", () => {
    if (state) state.done ? showFinal() : showQuestion(true);
  });
  el("new-quiz").addEventListener("click", start);
  el("restart-during").addEventListener("click", () => {
    if (confirm("Remplacer cette session par un nouveau tirage ?")) start();
  });
  el("back-to-menu").addEventListener("click", showIntro);
  el("choose-again").addEventListener("click", showIntro);

  el("validate-answer").addEventListener("click", () => {
    if (!state || state.locked || state.choice === null) return;
    state.answers[state.pos] = state.choice;
    state.locked = true;
    persist();
    showQuestion(false);
    el("next-question").focus();
  });
  el("next-question").addEventListener("click", () => {
    if (!state || !state.locked) return;
    if (state.pos === size - 1) {
      state.done = true;
      persist();
      showFinal();
    } else {
      state.pos++;
      state.choice = null;
      state.locked = false;
      persist();
      showQuestion(true);
    }
  });

  function selectAnswer(value) {
    if (!state || state.locked) return;
    state.choice = value;
    persist();
    const labels = el("question-options").querySelectorAll(".q-option");
    labels.forEach(label => {
      const input = label.querySelector("input");
      const selected = Number(input.value) === value;
      input.checked = selected;
      label.classList.toggle("selected", selected);
    });
    el("validate-answer").disabled = false;
  }

  function showQuestion(focusTitle = false) {
    panel("quiz-active");
    const entry = state.quiz[state.pos], q = byId.get(entry.id);
    const locked = Boolean(state.locked);
    const chosen = locked ? state.answers[state.pos] : state.choice;
    el("question-count").textContent = "Question " + (state.pos + 1) + " / " + size;
    el("question-score").textContent = "Score : " + correctCount();
    const pct = Math.round(((state.pos + (locked ? 1 : 0)) / size) * 100);
    el("progress-fill").style.width = pct + "%";
    el("progress-bar").setAttribute("aria-valuenow", String(pct));
    el("question-chapter").textContent = "Chapitre " + q.ch + " · " + chapters[q.ch - 1];
    el("question-title").textContent = q.q;

    const choices = el("question-options");
    choices.replaceChildren();
    entry.order.forEach((original, i) => {
      const label = document.createElement("label");
      label.className = "q-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "qcm-answer";
      input.value = String(original);
      input.checked = chosen === original;
      input.disabled = locked;
      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = "ABCD"[i] + ".";
      const description = document.createElement("span");
      description.className = "option-text";
      description.textContent = q.choices[original];
      label.append(input, letter, description);
      if (chosen === original) label.classList.add("selected");
      if (locked) {
        label.classList.add("locked");
        if (original === q.answer) label.classList.add("correct");
        else if (chosen === original) label.classList.add("incorrect");
      } else {
        input.addEventListener("change", () => selectAnswer(original));
      }
      choices.append(label);
    });

    const feedback = el("question-feedback");
    feedback.hidden = !locked;
    feedback.className = "feedback" + (locked ? (chosen === q.answer ? " good" : " bad") : "");
    feedback.replaceChildren();
    if (locked) {
      const verdict = document.createElement("strong");
      verdict.textContent = chosen === q.answer ? "✓ Bonne réponse !" : "✗ Réponse incorrecte";
      const solution = document.createElement("p");
      solution.textContent = "Bonne réponse : " + q.choices[q.answer];
      const why = document.createElement("p");
      why.textContent = q.why;
      const source = document.createElement("p");
      source.className = "source";
      source.textContent = "Source : support ENI (2021-11), p. " + q.page + ".";
      feedback.append(verdict, solution, why, source);
    }
    el("validate-answer").hidden = locked;
    el("validate-answer").disabled = !locked && state.choice === null;
    el("next-question").hidden = !locked;
    el("next-question").textContent = state.pos === size - 1 ? "Voir mes résultats" : "Question suivante";
    if (focusTitle) el("question-title").focus({ preventScroll: true });
  }

  function showFinal() {
    panel("quiz-done");
    const good = correctCount(), pct = Math.round(good / size * 100);
    el("final-score").textContent = good + " / " + size + " · " + pct + " %";
    el("final-subtitle").textContent = pct >= 90 ? "Excellente maîtrise !" :
      pct >= 75 ? "Très bon résultat." : pct >= 50
      ? "Quelques notions restent à renforcer." : "Reprends les corrections puis retente un autre tirage.";

    const tally = chapters.map(() => ({ good: 0, total: 0 })), errors = [];
    state.quiz.forEach((entry, i) => {
      const q = byId.get(entry.id), item = tally[q.ch - 1];
      item.total++;
      if (state.answers[i] === q.answer) item.good++;
      else errors.push({ q, choice: state.answers[i] });
    });
    const results = el("chapter-results");
    results.replaceChildren();
    tally.forEach((item, index) => {
      if (!item.total) return;
      const row = document.createElement("div");
      row.className = "chapter-result";
      const label = document.createElement("span");
      label.className = "chapter-name";
      label.textContent = String(index + 1).padStart(2, "0") + " · " + chapters[index];
      const track = document.createElement("span");
      track.className = "mini-track";
      const fill = document.createElement("span");
      fill.style.width = (item.good / item.total * 100) + "%";
      track.append(fill);
      const fraction = document.createElement("span");
      fraction.className = "chapter-fraction";
      fraction.textContent = item.good + "/" + item.total;
      row.append(label, track, fraction);
      results.append(row);
    });

    el("errors-count").textContent = errors.length;
    const list = el("errors-list");
    list.replaceChildren();
    if (!errors.length) {
      const p = document.createElement("p");
      p.textContent = "Aucune erreur !";
      list.append(p);
    }
    errors.forEach(item => {
      const entry = document.createElement("div");
      entry.className = "error-entry";
      const title = document.createElement("strong");
      title.textContent = "Chapitre " + item.q.ch + " · " + item.q.q;
      const mine = document.createElement("p");
      mine.textContent = "Ta réponse : " + item.q.choices[item.choice];
      const correct = document.createElement("p");
      correct.className = "correct-response";
      correct.textContent = "Bonne réponse : " + item.q.choices[item.q.answer];
      const why = document.createElement("p");
      why.textContent = item.q.why + " (PDF ENI, p. " + item.q.page + ")";
      entry.append(title, mine, correct, why);
      list.append(entry);
    });
    el("errors-details").open = false;
    el("new-quiz").textContent = "Nouveau tirage de " + size + " questions";
    el("course-link").href = chapter ? "../cours/" + chaptersFiles[chapter - 1] + ".html" : "../index.html";
  }

  document.addEventListener("keydown", event => {
    if (!state || state.done || el("quiz-active").hidden ||
        event.ctrlKey || event.altKey || event.metaKey ||
        event.target.closest("input,textarea,select")) return;
    const key = event.key.toUpperCase();
    if ("ABCD".includes(key) && key.length === 1 && !state.locked) {
      event.preventDefault();
      selectAnswer(state.quiz[state.pos].order["ABCD".indexOf(key)]);
    }
    if (key === "ENTER" && !event.target.closest("button,a")) {
      event.preventDefault();
      if (state.locked) el("next-question").click();
      else if (state.choice !== null) el("validate-answer").click();
    }
  });

  updateIntro();
})();