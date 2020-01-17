import playSound from '../util/play-sound.js';

const MUSIC_URL =
  'https://res.cloudinary.com/jlengstorf/video/upload/so_25.8,eo_33.2/v1573608942/lwj-sfx/busybody.mp3';
const PARTYCORGI_URL =
  'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_100/v1573606931/party-corgi';
const BEARDCORGI_URL =
  'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_100/v1573606931/jlengstorf-corgi';

let isActive = false;

function addEmotes(emotePossibilities) {
  const container = document.getElementById('corgi-storm');

  let coords = [];
  for (let i = 0; i < 30; i++) {
    const duration = Math.round(Math.random() * 3000) + 2000;
    coords.push({
      duration,
      runDelay: Math.round(Math.random() * 3000),
      jumpDelay: Math.round(Math.random() * duration),
      top: Math.round(Math.random() * 100),
    });
  }

  let emotes = [];
  coords
    .sort((a, b) => a.top - b.top)
    .map((coords, i) => ({ ...coords, zIndex: i + 1 }))
    .forEach(coords => {
      const emoteIndex = Math.abs(
        Math.round(Math.random() * emotePossibilities.length - 1),
      );
      const { duration, runDelay, jumpDelay, top, zIndex } = coords;
      const el = emotePossibilities[emoteIndex].cloneNode();

      el.style.cssText = `
        animation-delay: ${runDelay}ms, ${jumpDelay}ms;
        animation-duration: ${duration}ms, 500ms;
        top: ${top}px;
        z-index: ${zIndex};
      `;
      container.appendChild(el);

      emotes.push(el);
    });

  setTimeout(() => {
    isActive = false;
    emotes.forEach(el => {
      el.remove();
    });
  }, 12000);
}

export default () => {
  if (isActive) return;

  isActive = true;

  const corgi = document.createElement('img');
  corgi.src = PARTYCORGI_URL;
  const beard = document.createElement('img');
  beard.src = BEARDCORGI_URL;

  addEmotes([corgi, beard]);

  playSound(MUSIC_URL);
};
