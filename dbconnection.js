var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : '18.217.3.86',
  user     : 'root',
  password : 'liverpool',
  database : 'healthcare_survey'
});

exports.connection=connection;
