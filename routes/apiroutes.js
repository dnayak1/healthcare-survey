
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
          "id":results[0].patientid,
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

// exports.getSurveys = function(req,res){
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   var answer = req.body.answer;
//   var id = req.body.messageid;
//   if(token){
//     jwt.verify(token, 'superSecret', function(err, decoded) {
//       if (err) {
//         message="Failed to authenticate token."
//         res.send({
//           "code": "200",
//           "message": message
//         });
//       }else{
//         connection.query('UPDATE Message SET answer = ? where id = ?',[answer,id], function (error, results, fields){
//           if (error) {
//             console.log("error ocurred",error.code);
//             message = "Invalid data. Try again"
//             res.send({
//               "code":400,
//               "message":message
//             })
//           }else{
//             message = "Successfully answered";
//             res.send({
//               "code":200,
//               "message":message,
//                 });
//           }
//         });
//       }
//     });
//   }else{
//     message="Invalid token";
//     res.send({
//       "code":400,
//       "message":message
//     });
//   }
// };
// exports.getmessages = function(req,res){
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   if(token){
//     jwt.verify(token, 'superSecret', function(err, decoded) {
//       if (err) {
//         message="Failed to authenticate token."
//         res.send({
//           "code": "200",
//           "message": message
//         });
//       }else{
//         connection.query('Select * from message', function (error, results, fields){
//           if (error) {
//             console.log("error ocurred",error.code);
//             message = "Invalid data. Try again"
//             res.send({
//               "code":400,
//               "message":message
//             })
//           }else{
//             message = "Success";
//             res.send({
//               "code":200,
//               "result":results
//                 });
//           }
//         });
//       }
//     });
//   }else{
//     message="Invalid token";
//     res.send({
//       "code":400,
//       "message":message
//     });
//   }
// };


// exports.device = function(req,res){
//   var deviceToken = req.body.deviceToken;
//   connection.query('INSERT INTO device values (?)',[deviceToken], function (error, results, fields){
//     if (error) {
//       console.log("error ocurred",error.code);
//       message = "Invalid data. Try again"
//       res.send({
//           "code":400,
//           "message":message
//         })
//     }else{
//       message = "Device successfully registered";
//       res.send({
//         "code":200,
//         "message":message,
//           });
//     }
//   });
// };
