//um code zu verstehen muss man den Sitzplan der Kirche ansehen
exports.createSeats = (concert, sectors) => {
  console.log(sectors);
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
          console.log('row:', row);
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
          console.log('row:', row);
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

      console.log('Reihe: ', i);

      concert
        .createRow({
          is_available:
            sectors[sectorId - 1].includes('is_available') &&
            sectors[sectorId - 1].includes('sl'),
          max_seats: maxSeats,
          orders: 0,
          generalId: 'sl-' + i,
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
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
          console.log('row:', row);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Emporen Sitzplätze
    for (i = 1; i <= 13; i++) {
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
          console.log('row:', row);
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
          console.log('row:', row);
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
          generalId: 'hl-' + startChar0,
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
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
          generalId: 'hr-' + startChar0,
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
          generalId: 'sl-' + startChar,
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
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
          generalId: 'sr-' + startChar,
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }

    //Lodgenplätze (in zwei reihen)
    for (i = 1; i <= 7; i++) {
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
          generalId: 'll-' + (sectorId == 4 ? '1-' + i : '2-' + (i - 3)),
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
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
          generalId: 'lr-' + (sectorId == 4 ? '1-' + i : '2-' + (i - 3)),
          sectorId: sectorId
        })
        .then(row => {
          console.log('row:', row);
        })
        .catch(err => {
          console.log('err:', err);
        });
    }
  } catch (err) {
    console.log(err);
  }
};
