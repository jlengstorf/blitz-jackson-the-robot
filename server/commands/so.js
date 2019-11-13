module.exports = (user, message, { broadcaster, mod }, { channel }) => {
  // only broadcasters or mods can shoutout
  // don't want the !so command to fight with any existing channel !so commands
  // so should return if not BOTOWNER
  if ((!broadcaster && !mod) || channel !== process.env.BOTOWNER) {
    return;
  }

  const parts = message.split(' ');
  const soTarget = parts.find(part => part.startsWith('@'));
  if (!soTarget) {
    return;
  }

  const twitchLink = `https://twitch.tv/${soTarget.replace('@', '')}`;

  return {
    name: 'so',
    message: `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ Please check out ${soTarget} at ${twitchLink} jlengsHolyBucket jlengsBeardy ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
    channel,
  };
};
