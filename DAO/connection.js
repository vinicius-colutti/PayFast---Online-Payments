var mysql  = require('mysql');

function createDBConnection(){
		return mysql.createConnection({
      host: 'db-eontech.mysql.uhserver.com',
      user: 'eontechmaster',
      password: 'Kelow1203@',
      database: 'db_eontech'
		});
}

module.exports = function() {
	return createDBConnection;
}
