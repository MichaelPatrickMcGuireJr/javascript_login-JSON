// init variables and synch database on load
// module-adapter package containers
var express = require('express');
var low = require('lowdb');
const url = require('url');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('public/users.json');
var db = low(adapter);
var app = express();
// setup access rights for static resources
app.use(express.static('public'));
app.use(express.static('images'));
// flags
let flags_failedLogin = 0;
// init ***********************

// 1 init interval timer
var xtime = 0;
function intervalFunc() {
  // a // react to URL hammering
  if(xtime>0)
  {
    xtime=xtime-4;
  }
  if(xtime>6)
  {
    console.log('lockout!');
  }
  else
  {
    //console.log('OK');
  }
  // a *************************
}
setInterval(intervalFunc, 2000);
// 1 ****************************

// 2 /login
app.get("/", function (request, response)
{

  response.write(
    '<html>'+
    '<head>'+
    '<link href="styles/page1.css" rel="stylesheet" type="text/css">'+
    '</head>'+
    '<body>'+
    '<form name="form1" id="form1" method="get" action="/login_profile">'+
    '<table width="100%" border="0" cellspacing="1" cellpadding="0">'+
    '<tr>'+
    '<td class="center">'+
    '<table width=250px>'+
    '<tr><td>'+
    '<img src="images/logo.png" alt="Smart Pump" class="center">'+
    '</td>'+
    '</tr>'+
    '<tr>'+
    '<td align="center">');

    if(flags_failedLogin==1)
    {
      response.write(
        '<p style="color: red; font-size: 11px;">Failed Login Attempt</p>'
      );
    }

    response.write(
      '	<table border="0">'+
      '	<tr>'+
      '	<td align="left">'+
      '	&nbspUsername<br>'+
      '	<input type="text" length="80%" name="un" style="border:1px solid #ebeced">'+
      '	</td>'+
      '	</tr>'+
      '	<tr>'+
      '	<td align="left">'+
      '	&nbspPassword<br>'+
      '	<input type="text" length="80%" name="pw" style="border:1px solid #ebeced">'+
      '	</td>'+
      '	</tr>'+
      '	<tr>'+
      '	<td align="center">'+
      '	<br>'+
      '	<input type="submit" value="LOGIN" class="button1">'+
      '	</td>'+
      '	</tr>'+
      '	</table>'+
      '</td>'+
      '</tr>'+
      '</table>'+
      '</form>'+
      '</td></tr></table>'+
      '</body>'+
      '</html>'
    );

    response.end('');

});
// 2 /login *******************************


// 3 /profile
app.get("/login_profile", function (request, response)
{
  var un = request.query.un;
  var pw = request.query.pw;
  xtime++;

  var dbUsers=[];
  var users = db.get('users').filter({ email: un }).value() // Find all users in the collection
  users.forEach(function(user)
  {
    dbUsers.push([user.name.first,user.balance]); // adds their info to the dbUsers value
  });

  if(users.length>0 && users[0].email==un && users[0].password==pw)
  {
    // reset flags_failedLogin
    flags_failedLogin=0;
    var picture = users[0].picture;
    var userid = users[0]._id;
    var balance = users[0].balance;
    var company = users[0].company;
    var firstName = users[0].name.first;
    var lastName = users[0].name.last;
    var phone = users[0].phone;
    var email = users[0].email;
    var address = users[0].address;

    const [address_1, city, state, zip] = address.split(', ');

    response.write(
      '<html>'+
      '<head>'+
      '<link href="styles/page1.css" rel="stylesheet" type="text/css">'+
      '</head>'+
      '<body>'+
      '<table width="100%" border="0" cellspacing="1" cellpadding="0">'+
      '<tr><td class="center">'+
      '<table width=250px>'+
      '<tr><td style="vertical-align:bottom"><a href="/">logout</a>'+
      '<img src="'+picture+'" alt="Profile_Picture" class="center">'+
      '<!--*************************users[0].picture-->'+
      '</td></tr><tr><td align="center">'+
      '<table border="1">'+
      '<form method="get" action="/update">'+
      ' <input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="balance">'+
      ' <tr>'+
      ' <td align="left" > <table width=100%><tr><td valign=top>balance</td><td><input type="submit" value="update?"></td></tr></table>   </td><td><input type="text" name="vals1" value="'+balance+'"></td>'+
      ' </tr>'+
      '</form>'+
      '<form method="get" action="/update">'+
      ' <input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="company">'+
      ' <tr>'+
      '	<td align="left"> <table width=100%><tr><td valign=top>company</td><td><input type="submit" value="update?"></td></tr></table>   </td><td><input type="text" name="vals1" value="'+company+'"></td>'+
      '  </tr>'+
      '</form>'+
      '<form method="get" action="/update">'+
      '<input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="firstName">'+
      '<tr>'+
      '<td align="left"> <table width=100%><tr><td valign=top>first&nbspname</td><td><input type="submit" value="update?"></td></tr></table>   </td><td><input type="text" name="vals1" value="'+firstName+'"></td>'+
      '</tr>'+
      '</form>'+
      '<form method="get" action="/update">'+
      '<input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="lastName">'+
      '<tr>'+
      '<td align="left"> <table width=100%><tr><td valign=top>last&nbspname</td><td><input type="submit" value="update?"></td></tr></table>   </td><td><input type="text" name="vals1" value="'+lastName+'"></td>'+
      '</tr>'+
      '</form>'+
      '<form method="get" action="/update">'+
      '<input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="phone">'+
      '<tr>'+
      '<td align="left"> <table width=100%><tr><td valign=top>phone</td><td><input type="submit" value="update?"></td></tr></table>   </td><td><input type="text" name="vals1" value="'+phone+'"></td>'+
      '</tr>'+
      '</form>'+
      '<form method="get" action="/update">'+
      '<input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="email">'+
      '<tr>'+
      '<td align="left"> <table width=100%><tr><td valign=top>email</td><td><input type="submit" value="update?"></td></tr></table>   </td><td><input type="text" name="vals1" value="'+email+'"></td>'+
      '</tr>'+
      '</form>'+
      '<form method="get" action="/update">'+
      '<input type="hidden" name="userid" value="'+userid+'"><input type="hidden" name="user_crit" value="address">'+
      '<tr>'+
      '<td align="left" valign="top"><table width="100%""><tr><td valign=top>address</td><td><input type="submit" value="update?"></td></tr></table> CITY&nbspSTATE&nbspZIP </td><td valign="top">'+
      '<input type="text" name="address_1" width="100%" value="'+address_1+'"><br>'+
      '<table><tr><td><input width="300px" type="text" name="city" size="10" value="'+city+'"></td><td><input width="100px" type="text" name="state" size="8" value="'+state+'"></td><td><input size="4" type="text" name="zip" value="'+zip+'"></td></tr></table>'+
      '</td></tr>'+
      '</form>'+
      '</table>'+
      '</td></tr></table>'+
      '</body>'+
      '</html>'

    );
    response.end('');
  }
  else
  {
    // update flags_failedLogin
    flags_failedLogin=1;
    //response.redirect('/');
  }
});
// 3 /profile *******************************

// 4 /update database
app.get("/update", function (request, response)
{
  //var backURL=request.header('Referer') || '/';
  var userid = request.query.userid;
  var user_crit = request.query.user_crit;
  var vals1 = request.query.vals1;

  if(user_crit == "balance" )
  {
    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ balance: vals1 })
      .value();
      db.write();
  }

  if(user_crit=="company")
  {
    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ company: vals1 })
      .value();
      db.write();
  }

  if(user_crit=="firstName")
  {
    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ namefirst: vals1 })
      .value();
      db.write();
  }

  if(user_crit=="lastName")
  {
    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ namelast: vals1 })
      .value();
      db.write();
  }

  if(user_crit=="phone")
  {
    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ phone: vals1 })
      .value();
      db.write();
  }

  if(user_crit=="email")
  {
    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ email: vals1 })
      .value();
      db.write();
  }

  if(user_crit=="address")
  {
    var address_1 = request.query.address_1;
    var city = request.query.city;
    var state = request.query.state;
    var zip = request.query.zip;
    vals1 = address_1 + ', ' + city + ', ' + state + ', ' + zip;

    var users = db.get('users');
    users.find({ _id: userid })
      .assign({ address: vals1 })
      .value();
      db.write();
  }

  var credo = db.get('users').filter({ _id: userid }).value();
  response.redirect(
    url.format({
       pathname:"/login_profile",
       query: {
                "un": credo[0].email,
                "pw": credo[0].password,
              }
     }));

  console.log(credo[0].email + ' -- ' + credo[0].password);
  console.log('Updated Database for  ' + userid + ' set ' + user_crit + ' to ' + vals1);

});
// 4 /update database ***********************

// setup port listener
var port = 3000;
app.listen(port, () => console.log(`Example app2 listening on port ${port}!`));
