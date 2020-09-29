const Concert = require('../models/concert');
const Ticket = require('../models/ticket');
const Buyer = require('../models/buyer');
const Sector = require('../models/sector');
const Info = require('../models/info');
const Availability = require('../models/availability');
const Row = require('../models/row');
const User = require('../models/user');
const Member = require('../models/member');
const Seq = require('sequelize');

const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

const helper = require('../helpers/helper');
const mail = require('../utils/mailService');

exports.getIndex = (req, res, next) => {
  Concert.findAll({
    limit: 2,
    order: [['date', 'DESC']],
  })
    .then((concerts) => {
      res.render('admin/dashboard', {
        pageTitle: 'Dashboard',
        path: '/',
        username: 'Max Mustermann',
        concerts: concerts,
      });
    })
    .catch((err) => {
      console.log(err);
      helper.crash(req, res);
    });
};

exports.getConcerts = (req, res, next) => {
  Concert.findAll({
    order: [['date', 'DESC']],
  })
    .then((concerts) => {
      res.render('admin/concerts', {
        pageTitle: 'Konzerte',
        path: '/concerts',
        username: 'Max Mustermann',
        concerts: concerts,
      });
    })
    .catch((err) => {
      console.log('err:', err);
      helper.crash(req, res);
    });
};

exports.getConcert = (req, res, next) => {
  const conId = req.params.concertId;
  let con;

  Concert.findByPk(conId)
    .then((concert) => {
      con = concert;

      return concert.getBuyers({
        include: [
          {
            model: Ticket,
          },
        ],
      });
    })
    .then(async (buyers) => {
      //ausrechnen der gesamtsumme pro käufer (sum)
      //ausrechnen der gesamtsumme des konzerts (bigsum)
      //ausrechnen der Kartenanzahl
      //ausrechnen der einzelrabatte
      //ausrechnen des gesamtrabattes
      con.incomes = 0;

      buyers.forEach((buyer) => {
        let sum = 0;
        // buyer.discount = 0;
        buyer.quantity = 0;

        buyer.tickets.forEach((ticket) => {
          sum += ticket.price * ticket.amount;
          // buyer.discount += ticket.price * ticket.amount * ticket.discount;
          buyer.quantity += ticket.amount;
          console.log(
            `ticket: ${ticket.rowName}, price: ${ticket.price}, quantity: ${ticket.amount}, sum: ${sum}`
          );
        });
        buyer.total = sum;
        con.incomes += sum;
      });

      res.render('admin/concert', {
        pageTitle: 'Konzerte',
        username: 'Max Mustermann',
        buyers: buyers,
        concert: con,
      });
    })
    .catch((err) => {
      console.log('err:', err);
      helper.crash(req, res);
    });
};

exports.postConcertUpdate = (req, res, next) => {
  const conId = req.params.concertId;
  console.log(req.body);

  let ids = [];

  Object.keys(req.body).forEach((buyerId) => {
    if (buyerId != '_csrf') {
      ids.push(buyerId);
    }
  });

  console.log(ids);
  Buyer.update(
    {
      is_paid: Seq.literal('NOT is_paid'),
    },
    {
      where: {
        id: ids,
      },
    }
  )
    .then((result) => {
      console.log(1);
      return Buyer.findAll({ where: { id: ids } });
    })
    .then((buyers) => {
      console.log('buyers:', buyers);
      let soldAdd = 0;
      buyers.forEach((buyer) => {
        if (buyer.is_paid) soldAdd++;
        else if (!buyer.is_paid) soldAdd--;
      });

      console.log(soldAdd);

      return Concert.update(
        {
          sold: Seq.literal(`sold + ${soldAdd}`),
        },
        {
          where: {
            id: conId,
          },
        }
      );
    })
    .then((result) => {
      console.log('result:', result);
      res.redirect('/manage/concert/' + conId);
    })
    .catch((err) => {
      console.log('err:', err);
      helper.crash(req, res);
    });
};

exports.getNewConcert = (req, res, next) => {
  Sector.findAll().then((sectors) => {
    res.render('admin/newconcert', {
      pageTitle: 'Konzert erstellen',
      path: '/nix',
      username: 'Max Mustermann',
      sectors: sectors,
      editing: false,
    });
  });
};

exports.postNewConcert = (req, res, next) => {
  const name = req.body.name;
  const componist = req.body.componist;
  const date = req.body.date;
  const sellStart = req.body.sell_start;
  const sellEnd = req.body.sell_end;
  const location = req.body.location;
  const startTime = req.body.startTime;
  let info = req.body.info;
  info = helper.nl2br(info, false);
  let sectors = [[], [], [], [], []];
  let con;

  Object.keys(req.body).forEach((key) => {
    const lastDigit = parseInt(key.substring(key.length - 1));

    if (lastDigit) {
      sectors[lastDigit - 1].push(key.substring(0, key.length - 1));
    }
  });

  Concert.create({
    name: name,
    componist: componist,
    date: date,
    sell_start: sellStart,
    sell_end: sellEnd,
  })
    .then((concert) => {
      con = concert;

      // concert.createSeat({
      //   is_available: sectors[sectorId - 1],
      //   max_seats: maxSeats,
      //   orders: 0,
      //   generalId: generalId
      // });

      return concert.createInfo({
        info: info,
        location: location,
        time: startTime,
      });
    })
    .then(async (info) => {
      const loop = (sectors, i) => {
        console.log(i);
        if (i > 4) return;

        let obj = {};

        sectors[i].forEach((area) => {
          obj[area] = true;
        });
        obj.sectorId = i + 1;
        console.log(obj);

        con
          .createAvailability(obj)
          .then((av) => {
            loop(sectors, i + 1);
          })
          .catch((err) => {
            console.log('err:', err);
          });
      };

      return loop(sectors, 0);
    })
    .then((result) => {
      return helper.createSeats(con, sectors);
    })
    .then((result) => {
      console.log('result:', result);
      res.redirect('/manage/concerts');
    })
    .catch((err) => {
      console.log('err:', err);
      let msg;
      if (err.parent.code == 'ER_TRUNCATED_WRONG_VALUE')
        msg = 'Du hast nicht alle Werte korrekt eingegeben.';
      else
        msg =
          'Es ist leider ein Fehler aufgetreten, bitte versuch es noch einmal.';
      console.log('err:', err);

      res.render('err', {
        status: 500,
        msg: msg,
        errMsg: err,
      });
    });
};

exports.getConcertEdit = (req, res, next) => {
  const conId = req.params.concertId;
  let secs;

  Sector.findAll()
    .then((sectors) => {
      secs = sectors;

      return Concert.findByPk(conId, {
        include: [
          {
            model: Info,
          },

          {
            model: Availability,
          },
        ],
      });
    })
    .then((concert) => {
      res.render('admin/newconcert', {
        pageTitle: 'Konzerte',
        path: '/nix',
        username: 'Max Mustermann',
        sectors: secs,
        concert: concert,
        editing: true,
      });
    })
    .catch((err) => {
      console.log('err:', err);
      helper.crash(req, res);
    });
};

exports.postConcertEdit = (req, res, next) => {
  const conId = req.params.concertId;
  const name = req.body.name;
  const componist = req.body.componist;
  const date = req.body.date;
  const sellStart = req.body.sell_start;
  const sellEnd = req.body.sell_end;
  const location = req.body.location;
  const startTime = req.body.startTime;
  let info = req.body.info;
  let sectors = [[], [], [], [], []];

  info = helper.nl2br(info, false);

  Object.keys(req.body).forEach((key) => {
    const lastDigit = parseInt(key.substring(key.length - 1));

    if (lastDigit) {
      sectors[lastDigit - 1].push(key.substring(0, key.length - 1));
    }
  });

  Concert.findByPk(conId, {
    include: [
      {
        model: Info,
      },

      {
        model: Availability,
      },
      {
        model: Row,
      },
    ],
  })
    .then((concert) => {
      concert.name = name;
      concert.componist = componist;
      concert.date = date;
      concert.sell_start = sellStart;
      concert.sell_end = sellEnd;
      concert.info.location = location;
      concert.info.time = startTime;
      concert.info.info = info;

      concert.availabilities.forEach((av) => {
        av.is_available = false;
        av.hr = false;
        av.hl = false;
        av.sr = false;
        av.sl = false;
        av.hrs = false;
        av.hls = false;
        av.srs = false;
        av.sls = false;
        av.er = false;
        av.el = false;
        av.lr = false;
        av.ll = false;
      });

      sectors.forEach((sector, i) => {
        sector.forEach((area) => {
          concert.availabilities[i][area] = true;
        });
      });

      concert.save();
      concert.info.save();

      concert.availabilities.forEach((av) => {
        av.save();
      });

      concert.rows.forEach((row) => {
        //checkt ob sektor verfügbar ist
        let av = concert.availabilities.find(
          (av) => av.sectorId == row.sectorId
        );
        let area = row.generalId.split('-')[0];

        let isAv = av[area];
        if (isAv && row.orders < row.max_seats && av.is_available)
          row.is_available = true;
        else row.is_available = false;

        row.save();
      });
    })
    .then((concert) => {
      res.redirect('/manage/concerts');
    })
    .catch((err) => {
      // let msg =
      //   'Es ist leider ein Fehler aufgetreten, bitte versuch es noch einmal.';
      console.log('err:', err);

      helper.crash(req, res);
    });
};

exports.getNoApproval = (req, res, next) => {
  res.render('admin/noApproval', {
    pageTitle: 'Keine Berechtigung',
  });
};

exports.getApprovals = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.render('admin/approvals', {
        pageTitle: 'Genehmigungen',
        path: '/approvals',
        users: users,
      });
    })
    .catch((err) => {
      helper.crash(req, res);
      console.log('err:', err);
    });
};

exports.postApprovals = async (req, res, next) => {
  console.log('req:', req.body);
  try {
    for (userId in req.body) {
      if (!Number.isInteger(Number.parseInt(userId))) continue;
      await User.update(
        {
          approvalCode: req.body[userId],
        },
        {
          where: {
            id: userId,
          },
        }
      )
        .then((result) => {
          console.log(`Genehmigung für ${userId} aktualisiert`);
          return;
        })
        .catch((err) => {
          console.log('err:', err);
          throw new Error(err);
        });
    }
    console.log('Alle Berechtigungen der User wurden aktualisiert');
    helper.flashAndRedirct(
      '/manage/approvals',
      'success',
      'Alle Nutzer wurden aktualisiert',
      req,
      res
    );
  } catch (error) {
    helper.flashAndRedirct(
      '/manage/approvals',
      'error',
      'Leider gab es einen Datenbankfehler, bitte versuche es noch einmal!',
      req,
      res
    );
  }
};

exports.getChorAdministration = (req, res, next) => {
  Member.findAll({
    order: [['name', 'ASC']],
  })
    .then((members) => {
      const memberData = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        all: members.length,
        singers: 0,
      };

      members.forEach((member) => {
        member.voice = helper.getVoiceName(member.catCode);
        memberData[member.catCode]++;
        if (member.catCode < 4) memberData.singers++;
      });
      res.render('admin/choradmin', {
        path: '/settings',
        members: members,
        memberData: memberData,
      });
    })
    .catch((err) => {
      console.log(err);
      helper.crash(req, res);
    });
};

exports.postChorAdministration = (req, res, next) => {};

exports.getAddMember = (req, res, next) => {
  res.render('admin/addmember');
};

exports.postAddMember = (req, res, next) => {
  const firstname = req.body.firstname;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const catCode = req.body.catCode;

  Member.create({
    firstname: firstname,
    name: name,
    email: email,
    phone: phone,
    catCode: catCode,
  })
    .then((member) => {
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'success',
        `${member.firstname + ' ' + member.name} wurde hinzugefügt.`,
        req,
        res
      );

      member.voice = helper.getVoiceName(Number.parseInt(member.catCode));

      const mailObj = {
        templateId: 2,
        member: member,
      };
      mail.send(
        'Du bist jetzt Mitglied!',
        'Willkommen im Chor der Kalvarienberkirche',
        member.email,
        'no-reply@kalvarienberkirche.at',
        mailObj
      );
    })
    .catch((err) => {
      console.log(err);
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'error',
        'Leider gab es einen Datenbankfehler, bitte versuche es noch einmal!',
        req,
        res
      );
    });
};

exports.getDeleteMember = (req, res, next) => {
  const memberId = req.params.memberId;
  Member.destroy({
    where: {
      id: memberId,
    },
  })
    .then((result) => {
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'success',
        'Das Mitglied wurde erfolgreich entfernt',
        req,
        res
      );
    })
    .catch((err) => {
      console.log('err:', err);
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'error',
        'Leider gab es einen Datenbankfehler, bitte versuche es noch einmal!',
        req,
        res
      );
    });
};

exports.getEditMember = (req, res, next) => {
  const memberId = req.params.memberId;

  Member.findByPk(memberId)
    .then((member) => {
      res.render('admin/addmember', {
        editing: true,
        member: member,
      });
    })
    .catch((err) => {
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'error',
        'Leider gab es einen Datenbankfehler, bitte versuche es noch einmal!',
        req,
        res
      );
    });
};

exports.postEditMember = (req, res, next) => {
  const memberId = req.params.memberId;
  const firstname = req.body.firstname;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const catCode = req.body.catCode;

  Member.update(
    {
      firstname: firstname,
      name: name,
      email: email,
      phone: phone,
      catCode: catCode,
    },
    {
      where: {
        id: memberId,
      },
    }
  )
    .then((member) => {
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'success',
        `${firstname + ' ' + name} wurde aktualisiert.`,
        req,
        res
      );
    })
    .catch((err) => {
      console.log(err);
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'error',
        'Leider gab es einen Datenbankfehler, bitte versuche es noch einmal!',
        req,
        res
      );
    });
};

exports.getCsv = (req, res, next) => {
  const csvStringfier = createCsvWriter({
    header: [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'E-Mail' },
      { id: 'tel', title: 'Tel.' },
      { id: 'stimme', title: 'Stimme' },
    ],
  });

  Member.findAll({ order: [['name', 'ASC']] })
    .then((members) => {
      let csvData = [
        {
          id: 'ID',
          name: 'Name',
          email: 'E-Mail',
          tel: 'Tel.',
          stimme: 'Stimme',
        },
      ];
      members.forEach((member) => {
        csvData.push({
          id: member.id,
          name: member.name.toUpperCase() + ' ' + member.firstname,
          email: member.email,
          tel: member.phone,
          stimme: helper.getVoiceName(member.catCode),
        });
      });

      csvFile = csvStringfier.stringifyRecords(csvData);
      res.header('Content-Type', 'text/csv');
      res.attachment('singers.csv');
      return res.send(csvFile);
    })
    .catch((err) => {
      console.log(err);
      helper.flashAndRedirct(
        '/manage/chorsetting',
        'error',
        'Leider gab es einen Datenbankfehler, bitte versuche es noch einmal!',
        req,
        res
      );
    });

  // const csvWriter = createCsvWriter({
  // })
};

exports.postEmail = (req, res, next) => {
  let toSearch = req.body.toSelect;
  const subject = req.body.subject;
  const content = req.body.content;

  if (!(toSearch && subject && content)) return helper.crash(req, res, 1);

  if (toSearch == 4) toSearch = [0, 1, 2, 3];

  Member.findAll({
    where: {
      catCode: toSearch,
    },
  })
    .then((members) => {
      let maillist = [];
      members.forEach((member) => {
        if (maillist.includes(member.email)) return;
        maillist.push(member.email);
      });

      return mail.send(subject, content, maillist, req.session.user.email);
    })
    .then((result) => {
      if (result.message != 'success') return helper.crash(req, res, 3);
      helper.flashAndRedirct(
        '/manage',
        'success',
        'Die email wurde erfolgreich versendet!',
        req,
        res
      );
    })
    .catch((err) => {
      console.log('err:', err);
      helper.crash(req, res);
    });
};
