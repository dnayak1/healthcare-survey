var dbconnection = require('../dbconnection');
var connection = dbconnection.connection;
var schedule = require('node-schedule');
var agent = require('./header');
var question="";
var message=""
//  , device = require('../device');
exports.notification = function(req,res){
    var surveyid=req.body.surveyid;
    var studyid=req.body.studyid;
    var status=req.body.status;
    var surveyname=req.body.surveyname;

    connection.query('SELECT * FROM Question WHERE surveyid = ?',[surveyid], function (error, results, fields) {
      if (error) {
        res.redirect("/error");
      }else{
        question=results;
        connection.query('select Patient.device from Patient inner join  Study_Patient on Study_Patient.patientid=Patient.patientid inner join  Study on Study_Patient.studyid=Study.studyid where Study.studyid=? and Patient.device is not null',[studyid], function (error, results, fields) {
        if (error) {
          message = "error occured";
          res.send({
            "code":400,
            "message":message
          })
        }else{
          if(results.length > 0){
            for(var i = 0;i<results.length;i++){
              var device = results[i].device;
              switch (req.body.status) {
                case 'Hourly':
                  var rule = new schedule.RecurrenceRule();
                  rule.minute = 60;
                  var j = schedule.scheduleJob(rule, function(){
                    console.log('hourly notification');
                    sendNotification(question,device);
                  });
                  break;
                case 'DailyOnce':
                  var time = req.body.time;
                  var arr = time.split(':');
                  var hour = parseInt(arr[0]);
                  var minute = parseInt(arr[1]);
                  var rule = new schedule.RecurrenceRule();
                  rule.hour = hour;
                  rule.minute = minute;
                  var j = schedule.scheduleJob(rule, function(){
                    console.log('daily notification once');
                    sendNotification(question,device);
                  });
                  break;
                case 'DailyTwice':
                  var time1 = req.body.time1;
                  var time2 = req.body.time2;
                  var arr1 = time1.split(':');
                  var arr2 = time2.split(':');
                  var hour1 = parseInt(arr1[0]);
                  var minute1= parseInt(arr1[1]);
                  var hour2 = parseInt(arr2[0]);
                  var minute2= parseInt(arr2[1]);
                  var rule1 = new schedule.RecurrenceRule();
                  var rule2 = new schedule.RecurrenceRule();
                  rule1.hour = hour1;
                  rule1.minute = minute1;
                  rule2.hour = hour2;
                  rule2.minute = minute2;
                  var j1 = schedule.scheduleJob(rule1, function(){
                    console.log('daily notification twice1');
                    sendNotification(question,device);
                  });
                  var j2 = schedule.scheduleJob(rule2, function(){
                    console.log('daily notification twice2');
                    sendNotification(question,device);
                  });
                  break;
                default:
                  console.log("default notification");
                  sendNotification(question,device);

              };
            }
                res.send({
                  "status":"ok"
                });
          }
          else{
            message="Device not available";
            res.send({
              "code":400,
              "message":message
                });
          }
        }
        });
        }
    });
    function sendNotification(question,device){
      console.log(question);
      console.log(surveyname);
      console.log("sending notification");
      agent.createMessage()
      .device(device)
      .alert('New notification received')
      .set('question',question)
      .set('surveyname',surveyname)
      .send();
    }
};
