const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const ws = require('ws')
const bodyParser = require('body-parser');

var recorded_time = "14:00";

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/set-time', function(req, res) {
       recorded_time = req.body.time;
       res.send('ok')

       // when someone sets the time, update everyone else's client
       wss.clients.forEach(function (client) {
          client.send(recorded_time);
       });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const wss = new ws.Server({port: 40510});

wss.on('connection', function(ws, req) {
    // on connect, send the meeting time
    ws.send(recorded_time)
})


