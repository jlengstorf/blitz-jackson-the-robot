module.exports = (user, _message, _flags, { channel }) => ({
  name: 'chris',
  message:
    user !== 'chrisbiscardi'
      ? 'LISTEN TO CHRIS! Chris is always right chrisb24PartyCorgi chrisb24PartyCorgi'
      : 'jlengsHolyBucket Yes, you’re Chris. jlengsHolyBucket',
  channel,
});
