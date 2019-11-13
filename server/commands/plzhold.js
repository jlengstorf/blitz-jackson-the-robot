module.exports = (_user, _message, _flags, { channel }) => ({
  name: 'plzhold',
  message: 'SeriousSloth compiling...',
  sfx:
    'https://res.cloudinary.com/jlengstorf/video/upload/q_auto/v1569957993/lwj-sfx/elevator-music.mp3',
  gif:
    'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_400/v1573512575/lwj-sfx/waiting',
  duration: 10, // in seconds
  channel,
});
