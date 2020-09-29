const fs = require('fs');
const pug = require('pug');
const puppeteer = require('puppeteer');
const qrcode = require('qrcode');
const momemt = require('moment');

const { getSeatName } = require('../helpers/helper');
const moment = require('moment');
const { fstat } = require('fs');

exports.createTicketPdf = (buyer) => {
  //   const compilefFunction = pug.compileFile('err.pug');

  return new Promise((resolve, reject) => {
    const obj = {
      orderId: buyer.orderId,
      name: buyer.firstname + ' ' + buyer.name,
    };

    qrcode
      .toDataURL(JSON.stringify(obj))
      .then(async (dataURI) => {
        const comFct = pug.compileFile('views/tickets/ticket.pug');
        // const comFct = pug.compile(file);

        qrDataURI = dataURI;

        const dataObj = {
          concert: {
            name: buyer.concert.name,
            date: momemt(buyer.concert.date).format('DD.MM.YYYY'),
            time: buyer.concert.info.time,
            location: buyer.concert.info.location,
          },
          buyer: {
            name: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            orderId: buyer.orderId,
            paid: buyer.is_paid ? 'Ja' : 'Nein',
          },
          seats: [],
          qrCodeURI: dataURI,
        };

        buyer.tickets.forEach((ticket) => {
          dataObj.seats.push({
            quantity: ticket.amount,
            name: getSeatName(ticket.rowName),
          });
        });

        html = comFct({ data: dataObj });

        console.log('Generating PDF ...');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        console.log('PDF Generated!');
        resolve({ pdf: pdf, qrDataURI: qrDataURI, html: html });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//http://localhost:3000/checkout/success/?pva=acd7233c-d9fe-40df-b870-61c330eda15d
