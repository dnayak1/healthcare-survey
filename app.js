var express = require("express");
var login = require('./routes/loginroutes');
var add = require('./routes/addroutes');
var coordinator = require('./routes/coordinatorroutes');
var notification = require('./agent/hello');
var messagenotification = require('./agent/messagehello');
var answer = require('./routes/answerroutes');
var api = require('./routes/apiroutes');
// var patient = require('./routes/patientroutes');
// var message = require('./routes/messageroutes')
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret:'dhiraj',
                resave: true,
                saveUninitialized: true}));

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));

app.listen(5000,function(){
    console.log('Node server running @ http://localhost:5000')
});

app.get('/',function(req,res){
    res.sendFile('home.html',{'root': __dirname + '/templates'});
})

app.get('/showSignInPage',function(req,res){
    res.sendFile('signin.html',{'root': __dirname + '/templates'});
})
app.get('/admindashboard',function(req,res){
  res.sendFile('admindashboard.html',{'root':__dirname + '/templates'})
})
app.get('/coordinatordashboard',function(req,res){
  res.sendFile('coordinatordashboard.html',{'root':__dirname + '/templates'})
})
app.get('/coordinatordetails',function(req,res){
  res.sendFile('coordinatordetails.html',{'root':__dirname + '/templates'})
})
app.get('/addCoordinator',function(req,res){
  res.sendFile('addCoordinator.html',{'root':__dirname + '/templates'})
})
app.get('/addPatient',function(req,res){
  res.sendFile('addPatient.html',{'root':__dirname + '/templates'})
})
app.get('/addStudy',function(req,res){
  res.sendFile('addStudy.html',{'root':__dirname + '/templates'})
})
app.get('/addSurvey',function(req,res){
  res.sendFile('addSurvey.html',{'root':__dirname + '/templates'})
})
app.get('/addMessage',function(req,res){
  res.sendFile('addMessage.html',{'root':__dirname + '/templates'})
})
app.get('/addPatientToStudy',function(req,res){
  res.sendFile('addPatientToStudy.html',{'root':__dirname + '/templates'})
})
app.get('/addSurveyToStudy',function(req,res){
  res.sendFile('addSurveyToStudy.html',{'root':__dirname + '/templates'})
})
app.get('/addMessageToStudy',function(req,res){
  res.sendFile('addMessageToStudy.html',{'root':__dirname + '/templates'})
})
app.get('/addQuestion',function(req,res){
  res.sendFile('addQuestion.html',{'root':__dirname + '/templates'})
})
app.get('/viewAnswer',function(req,res){
  res.sendFile('viewAnswer.html',{'root':__dirname + '/templates'})
})

app.post('/login', login.login);

app.get('/coordinatorlist',login.coordinatorlist);
app.get('/patientlist',login.patientlist);
app.get('/studylist',login.studylist);
app.get('/surveylist',login.surveylist);
app.get('/messagelist',login.messagelist);

app.post('/costudylist',coordinator.costudylist);
app.post('/cosurveylist',coordinator.cosurveylist);
app.post('/comessagelist',coordinator.comessagelist);

app.post('/detailpatientlist',coordinator.detailpatientlist);
app.post('/detailsurveylist',coordinator.detailsurveylist);
app.post('/detailmessagelist',coordinator.detailmessagelist);

app.post('/addNewCoordinator', add.addNewCoordinator);
app.post('/addNewPatient', add.addNewPatient);
app.post('/addNewStudy', add.addNewStudy);
app.post('/addNewSurvey', add.addNewSurvey);
app.post('/addNewMessage', add.addNewMessage);

app.post('/addNewPatientToStudy', add.addNewPatientToStudy);
app.post('/getAllPatientNotInStudy', add.getAllPatientNotInStudy);
app.post('/addNewSurveyToStudy', add.addNewSurveyToStudy);
app.post('/getAllSurveyNotInStudy', add.getAllSurveyNotInStudy);
app.post('/addNewMessageToStudy', add.addNewMessageToStudy);
app.post('/getAllMessageNotInStudy', add.getAllMessageNotInStudy);
app.post('/addNewQuestionToStudy', add.addNewQuestionToStudy);

app.post('/notification',notification.notification);
app.post('/messagenotification',messagenotification.messagenotification);

app.post('/surveyAnswerList',answer.surveyAnswerList);
app.post('/messageAnswerList',answer.messageAnswerList);

app.post('/patientloginapi',api.login);
app.post('/patientlogoutapi',api.logout);
app.post('/getStudiesForPatientapi',api.getStudiesForPatient);
app.post('/getmessagesforpatientapi',api.getmessagesforpatient);
app.post('/getsurveysforpatientapi',api.getsurveysforpatient);
app.post('/getsquestionsforsurveyapi',api.getsquestionsforsurvey);
app.post('/sendanswerapi',api.sendanswer);
app.post('/sendmessageanswerapi',api.sendmessageanswer);
app.post('/withdrawfromstudyapi',api.withdrawfromstudy);
app.post('/updatedevicetokenapi',api.updatedevicetoken);
