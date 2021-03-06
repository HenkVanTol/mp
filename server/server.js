const express = require('express');
const expressGraphQL = require('express-graphql');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./services/auth');
const schema = require('./schema/schema');
const MSSQLStore = require('connect-mssql')(session);
const db = require('./db');
const authService = require('./services/auth');
//const flash = require('connect-flash');

// Create a new Express application
const app = express();

//MSSQL connection settings
const options = {
  user: 'sa',
  password: 'Trancend123',
  server: 'localhost',
  database: 'MultiPick',
  // options: {
  //     encrypt: true // Use this if you're on Windows Azure
  // }
};

db.connect(options)
  .then(console.log("MSSQL CONNECTION POOL CREATED."))
  .catch(error => console.log("UNABLE TO CONNECT TO MSSQL: ", error));

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MSSQL.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MSSQLStore(options)
}));

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

// Webpack runs as a middleware.  If any request comes in for the root route ('/')
// Webpack will respond with the output of the webpack process: an HTML file and
// a single bundle.js output of all of our client side Javascript
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;

// var soap = require('soap');
// var url = 'http://localhost:3881/EDIInterface.asmx?WSDL';

// reqURL = soap.createClient(url, function(err, client){
//     if(err) { 
//         console.log(err);
//         return;
//     }

//     client.UploadDataXML_raw("<xml>test</xml>", function(err, response){
//             if(err) {
//                 console.log("error: ", err);
//                 return;
//             }

//             console.log("response: ", response);
//     });
// });