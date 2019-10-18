var mysql  = require('mysql');

function createDBConnection(){
		return mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'bcd127',
      database: 'db_fastpay'
		});
}

module.exports = function() {
	return createDBConnection;
}
