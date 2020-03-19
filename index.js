import express from 'express';
import bodyParser from 'body-parser';

const app = express().use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const { body } = req;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const [webhookEvent] = entry.messaging;

      console.log({ webhookEvent });
    });

    res.status(200).send('EVENT_RECIEVED');
  } else {
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = '<YOUR_VERIFY_TOKEN>';

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
