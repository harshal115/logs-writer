var fs = require('fs');
var http = require('http');
var https = require('https');
const cors = require('cors')
const express = require('express');
const app = express();
var fs = require('fs');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/logituit.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/logituit.com/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/logituit.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var logger = function (req, res, next) {
  console.log("-------------------REQUEST-------------------")
  console.log(req.body)
  try{
  fs.appendFile('logs/temp.txt', (req.body)+'\n', function (err) {})
  }
  catch(e){}
  console.log("---------------------------------------------")
  // console.log('LOGGED',req)
  next()
}

// app.use(logger)
// app.use(cors())
app.use(cors({origin: true, credentials: true}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.urlencoded({ extended: true })) 
app.use(express.json());
// app.use(logger)

app.get('/', async (req, res) => {
  res.send("use /logs to get logs")
});

app.post('/', function (req, res) {
  res.send('POST request to the homepage')
})


app.put('/logs', function (req, res)  {
  let fileName = req.body.fileName;
  fileName = fileName.replace(/\//g,'-')
  console.error(fileName)
  const logs = req.body.logs;
  try{
  fs.appendFile('logs/'+fileName, logs+'\n', function (err) {
    if (err) throw err;
    console.log('Saved!');
    response = {
      status: 1000,
      message: 'logs saved successfully'
    }
    res.send(response)
  });}
  catch(e){
  console.error(e)
  response = {
      status: 1001,
      message: 'failed to save logs'
    }
    res.send(response)
  }

});

app.post('/logs', function (req, res)  {
  let fileName = req.body.fileName;
  fileName = fileName.replace(/\//g,'-')
  console.error(fileName)
  const logs = req.body.logs;
  try{
  fs.appendFile('logs/'+fileName, logs+'\n', function (err) {
    if (err) throw err;
    console.log('Saved!');
    response = {
      status: 1000,
      message: 'logs saved successfully'
    }
    res.send(response)
  });}
  catch(e){
  console.error(e)
  response = {
      status: 1001,
      message: 'failed to save logs'
    }
    res.send(response)
  }

});

app.get('/logs/append', function (req, res)  {
  console.log('adding logs')
  let fileName = req.query.fileName;
  fileName = fileName.replace(/\//g,'-')
  const logs = req.query.logs;
  console.error(fileName)
  console.error(logs)
  try{
  fs.appendFile('logs/'+fileName, logs+'\n', function (err) {
    if (err) throw err;
    console.log('Saved!');
    response = {
      status: 1000,
      message: 'logs saved successfully'
    }
    res.send(response)
  });}
  catch(e){
  console.error(e)
  response = {
      status: 1001,
      message: 'failed to save logs'
    }
    res.send(response)
  }

});


app.get('/logs', async (req, res) => {
  let fileName = (req.query.fileName || '')
  fileName = fileName.replace(/\//g,'-')
  try{
  fs.readFile("logs/"+fileName, 'utf8', function(err, data){ 
    response = {
      status: 2000,
      message: 'logs loaded successfully',
      data: data
    }
    res.send(response)
});}
catch(e){
  console.error(e)
  response = {
    status: 2001,
    message: 'failed to load logs'
  }
  res.send(response)
}
});

app.get('/logs/files', async (req, res) => {
  // const fileName = (req.query.fileName)
  try{
  fs.readdir("logs/", function (err, data) {
  // fs.readFile("logs/"+fileName, 'utf8', function(err, data){ `cd 
    response = {
      status: 4000,
      message: 'logs files list loaded successfully',
      data: data
    }
    res.send(response)
});}
catch(e){
  console.error(e)
  response = {
    status: 4001,
    message: 'failed to load log files list'
  }
  res.send(response)
}
});

app.delete('/logs', async (req, res) => {
  let fileName = (req.query.fileName)
  fileName = fileName.replace(/\//g,'-')
  try{
  fs.unlink("logs/"+fileName, function (err, data) {
  // fs.readFile("logs/"+fileName, 'utf8', function(err, data){ `cd 
    response = {
      status: 3000,
      message: 'logs file deleted successfully',
      data: data
    }
    res.send(response)
});}
catch(e){
  console.error(e)
  response = {
    status: 3001,
    message: 'failed to delete log file'
  }
  res.send(response)
}
});
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}...`);
// });
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8081);