const db = require('./database');
const Concert = require('../model/concert');

const repository = {
  getAllConcerts: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM concert', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map((row) => Concert.fromDbRow(row)));
      });
    });
  },

  getConcertById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM concert WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row ? Concert.fromDbRow(row) : null);
      });
    });
  },

  createConcert: (concertData) => {
    const concert = concertData instanceof Concert ? concertData : Concert.fromDbRow(concertData);
    const { name, description, date, location, performers } = concert.toDbRow();
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO concert (name, description, date, location, performers)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(sql, [name, description, date, location, performers], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  updateConcert: (concertData) => {
    const concert = concertData instanceof Concert ? concertData : Concert.fromDbRow(concertData);
    const { id, name, description, date, location, performers } = concert.toDbRow();
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE concert
        SET name = ?, description = ?, date = ?, location = ?, performers = ?
        WHERE id = ?
      `;
      db.run(sql, [name, description, date, location, performers, id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  },

  deleteConcert: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM concert WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  },
};

module.exports = repository;
