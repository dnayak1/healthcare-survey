var dbconnection = require('../dbconnection');
var connection = dbconnection.connection;
var role ;
var sess;
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM User WHERE email = ? && password = ?',[email,password], function (error, results, fields) {
    if (error) {
      res.redirect("/error");
    }else{
      sess = req.session;
      sess.email = email;
      sess.role = results[0].role;
      sess.userid = results[0].userid;
        if(results[0].role=='admin'){
          res.redirect("/admindashboard");
        }else{
          res.redirect("/coordinatordashboard");
        }
      }
  });
};

exports.coordinatorlist = function(req,res){
  role = req.session.role;
  if(role=='admin'){
    connection.query("select userid,name,email from User where role='coordinator'", function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
  }
  else {
    res.redirect("/showSignInPage");
  }
};

exports.patientlist = function(req,res){
  role = req.session.role;
  if(role=='admin'){
    connection.query("select email,name,age,gender from Patient;", function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
  }
  else {
    res.redirect("/showSignInPage");
  }
};

exports.studylist = function(req,res){
  role = req.session.role;
  if(role=='admin'){
    connection.query("select Study.name,Study.description,User.email from Study inner join User on Study.userid=User.userid", function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
  }
  else {
    res.redirect("/showSignInPage");
  }
};
exports.surveylist = function(req,res){
  role = req.session.role;
  if(role=='admin'){
    connection.query("select Survey.name,Survey.description,User.email from Survey inner join User on Survey.userid=User.userid", function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
  }
  else {
    res.redirect("/showSignInPage");
  }
};
exports.messagelist = function(req,res){
  role = req.session.role;
  if(role=='admin'){
    connection.query("select Message.name,Message.description,Message.type,User.email from Message inner join User on User.userid=Message.userid", function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
  }
  else {
    res.redirect("/showSignInPage");
  }
};
