// this is the Twitch emote ID; check emote URLs to find it
const EMOTES_TO_COUNT = ['300577853', '301195175'];
let EMOTE_COUNT = 0;
let inactive = false;
let timeout;

const hideCountBanner = (container, msToWait = 3000) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    container.classList.add('hidden');

    setTimeout(() => {
      container.classList.remove('visible');
    }, 500);
  }, msToWait);
};

const showCountBanner = ({ count, threshold, callback }) => {
  const container = document.getElementById('emote-count');

  const saturation = (count / threshold) * 50 + 50;
  const lightness = Math.min(95, 100 - (count / threshold) * 50);
  // const animation = saturation > 87 ? `animation: `

  const text = container.querySelector('text');
  text.innerHTML = `corgi count: ${count}`;
  text.style.cssText = `
    fill: hsl(300, ${saturation}%, ${lightness}%);
  `;

  container.classList.remove('hidden');
  container.classList.add('visible');

  // this might be the worst thing I’ve done recently
  if (count >= threshold) {
    clearTimeout(timeout);
    setTimeout(() => {
      inactive = true;
      text.innerHTML = '3...';
      setTimeout(() => {
        text.innerHTML = '2...';
        setTimeout(() => {
          text.innerHTML = '1...';
          setTimeout(() => {
            text.innerHTML = 'GO CORGIS GO!';
            callback();
            EMOTE_COUNT = 0;
            hideCountBanner(container, 8000);

            setTimeout(() => {
              inactive = false;
            }, 20000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  } else {
    hideCountBanner(container);
  }
};

export default (emotes, callback, threshold = 20) => {
  if (inactive) {
    return;
  }

  const count = emotes
    .filter(emote => EMOTES_TO_COUNT.includes(emote.id))
    .reduce((acc, emote) => emote.count + acc, 0);

  EMOTE_COUNT += count;

  showCountBanner({ count: EMOTE_COUNT, threshold, callback });
};
