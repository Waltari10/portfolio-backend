const express = require('express');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/comment', function(req, res) {
  const {name = '', email = '', message = ''} = req.body || {};

  if (typeof message !== 'string' || typeof name !== 'string' ) {
    res.status(400);
    res.send(`Please check that email, 
    message and name are correctly entered.`);
    return;
  }

  let sendConfirmationEmailPromise;

  if (typeof email === 'string' && !!email) {
    sendConfirmationEmailPromise = sgMail.send({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: 'Your contact email has been sent to Valtteri',
      text: `Your contact email has been sent to 
      Valtteri Laine. He will get back to you shortly.`,
    });
  }

  const sendContactEmailPromise = sgMail.send({
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECEIVER,
    subject: name + ' contacted you via portfolio site',
    text: message,
  });


  Promise.all([sendConfirmationEmailPromise, sendContactEmailPromise])
      .then(() => {
        res.status(200);
        res.send('Email sent succesfully');
        console.log('Email sent succesfully');
      })
      .catch(() => {
        res.status(500);
        res.send(
            'Error sending email! Please send email manually to ' +
            process.env.EMAIL_SENDER,
        );
      });
});

app.listen(port);


console.log('Listening on port: ' + port);
