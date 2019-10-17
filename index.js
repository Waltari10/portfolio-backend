const express = require('express')
const nodemailer = require('nodemailer');
require('dotenv').config()


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS
  }
});


const app = express()
const port = 3001;

app.use(express.json())

app.post('/comment', function (req, res) {

  const { name = '', email = '', message = ''} = req.body || {};

  if (typeof email !== 'string' || typeof message !== 'string' || typeof name !== 'string' ) {

      res.status(400);
      res.send('Please check that email, message and name are correctly entered.');
      return;
  }

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECEIVER,
    subject: name + ' contacted you via portfolio site',
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.status(500);
      res.send('Error sending email! Please send email manually to ' + process.env.EMAIL_SENDER);
    } else {
      res.status(200);
      res.send('Email sent succesfully');
      console.log('Email sent: ' + info.response);
    }
  });


})
 
app.listen(port)


console.log('Listening on port: ' + port)