#!/usr/bin/env node
// Vérification autonome de la banque de QCM ENI, sans dépendance npm.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const sources = [
  "questions.js", "questions-complement-1.js",
  "questions-complement-2.js", "questions-complement-3.js"
];
const context = { window: {} };
vm.createContext(context);
for (const name of sources) {
  vm.runInContext(fs.readFileSync(path.join(here, name), "utf8"), context, { filename: name });
}
const bank = context.window.ENI_QCM_BANK;
const chapters = context.window.ENI_QCM_CHAPTERS;
const bounds = [
  [4, 4], [5, 6], [7, 10], [11, 18], [19, 21], [22, 23],
  [24, 34], [35, 56], [58, 69], [70, 73], [74, 85]
];
const errors = [];
if (!Array.isArray(chapters) || chapters.length !== 11) errors.push("11 chapitres attendus");
if (!Array.isArray(bank)) errors.push("La banque n'est pas un tableau");
const ids = new Set(), statements = new Set();
const counts = Array(11).fill(0);
for (const q of bank || []) {
  if (!Number.isInteger(q.id) || ids.has(q.id)) errors.push("ID invalide/dupliqué : " + q.id);
  ids.add(q.id);
  if (!Number.isInteger(q.ch) || q.ch < 1 || q.ch > 11) {
    errors.push("Chapitre invalide : " + q.id);
    continue;
  }
  counts[q.ch - 1]++;
  const key = q.ch + "/" + String(q.q).toLowerCase().replace(/[^a-z0-9à-ÿ ]/g, "");
  if (statements.has(key)) errors.push("Énoncé dupliqué : " + q.id);
  statements.add(key);
  if (!Array.isArray(q.choices) || q.choices.length !== 4 ||
      new Set(q.choices).size !== 4 ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) {
    errors.push("Choix/réponse invalides : " + q.id);
  }
  if (!q.q || !q.why || typeof q.q !== "string" || typeof q.why !== "string") {
    errors.push("Énoncé/explication absent(e) : " + q.id);
  }
  const [from, to] = bounds[q.ch - 1];
  if (!Number.isInteger(q.page) || q.page < from || q.page > to) {
    errors.push("Page hors chapitre : " + q.id);
  }
}
counts.forEach((n, i) => { if (n < 25) errors.push("Chapitre " + (i + 1) + " : seulement " + n + " questions"); });
console.log("Banque : " + (bank?.length ?? 0) + " questions");
counts.forEach((n, i) => console.log(String(i + 1).padStart(2, "0") + " · " + chapters[i] + " : " + n));
if (errors.length) {
  errors.forEach(error => console.error("ERREUR : " + error));
  process.exitCode = 1;
} else {
  console.log("OK : toutes les validations de structure ont réussi.");
}
