const router = require('./homepage');
function route(app) {
    app.use('/',router);
    
}
module.exports = route;