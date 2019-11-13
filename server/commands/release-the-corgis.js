module.exports = (_user, _message, { broadcaster, mod }, { channel }) => {
  if (!broadcaster && !mod) return;

  return {
    name: 'release-the-corgis',
    message: 'chrisb24PartyCorgi RELEASE THE CORGIS chrisb24PartyCorgi ',
    sfx:
      'https://res.cloudinary.com/jlengstorf/video/upload/so_25.8,eo_33.2/v1573608942/lwj-sfx/busybody.mp3',
    duration: 8, // in seconds
    channel,
  };
};
