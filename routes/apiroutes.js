
var dbconnection = require('../dbconnection');
var connection = dbconnection.connection;
var jwt = require('jsonwebtoken');
var message;
exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  var device = req.body.device;
  connection.query('SELECT * FROM Patient WHERE email = ? && password = ?',[email,password], function (error, results, fields) {
  if (error) {
    message = "error occured";
    res.send({
      "code":400,
      "message":message
    })
  }else{
    console.log(results);
    if(results.length > 0){
        var user = {
          "patientid":results[0].patientid,
          "name":results[0].name,
          "email":results[0].email,
          "age":results[0].age,
          "gender":results[0].gender
        };
        var token = jwt.sign(user, 'superSecret');
        connection.query('UPDATE Patient set device = ? where email = ?',[device,email], function (error, results, fields){
          if(error){
            message = "UserName and password does not match";
            res.send({
              "code":400,
              "message":message
                });
          }else{
              res.send({
                "code":200,
                "token":token,
                "id":user.id,
                "name":user.name,
                "email":user.email,
                "age":user.age,
                "gender":user.gender
                  });
          }
        });
    }
    else{
      message="UserName and password does not match";
      res.send({
        "code":400,
        "message":message
          });
    }
  }
  });
};

exports.logout = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        console.log(decoded.email);
        var email = decoded.email;
        connection.query('UPDATE Patient SET device = "" where email = ?',[email], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Invalid data. Try again"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Successfully logged out";
            res.send({
              "code":200,
              "message":message,
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.getStudiesForPatient = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        var patientid = decoded.patientid;
        console.log(decoded);
        connection.query('select Study.name, Study.description, Study.studyid from Study inner join Study_Patient on Study_Patient.studyid=Study.studyid where Study_Patient.patientid=?',[patientid], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Request successfully processed";
            res.send({
              "code":200,
              "studies":results,
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};
exports.getmessagesforpatient = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var studyid=req.body.studyid;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        //var patientid = decoded.patientid;
        connection.query('select * from Message where studyid=?',[studyid], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Success";
            res.send({
              "code":200,
              "messages":results
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.getsurveysforpatient = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var studyid=req.body.studyid;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        // var patientid = decoded.patientid;
        connection.query('select * from Survey where surveyid in (select surveyid from Study_Survey where studyid=?)',[studyid], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Success";
            res.send({
              "code":200,
              "surveys":results
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.getsquestionsforsurvey = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var surveyid = req.body.surveyid;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        connection.query('select * from Question where surveyid=?',[surveyid], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Success";
            res.send({
              "code":200,
              "questions":results
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.sendanswer = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var answers = req.body.answers;
  var verify;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        for(var i=0;i<answers.length;i++){
          var questionid=answers[i].questionid;
          var patientid=answers[i].patientid;
          var answer=answers[i].answer;
          connection.query('insert into Question_Answer values(?,?,?)',[questionid,patientid,answer], function (error, results, fields){
          });
        }
        res.send({
          "code":200,
          "status":"answers submitted successfully"
          });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};
exports.sendmessageanswer = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var messageid = req.body.messageid;
  var answer = req.body.answer;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        var patientid = decoded.patientid;
        connection.query('insert into Message_Answer values(?,?,?);',[messageid,patientid,answer], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Success";
            res.send({
              "code":200,
              "questions":"Answer submitted successfully"
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.withdrawfromstudy = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var studyid = req.body.studyid;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        var patientid = decoded.patientid;
        connection.query('delete from Study_Patient where studyid=? && patientid=?',[studyid,patientid], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Success";
            res.send({
              "code":200,
              "questions":"Successfully withdrawn from study"
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.updatedevicetoken = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var device = req.body.device;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        var patientid = decoded.patientid;
        connection.query('update Patient set device=? where patientid=?',[device,patientid], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Unable to process the request"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "Success";
            res.send({
              "code":200,
              "questions":"device registered successfully"
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};
