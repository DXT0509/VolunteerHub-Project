const db = require('./../../config/db');
class LoginModel {
    checkLogin(account, password) {
        return new Promise((resolve,reject) => {
            let str = 'SELECT account, password FROM user WHERE account = ? AND password = ?';
            db.query(str,[account,password], (err,rows) => {
                if ( err ) return reject(err);
                if (rows.length > 0) {
                    resolve(true);
                }
                else resolve(false);
            });
            
        });
    }
    addAccount(name, birthday, phone_number, account, password, role) {
        return new Promise((resolve,reject) => {
            let str = 'INSERT INTO user (name_user, birthday, phone_number_user, account, password, role) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(str,[name, birthday, phone_number, account, password, role], (err,rows) => {
                if ( err ) return reject(err);
                resolve(true);
            });
        });
    }
}
module.exports = new LoginModel;