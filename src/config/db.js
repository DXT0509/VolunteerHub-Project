const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',      // hoặc 127.0.0.1
    user: 'root',           // tên user MySQL
    password: '',           // mật khẩu (nếu có thì điền vào)
    database: 'volunteerhub' // tên database bạn muốn kết nối
});

connection.connect((err) => {
    if (err) {
        console.error('Kết nối thất bại:', err);
    } else {
        console.log('Kết nối MySQL thành công!');
    }
});

module.exports = connection;
