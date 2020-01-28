exports.get404 = (req, res, next) => {
  res.render('err', {
    status: 404,
    msg: 'Seite konnte nicht gefunden werden!'
  });
};
