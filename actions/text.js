const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    from: '+13345186489',
    to: process.env.TWILIO_PHONE_NUMBER,
    message: 'Someone pushed to BlitzBot',
  })
  .then(message => console.log(message.sid))
  .done();
