const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const pug = require('pug');

const path = require('path');

const help = require('../helpers/helper');
const { Ticket } = require('../models');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);

const getHtml = (templateName, replacements) => {
  const file = path.join(__dirname, '/../views/mail/' + templateName + '.pug');

  return pug.compileFile(file, replacements)(replacements);
};

exports.send = (
  subject,
  content,
  to,
  from,
  template = null,
  attachment = null
) => {
  let html = null;

  return new Promise((res, rej) => {
    if (template) {
      switch (template.templateId) {
        case 1:
          html = getHtml('reservation', template);
          break;
        case 2:
          html = getHtml('member', template);
        default:
          break;
      }
    }

    if (!Array.isArray(to)) to = [to];

    let mailOptions = {
      to: to,
      from: from,
      subject: subject,
      text: content,
    };
    if (template) mailOptions.html = html;
    if (attachment)
      mailOptions.attachments = [
        {
          content: attachment,
          filename: 'ticket.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ];

    // console.log(mailOptions);

    transporter
      .sendMail(mailOptions)
      .then((result) => {
        // console.log('result:', result);
        // console.log('Email send to: ', to);
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};
