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
const port = process.env.PORT || 3001;

app.use(express.json())


const sendEmail = (from, to, subject, text) => {
  const mailOptions = {
    from,
    to,
    subject,
    text
  };
  console.log(mailOptions)

  return new Promise((resolve, reject) => {
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    });
  })

}

app.post('/comment', function (req, res) {

  const { name = '', email = '', message = ''} = req.body || {};

  if (typeof email !== 'string' || typeof message !== 'string' || typeof name !== 'string' ) {

      res.status(400);
      res.send('Please check that email, message and name are correctly entered.');
      return;
  }

  const sendConfirmationEmailPromise = sendEmail(
    process.env.EMAIL_SENDER,
    email,
    'Your contact email has been sent to Valtteri',
    'Your contact email has been sent to Valtteri Laine. He will get back to you shortly.'
  )

  const sendContactEmailPromise = sendEmail(
    process.env.EMAIL_SENDER, 
    process.env.EMAIL_RECEIVER, 
    name + ' contacted you via portfolio site', 
    message
  )


  Promise.all([sendConfirmationEmailPromise, sendContactEmailPromise])
  .then(() => {
    console.log('then')
      res.status(200);
      res.send('Email sent succesfully');
      console.log('Email sent: ' + info.response);
  })
  .catch((err) => {
    console.log(err)
    console.log('catch')
      res.status(500);
      res.send('Error sending email! Please send email manually to ' + process.env.EMAIL_SENDER);
  })
})
 
app.listen(port)


console.log('Listening on port: ' + port)