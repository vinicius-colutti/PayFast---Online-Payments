var mysql  = require('mysql');

function createDBConnection(){
		return mysql.createConnection({
      host: '######',
      user: 'eontechmaster',
      password: '#######',
      database: 'db_eontech'
		});
}

module.exports = function() {
	return createDBConnection;
}
