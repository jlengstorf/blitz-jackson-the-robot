export default () => {
  let isActive = false;

  if (isActive) return;

  isActive = true;

  const container = document.getElementById('corgi-storm');
  const corgi = document.createElement('img');
  corgi.src =
    'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_100/v1573606931/party-corgi';

  let corgiCoordinates = [];
  for (let i = 0; i < 30; i++) {
    corgiCoordinates.push({
      runDelay: Math.round(Math.random() * 3000),
      jumpDelay: Math.round(Math.random() * 6000) + 1000,
      top: Math.round(Math.random() * 100),
    });
  }

  let corgis = [];
  const sorted = corgiCoordinates
    .sort((a, b) => a.top - b.top)
    .map((coords, i) => ({ ...coords, zIndex: i + 1 }))
    .forEach(coords => {
      const { runDelay, jumpDelay, top, zIndex } = coords;
      const el = corgi.cloneNode();

      el.style.cssText = `
        animation-delay: ${runDelay}ms, ${jumpDelay}ms;
        top: ${top}px;
        z-index: ${zIndex};
      `;
      container.appendChild(el);

      corgis.push(el);
    });

  setTimeout(() => {
    isActive = false;
    corgis.forEach(el => {
      el.remove();
    });
  }, 12000);
};
