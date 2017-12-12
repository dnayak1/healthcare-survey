var dbconnection = require('../dbconnection');
var connection = dbconnection.connection;
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

exports.surveyAnswerList = function(req,res){
  var patientid = req.body.patientid;
  console.log(patientid);
    connection.query("select Question.question, Question.type,Question_Answer.answer from Question inner join Question_Answer on Question.questionid=Question_Answer.questionid where Question_Answer.patientid=?",[patientid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        console.log(results);
        res.send({
          "result":results
        });
      }
    });
};
exports.messageAnswerList = function(req,res){
  var patientid = req.body.patientid;
  console.log(patientid);
    connection.query("select Message.name, Message.description,Message.type,Message_Answer.answer from Message inner join Message_Answer on Message.messageid=Message_Answer.messageid where patientid=?;",[patientid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        console.log(results);
        res.send({
          "result":results
        });
      }
    });
};
