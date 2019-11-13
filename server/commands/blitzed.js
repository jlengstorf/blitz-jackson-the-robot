module.exports = (_user, _message, _flags, { channel }) => ({
  name: 'blitzed',
  message: 'KAPOW YOU GOT BLITZED! MorphinTime',
  sfx:
    'https://res.cloudinary.com/jlengstorf/video/upload/q_auto/v1569957993/lwj-sfx/blitzed.mp3',
  gif:
    'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_400/v1573512575/lwj-sfx/victory',
  channel,
});
