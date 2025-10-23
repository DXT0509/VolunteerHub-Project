const db = require('./../../config/db');

class EventModel {
    getAllEvents() {
        return new Promise((resolve,reject) => {
            const str = 'SELECT event_id, title, content, address, time, image FROM event ORDER BY time DESC';
            db.query(str, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = new EventModel();
