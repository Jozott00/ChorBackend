const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const help = require('../helpers/helper');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY
    }
  })
);

exports.send = (subject, content, to, from, template = null) => {
  return new Promise((res, rej) => {
    if (template) {
      switch (template.templateId) {
        case 1:
          content = help.getOrderedMail(template);
          break;
        default:
          break;
      }
    }

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
