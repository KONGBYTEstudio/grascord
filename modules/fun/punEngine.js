// modules/fun/punEngine.js
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname, '../../config/settings.json');

function loadSettings() {
  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(cfg) {
  fs.writeFileSync(settingsPath, JSON.stringify(cfg, null, 2));
}

module.exports = {
  name: 'punEngine',

  /** Liefert einen zufälligen Pun, optional nach Kategorie */
  getPun(category) {
    const cfg = loadSettings();
    const pool = category && cfg.punsByCategory?.[category]
      ? cfg.punsByCategory[category]
      : cfg.puns || [];

    if (!pool.length) {
      return 'Kein Pun verfügbar.';
    }

    return pool[Math.floor(Math.random() * pool.length)];
  },

  /** Fügt einen neuen Pun hinzu */
  addPun(text, category) {
    const cfg = loadSettings();
    if (category) {
      cfg.punsByCategory = cfg.punsByCategory || {};
      cfg.punsByCategory[category] = cfg.punsByCategory[category] || [];
      cfg.punsByCategory[category].push(text);
    } else {
      cfg.puns = cfg.puns || [];
      cfg.puns.push(text);
    }
    saveSettings(cfg);
  },

  /** Listet alle Puns oder nur einer Kategorie */
  listPuns(category) {
    const cfg = loadSettings();
    if (category && cfg.punsByCategory?.[category]) {
      return cfg.punsByCategory[category];
    }
    return cfg.puns || [];
  },

  /** Entfernt einen Pun per Index und gibt ihn zurück */
  removePun(index, category) {
    const cfg = loadSettings();
    let arr;
    if (category && cfg.punsByCategory?.[category]) {
      arr = cfg.punsByCategory[category];
    } else {
      arr = cfg.puns || [];
    }
    if (index < 0 || index >= arr.length) {
      return null;
    }
    const [removed] = arr.splice(index, 1);
    saveSettings(cfg);
    return removed;
  }
};
