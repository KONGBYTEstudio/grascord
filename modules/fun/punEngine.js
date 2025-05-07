const settings = require('../../config/settings.json');
module.exports = {
  name: 'punEngine',
  getPun() {
    const arr = settings.puns || [
      "Ich hab' mehr Puns als du Memes!",
      "Zeit für 'nen Joint – äh, ich meine Punkt!",
      "Unsere Wortspiele sind schärfer als Chili."
    ];
    return arr[Math.floor(Math.random() * arr.length)];
  }
};
