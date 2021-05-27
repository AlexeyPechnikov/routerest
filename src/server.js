var jsonfile = require("jsonfile")
var config;
if(process.env.NODE_ENV && process.env.NODE_ENV === 'dev') {
  console.log("Local config");
  config=require("./config");
} else if(process.env.NODE_ENV && process.env.NODE_ENV === 'test'){
  console.log("Test config");
  config=require("../src/config");
} else {
  config=require("../src/config");
  // config = require("/etc/routerest/config");
  // config = jsonfile.readFileSync("/etc/routerest/config.json");
}
var express = require('express');
var app = express();
// var pgMonitor = require('pg-monitor');
// var pgPromiseOptions = {}
// pgMonitor.attach(pgPromiseOptions, ['query', 'error']);
var pgp = require("pg-promise")({
  error(err, e){
    console.log(err,e)
  },
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('Connected to database:', cp.database);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    console.log('Disconnecting from database:', cp.database);
 },
 query: function (e) {
  console.log('QUERY:', e.query);
  if (e.params) {
      console.log('PARAMS:', e.params);
  }
}
});
var db = pgp(config.connectionString);
db.connect();
const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const schema = require('./swagger.json');  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
const validator = require('swagger-express-validator'); // https://www.npmjs.com/package/swagger-express-validator
app.use(logger('combined'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));

const opts = {
  schema:schema,
  validateRequest: true,
  validateResponse: true,
  requestValidationFn: (req, data, errors) => {
    console.log(`failed request validation: ${req.method} ${req.originalUrl}\n ${JSON.stringify(errors)}`);
    console.log("Received", data);
    throw new Error(JSON.stringify(errors));
    // return res.status(500).send();
  },
  responseValidationFn: (req, data, errors) => {

    console.log(`failed response validation: ${req.method} ${req.originalUrl}\n ${JSON.stringify(errors)}`);
    console.log("Send", JSON.stringify(data));
    // console.log(errors);
    throw new Error(JSON.stringify(errors));
    // return res.status(500).send();
  }
};
app.use(validator(opts));

app.use((err, req, res, next) => {
  console.log(err.message);
  // let a=JSON.parse(err.message);
  res.status(500).json({status: "fail", message:err.message});
});

app.post("/", (req, res)=>{
  let requestdata = req.body;
  db.one("SELECT routerest_routing_wrapper($1) AS json", [JSON.stringify(requestdata)])
  .then((data)=>{
        console.log("DB RESPONSE", data.json)
        return res.status(200)
          .json(data.json);
        })
      .catch(err=>{
        console.log("/get error", err);
        return res.status(500).send();
        });
});

let srv = app.listen(config.port, function() {
    console.log("Listening on port "+config.port);
});

// 10 minutes
srv.timeout=10*60*1000;

function stop() {
  db.$pool.end();
  return srv.close(() => {
    return;
  });
}

module.exports = app;
module.exports.db = db;
module.exports.stop = stop;
