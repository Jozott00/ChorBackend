const moment = require('moment');

//um code zu verstehen muss man den Sitzplan der Kirche ansehen
exports.createSeats = (concert, sectors) => {
  // console.log(sectors);
  try {
    //Hauptschiffe Reihen
    for (i = 1; i <= 20; i++) {
      let isAvHl = false;
      let isAvHr = false;
      let sectorId = 0;

      //check SectorId
      if (i <= 2) sectorId = 1;
      else if (i <= 13) sectorId = 2;
      else if (i <= 17) sectorId = 4;
      else sectorId = 5;

      //check Sitzplätze pro Reihe
      let maxSeats = 6;
      if (i == 1 || i >= 19) {
        maxSeats = 4;
      } else if ((i >= 2 && i <= 3) || (i >= 17 && i <= 18)) {
        maxSeats = 5;
      }
      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('hl'),
          max_seats: maxSeats,
          orders: 0,
          generalId: 'hl-' + i,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('hr'),
          max_seats: maxSeats,
          orders: 0,
          generalId: 'hr-' + i,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Seitenschiffe Reichen
    for (i = 1; i <= 7; i++) {
      let sectorId = 0;

      //check sectorid
      if (i <= 1) sectorId = 1;
      else if (i <= 5) sectorId = 2;
      else if (i <= 6) sectorId = 4;
      else if (i <= 7) sectorId = 5;

      let maxSeats = 10;
      if (i <= 2) maxSeats = 8;
      else if (i == 7) maxSeats = 2;

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('sl'),
          max_seats: maxSeats,
          orders: 0,
          generalId: 'sl-' + i,
          sectorId: i == 5 ? 4 : sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('sr'),
          max_seats: maxSeats,
          orders: 0,
          generalId: 'sr-' + i,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Emporen Sitzplätze
    for (i = 1; i <= 16; i++) {
      let sectorId = 0;

      //check sectorid
      if (i <= 3) sectorId = 5;
      else if (i <= 9) sectorId = 3;
      else if (i <= 11) sectorId = 2;
      else if (i == 12) sectorId = 3;
      else if (i <= 16) sectorId = 5;

      console.log('Reihe: ', i);

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('el'),
          max_seats: 1,
          orders: 0,
          generalId: 'el-' + i,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('er'),
          max_seats: 1,
          orders: 0,
          generalId: 'er-' + i,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Hauptschiff Sitzplätze (Stühle)
    let startChar0 = 'a';
    for (
      i = 1;
      i <= 21;
      i++, startChar0 = String.fromCharCode(startChar0.charCodeAt(0) + 1)
    ) {
      let sectorId = 0;
      if (i <= 15) sectorId = 2;
      else sectorId = 5;

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('hls'),
          max_seats: 1,
          orders: 0,
          generalId: 'hls-' + startChar0,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('hrs'),
          max_seats: 1,
          orders: 0,
          generalId: 'hrs-' + startChar0,
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Seitenschiff sitzplätze (Stühle)
    let startChar = 'a';
    for (
      i = 1;
      i <= 16;
      i++, startChar = String.fromCharCode(startChar.charCodeAt(0) + 1)
    ) {
      let sectorId = 0;
      if (i <= 8) sectorId = 2;
      else if (i <= 10) sectorId = 4;
      else if (i <= 12) sectorId = 2;
      else if (i <= 14) sectorId = 4;
      else sectorId = 5;

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('sls'),
          max_seats: 1,
          orders: 0,
          generalId: 'sls-' + startChar,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('srs'),
          max_seats: 1,
          orders: 0,
          generalId: 'srs-' + startChar,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Lodgenplätze (in zwei reihen)
    let startChar1 = 'a';
    for (
      i = 1;
      i <= 7;
      i++, startChar1 = String.fromCharCode(startChar1.charCodeAt(0) + 1)
    ) {
      let sectorId = 0;

      if (i <= 3) sectorId = 4;
      else sectorId = 5;

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('ll'),
          max_seats: 1,
          orders: 0,
          generalId: 'll-' + startChar1,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('lr'),
          max_seats: 1,
          orders: 0,
          generalId: 'lr-' + startChar1,
          sectorId: sectorId
        })
        .then(row => {
          console.log('Created seat ', row.generalId);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.nl2br = (str, is_xhtml) => {
  var breakTag =
    is_xhtml || typeof is_xhtml === 'undefined' ? '<br ' + '/>' : '<br>';
  return (str + '').replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    '$1' + breakTag + '$2'
  );
};

exports.flashMsg = (req, title) => {
  let msg = req.flash(title);
  if (msg.length > 0) msg = msg[0];
  else msg = null;

  return msg;
};

exports.getSeatName = seatId => {
  const seatDesc = {
    hl: 'Hauptschiff Links, Reihe',
    hr: 'Haupschiff Rechts, Reihe',
    sl: 'Seitenschiff Links, Reihe',
    sr: 'Seitenschiff Rechts, Reihe',
    hrs: 'Hauptschiff Rechts, Platz',
    hls: 'Hauptschiff Links, Platz',
    sls: 'Seitenschiff Links, Platz',
    srs: 'Seitenschiff Rechts, Platz',
    el: 'Empore Links, Platz',
    er: 'Empore Rechts, Platz',
    ll: 'Loge Links, Platz',
    lr: 'Loge Rechts, Platz'
  };

  return (
    seatDesc[seatId.split('-')[0]] + ' ' + seatId.split('-')[1].toUpperCase()
  );
};

exports.getOrderedMail = data => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
          body,
          table,
          td,
          a {
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
          }

          a {
            text-decoration: none;
            color: black !important;
          }

          .white a {
            color: white !important;
          }
  
          table,
          td {
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
          }
  
          img {
              -ms-interpolation-mode: bicubic;
          }
  
          img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
          }
  
          table {
              border-collapse: collapse !important;
          }
  
          body {
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
          }
  
          a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
          }
  
          @media screen and (max-width: 480px) {
              .mobile-hide {
                  display: none !important;
              }
  
              .mobile-center {
                  text-align: center !important;
              }
          }
  
          div[style*="margin: 16px 0;"] {
              margin: 0 !important;
          }
      </style>
  
  <body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee;" bgcolor="#eeeeee">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Open Sans, Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
          For what reason would it be advisable for me to think about business content? That might be little bit risky to have crew member like them.
      </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                      <tr>
                          <td align="center" valign="top" style="font-size:0; padding: 35px;" bgcolor="#007bfe">
                              <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                      <tr>
                                          <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; line-height: 48px;" class="mobile-center">
                                              <h1 style="font-size: 36px; font-weight: 800; margin: 0; color: #ffffff;">Chor der Kalvarienbergkirche</h1>
                                          </td>
                                      </tr>
                                  </table>
                              </div>
                              <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;" class="mobile-hide">
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                      <tr>
                                          <td align="right" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                              <table cellspacing="0" cellpadding="0" border="0" align="right">
                                                  <tr>
                                                      <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400;">
                                                          <!-- <a style="font-size: 18px; font-weight: 400; margin: 0; color: #ffffff;"><a href="#" target="_blank" style="color: #ffffff; text-decoration: none;">Shop &nbsp;</a></p> -->
                                                      </td>
                                                      <!-- <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 24px;"> <a href="#" target="_blank" style="color: #ffffff; text-decoration: none;"><img src="https://img.icons8.com/color/48/000000/small-business.png" width="27" height="23" style="display: block; border: 0px;" /></a> </td> -->
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 35px 35px 20px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                  <tr>
                                      <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 0px;"> <img src="https://img.icons8.com/carbon-copy/100/000000/checked-checkbox.png" width="125" height="120" style="display: block; border: 0px;" /><br>
                                          <h2 style="font-size: 30px; font-weight: 800; line-height: 36px; color: #333333; margin: 0;"> Danke für Ihre Bestellung! </h2>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px;">
                                          <p style="font-size: 16px; font-weight: 400; line-height: 24px; color: #777777;">Die ausgewählten Karten für das Konzert ${
                                            data.concertName
                                          } am ${moment(
    data.concertDate
  ).format('DD.MM.YYYY')} um ${data.concertTime} bei ${
    data.concertLocation
  } wurden für Sie reserviert.</p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px;">
                                          <p style="font-size: 16px; font-weight: 400; line-height: 24px; color: #777777;">Bitte überweisen Sie innerhalb der nächsten <strong>5 Tage</strong> den folgenden Betrag an die unten angeführte Zahlungsadresse. Bei Nichterhalt der Zahlung nach der Frist, wird Ihre Bestellung gelöscht und wieder für den Verkauf freigegeben! <br> Sie erhalten die Karten beim Konzerteingang vor Ort. Bitten nehmen sie einen amtlichen Lichtbildausweis mit, der Sie als Käufer der Bestellung identifiziert. </p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="left" style="padding-top: 20px;">
                                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                              <tr>
                                                  <td width="75%" align="left" bgcolor="#eeeeee" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px;"> Bestellnummer </td>
                                                  <td width="25%" align="left" bgcolor="#eeeeee" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px;"> ${
                                                    data.orderId
                                                  } </td>
                                              </tr>
                                              ${data.tickets
                                                .map(
                                                  ticket =>
                                                    ` <tr>
                                                  <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;"> ${ticket.name} (${ticket.quantity}) </td>
                                                  <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;"> € ${ticket.price},- </td>
                                              </tr>`
                                                )
                                                .join('')}
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="left" style="padding-top: 20px;">
                                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                              <tr>
                                                  <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"> GESAMT </td>
                                                  <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"> € 180,-  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" height="100%" valign="top" width="100%" style="padding: 0 35px 35px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px;">
                                  <tr>
                                      <td align="center" valign="top" style="font-size:0;">
                                          <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                  <tr>
                                                      <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
                                                          <p style="font-weight: 800;">Zahlungsadresse</p>
                                                          <p> <strong>IBAN</strong>  <br> AT21 1234 1234 1244 1234<br><strong>BIC</strong><br>NC12321</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </div>
                                          <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                  <tr>
                                                      <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
                                                          <p style="font-weight: 800;">Gibt es ein Problem?</p>
                                                          <p> <strong>Email</strong>  <br> kanzlei@chor.kalvarienbergkirche.at<br><strong>Telefon</strong><br>+431234904</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </div>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style=" padding: 35px; background-color: #007bfe;" bgcolor="#1b9ba3">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                  <tr>
                                      <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px; padding-bottom: 20px;">
                                          <h2 style="font-size: 24px; font-weight: 800; line-height: 30px; color: #ffffff; margin: 0;"> Folgende Daten wurden an uns übermittelt: </h2>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" valign="top" style="font-size:0;">
                                          <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%; color: #ffffff">
                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                  <tr>
                                                      <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
                                                          <p class="white" style="color: white !important"> <strong>Vorname</strong>  <br> ${
                                                            data.firstname
                                                          }<br><strong>Email</strong><br>${
    data.email
  }</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </div>
                                          <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%; color: #ffffff">
                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                  <tr>
                                                      <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
                                                          <p class="white" style="color: white !important"> <strong>Nachname</strong>  <br> ${
                                                            data.lastname
                                                          }<br><strong>Telefon</strong><br> ${
    data.phone
  }</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </div>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td>
                            <a href="https://www.google.com/maps/dir/48.2211434,16.3420009/Pfarre+Hernals,+Sankt-Bartholom%C3%A4us-Platz+3,+1170+Wien/@48.2191557,16.3350337,17z/data=!3m1!4b1!4m10!4m9!1m1!4e1!1m5!1m1!1s0x476d073f93f8c2a5:0x7872b672e39c328a!2m2!1d16.3315391!2d48.217563!3e3?hl=de-DE"><img src="https://i.ibb.co/gTCP4qz/pfarrmap.png" width="100%" alt="Google Maps Abbildung von Pfarre" srcset=""></a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 0 35px 0px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                  <tr>
                                      <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 24px; padding: 5px 0 10px 0;">
                                          <p style="font-size: 14px; font-weight: 800; line-height: 18px; color: #333333;"> Sankt-Bartholomäus-Platz 3 <br> 1170 Wien, Österreich </p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 24px;">
                                          <!-- <p style="font-size: 14px; font-weight: 400; line-height: 20px; color: #777777;"> If you didn't create an account using this email address, please ignore this email or <a href="#" target="_blank" style="color: #777777;">unsusbscribe</a>. </p> -->
                                          <p style="font-size: 14px; font-weight: 400; line-height: 20px; color: #777777; text-align: right;"> &copy; Chor der Kalvarienbergkirche 2020 </p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`;
};
