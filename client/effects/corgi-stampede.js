import playSound from '../util/play-sound.js';

const MUSIC_URL =
  'https://res.cloudinary.com/jlengstorf/video/upload/so_25.8,eo_33.2/v1573608942/lwj-sfx/busybody.mp3';
const CORGI_URL =
  'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_100/v1573606931/party-corgi';

export default () => {
  let isActive = false;

  if (isActive) return;

  isActive = true;

  const container = document.getElementById('corgi-storm');
  const corgi = document.createElement('img');
  corgi.src = CORGI_URL;

  let corgiCoordinates = [];
  for (let i = 0; i < 30; i++) {
    const duration = Math.round(Math.random() * 3000) + 2000;
    corgiCoordinates.push({
      duration,
      runDelay: Math.round(Math.random() * 3000),
      jumpDelay: Math.round(Math.random() * duration),
      top: Math.round(Math.random() * 100),
    });
  }

  let corgis = [];
  corgiCoordinates
    .sort((a, b) => a.top - b.top)
    .map((coords, i) => ({ ...coords, zIndex: i + 1 }))
    .forEach(coords => {
      const { duration, runDelay, jumpDelay, top, zIndex } = coords;
      const el = corgi.cloneNode();

      el.style.cssText = `
        animation-delay: ${runDelay}ms, ${jumpDelay}ms;
        animation-duration: ${duration}ms, 500ms;
        top: ${top}px;
        z-index: ${zIndex};
      `;
      container.appendChild(el);

      corgis.push(el);
    });

  playSound(MUSIC_URL);

  setTimeout(() => {
    isActive = false;
    corgis.forEach(el => {
      el.remove();
    });
  }, 12000);
};
