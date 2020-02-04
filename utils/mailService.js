const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY
    }
  })
);

exports.send = (subject, content, to, from) => {
  return new Promise((res, rej) => {
    transporter
      .sendMail({
        to: to,
        from: from,
        subject: subject,
        html: content
      })
      .then(result => {
        console.log('result:', result);
        console.log('Email send to: ', to);
        res(result);
      })
      .catch(err => {
        rej(err);
      });
  });
};
