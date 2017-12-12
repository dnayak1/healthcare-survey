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

exports.costudylist = function(req,res){
  userid = req.body.userid || req.session.userid;
    connection.query("select Study.studyid,Study.name,Study.description,User.email from Study inner join User on Study.userid=User.userid where User.userid=?",[userid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
};
exports.cosurveylist = function(req,res){
  userid = req.body.userid || req.session.userid;
    connection.query("select Survey.surveyid,Survey.name,Survey.description,User.email from Survey inner join User on Survey.userid=User.userid where User.userid=?",[userid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
};
exports.comessagelist = function(req,res){
  userid = req.body.userid || req.session.userid;
    connection.query("select Message.messageid,Message.name,Message.description,Message.type,User.email from Message inner join User on User.userid=Message.userid where User.userid=?",[userid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
};

exports.detailpatientlist = function(req,res){
  studyid = req.body.studyid;
    connection.query("select Patient.patientid,Patient.email,Patient.name,Patient.age,Patient.gender from Patient inner join Study_Patient on Study_Patient.patientid=Patient.patientid inner join Study on Study_Patient.studyid=Study.studyid where Study.studyid=?",[studyid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
};

exports.detailsurveylist = function(req,res){
  studyid = req.body.studyid;
    connection.query("select Survey.surveyid,Survey.name,Survey.description,User.email from Survey inner join User on User.userid=Survey.userid inner join Study_Survey on Study_Survey.surveyid=Survey.surveyid inner join Study on Study_Survey.studyid = Study.studyid where Study.studyid=?",[studyid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
};

exports.detailmessagelist = function(req,res){
  studyid = req.body.studyid;
    connection.query("select Message.messageid,Message.name,Message.description, Message.type, User.email from Message inner join Study on Study.studyid=Message.studyid inner join User on User.userid=Message.userid where Study.studyid=?",[studyid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        res.send({
          "result":results
        });
      }
    });
};
