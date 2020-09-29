const { Op } = require('sequelize');

const {
  Row,
  Concert,
  Sector,
  Buyer,
  Info,
  Ticket,
} = require('../models/index');

exports.getSeats = (concertId) => {
  return new Promise((resolve, reject) => {
    Row.findAll({
      where: { concertId: concertId },
      include: [
        {
          model: Ticket,
        },
      ],
    })
      .then((seats) => {
        resolve(seats);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getSectors = () => {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then((sectors) => {
        resolve(sectors);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.deleteExpiredOrders = () => {
  return new Promise((resolve, reject) => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 0);

    Buyer.findAll({
      where: {
        createdAt: {
          [Op.lt]: minDate,
        },
        is_paid: false,
      },
    })
      .then((buyers) => {
        let orderIds = buyers.map((buyer) => {
          return buyer.orderId;
        });

        this.deleteOrderByOrderID(orderIds)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            console.log('err:', err);
            reject(err);
          });
      })
      .catch((err) => {
        console.log('err:', err);
        reject(err);
      });
  });
};

exports.deleteOrderByOrderID = (orderIds) => {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(orderIds)) orderIds = [orderIds];

    resolve(
      await orderIds.forEach((orderId) => {
        Buyer.findAll({
          where: {
            orderId: orderId,
          },
          include: [
            {
              model: Concert,
            },
            {
              model: Ticket,
              include: [
                {
                  model: Row,
                },
              ],
            },
          ],
        })
          .then(async (buyers) => {
            const buyer = buyers[0];
            const tickets = buyer.tickets;

            let ticketQty = 0;
            for (const ticket of tickets) {
              ticketQty -= ticket.amount;
            }

            buyer.concert.ticketsSold -= ticketQty;
            buyer.concert.ordered--;
            await buyer.concert.save().then((con) => {
              console.log(`Concert ID${con.id} aktualisiert`);
            });

            for (const ticket of tickets) {
              await ticket.destroy();

              const row = ticket.row;
              row.orders -= ticket.amount;
              row.is_available = true;
              await row.save().then((row) => {
                console.log(`Row ID${row.generalId} aktualisiert`);
              });
            }

            buyer.concert.ticketsSold -= ticketQty;
            buyer.concert.ordered--;
            await buyer.concert.save().then((con) => {
              console.log(`Concert ID${con.id} aktualisiert`);
            });

            await buyer.destroy();

            resolve(
              buyers.map((buyer) => {
                return buyer.orderId;
              })
            );
          })
          .catch((err) => {
            console.log('err:', err);
            reject(err);
          });
      })
    );
  });
};

exports.getRowOrders = (rowId) => {};
