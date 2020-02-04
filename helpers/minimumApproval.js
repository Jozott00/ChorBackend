/*
    GENEMIGUNGSCODES DIE VOM ADMINSTRATOR MIT CODE 15 VERGEBEN WERDEN KOENNEN

    0: Keine Berechtigung (default), kann keine Daten einsehen
    1: Darf Mails versenden
    4: Darf alles bis 2 und Ticketsverkaufen. Bekommt zugang zu tickerverkauf ohne Zahlungsmittel
    6: Alles bis 6 und hat Einsicht in aktuelle verkaufszahlen.
    8: Alles bis 8 und darf Chormitgliedseinträge verändern. (Chorverwaltung)
    9: Alles bis 9 und darf Bestellungen als bezahlt markieren oder Löschen.
    10: Alles bis 10 und darf Konzerte erstellen, sowie bearbeiten.
    15: Hat Zugriff auf alle Daten und verƒügt über die Berechtigung anderen Nuztern Genemigungen zu erteilen.

*/

exports.mailSender = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 1) return res.redirect('/manage/noapproval');
  next();
};
exports.tickerSeller = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 4) return res.redirect('/manage/noapproval');
  next();
};
exports.concertAnalyst = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 6) return res.redirect('/manage/noapproval');
  next();
};
exports.chorAdministrator = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 8) return res.redirect('/manage/noapproval');
  next();
};
exports.concertSeller = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 9) return res.redirect('/manage/noapproval');
  next();
};
exports.concertAdministrator = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 10) return res.redirect('/manage/noapproval');
  next();
};
exports.overallAdmin = (req, res, next) => {
  const approvalCode = req.session.user.approvalCode;
  if (approvalCode < 15) return res.redirect('/manage/noapproval');
  next();
};
