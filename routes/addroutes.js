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

exports.addNewCoordinator = function(req,res){
  sess = req.session;
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  connection.query("insert into User (email,password,role,name) values(?,?,'coordinator',?)",[email,password,name], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      res.redirect("/admindashboard");
    }
  });
};

exports.addNewPatient = function(req,res){
  sess = req.session;
  console.log(sess);
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var age = req.body.age;
  var gender = req.body.gender;
  connection.query("insert into Patient(email,password,name,age,gender) value(?,?,?,?,?);",[email,password,name,age,gender], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      res.redirect("/admindashboard");
    }
  });
};

exports.addNewStudy = function(req,res){
  var userid = req.session.userid;
  var name = req.body.name;
  var description = req.body.description;
  var role = req.session.role;
  connection.query("insert into Study(name,description,userid) value(?,?,?)",[name,description,userid], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      if(role=="admin"){
        res.redirect("/admindashboard");
      }else{
        res.redirect("/coordinatordashboard");
      }
    }
  });
};

exports.addNewSurvey = function(req,res){
  var userid = req.session.userid;
  var name = req.body.name;
  var description = req.body.description;
  var role = req.session.role;
  connection.query("insert into Survey(name,description,userid) value(?,?,?)",[name,description,userid], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      if(role=="admin"){
        res.redirect("/admindashboard");
      }else{
        res.redirect("/coordinatordashboard");
      }
    }
  });
};

exports.addNewMessage = function(req,res){
  var userid = req.session.userid;
  var name = req.body.name;
  var description = req.body.description;
  var type = req.body.type;
  var role = req.session.role;
  connection.query("insert into Message(name,description,type,userid) value(?,?,?,?)",[name,description,type,userid], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      if(role=="admin"){
        res.redirect("/admindashboard");
      }else{
        res.redirect("/coordinatordashboard");
      }
    }
  });
};

exports.addNewPatientToStudy = function(req,res){
  var studyid = req.body.studyid;
  var patientid = req.body.patientid;
  connection.query("insert into Study_Patient values(?,?)",[studyid,patientid], function (error, results, fields){
    if (error) {
      res.send({
        "status":"error"
      });
    }else{
      res.send({
        "status":"success",
        "userid":req.session.userid
      });
    }
  });
};

exports.getAllPatientNotInStudy = function(req,res){
  var studyid = req.body.studyid;
  connection.query("select Patient.patientid,Patient.email,Patient.name,Patient.age,Patient.gender from Patient where Patient.patientid not in (select Patient.patientid from Patient inner join Study_Patient on Study_Patient.patientid=Patient.patientid inner join Study on Study_Patient.studyid=Study.studyid where Study.studyid=?)",[studyid], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      res.send({
        "result":results
      });
    }
  });
};

exports.addNewSurveyToStudy = function(req,res){
  var studyid = req.body.studyid;
  var surveyid = req.body.surveyid;
  connection.query("insert into Study_Survey values(?,?)",[surveyid,studyid], function (error, results, fields){
    if (error) {
      res.send({
        "status":"error"
      });
    }else{
      res.send({
        "status":"success",
        "userid":req.session.userid
      });
    }
  });
};

exports.getAllSurveyNotInStudy = function(req,res){
  var userid = req.session.userid;
  var studyid = req.body.studyid;
  connection.query("select Survey.surveyid,Survey.name,Survey.description, User.email from Survey inner join User on Survey.userid=User.userid where User.userid=? and Survey.surveyid not in (select Survey.surveyid from Survey inner join Study_Survey on Study_Survey.surveyid=Survey.surveyid inner join Study on Study_Survey.studyid = Study.studyid where Study.studyid=?);",[userid,studyid], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      res.send({
        "result":results
      });
    }
  });
};

exports.addNewMessageToStudy = function(req,res){
  var studyid = req.body.studyid;
  var messageid = req.body.messageid;
  console.log(studyid);
  console.log(messageid);
  connection.query("Update Message set studyid=? where messageid=?;",[studyid,messageid], function (error, results, fields){
    if (error) {
      res.send({
        "status":"error"
      });
    }else{
      res.send({
        "status":"success",
        "userid":req.session.userid
      });
    }
  });
};

exports.getAllMessageNotInStudy = function(req,res){
  var userid = req.session.userid;
  var studyid = req.body.studyid;
  connection.query("select Message.messageid,Message.name,Message.description, Message.type, User.email from Message inner join User on Message.userid=User.userid  where Message.userid=? and (isnull(Message.studyid) or Message.studyid not in (select Message.studyid from Message inner join Study on Study.studyid=Message.studyid inner join User on User.userid=Message.userid where Message.studyid=?))",[userid,studyid], function (error, results, fields){
    if (error) {
      res.redirect("/error");
    }else{
      res.send({
        "result":results
      });
    }
  });
};

exports.addNewQuestionToStudy = function(req,res){
  var surveyid = req.body.surveyid;
  var question = req.body.question;
  var type = req.body.type;
  var likertscale = req.body.likertscale;
  if(likertscale === "undefined"){
    likertscale="null";
  }
  console.log(surveyid);
  console.log(question);
  console.log(type);
  connection.query("insert into Question(question,type,surveyid,likertscale) value(?,?,?,?)",[question,type,surveyid,likertscale], function (error, results, fields){
    if (error) {
      res.send({
        "status":"error"
      });
    }else{
      res.send({
        "result":results
      });
    }
  });
};
