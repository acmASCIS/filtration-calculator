const express = require('express');
const bodyParser = require('body-parser');
const expressBasicAuth = require('express-basic-auth');

const config = require('./config');
const points = require('../points.json');

const app = express();

const PORT = config.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressBasicAuth({
  users: { [config.BASIC_AUTH_USERNAME]: config.BASIC_AUTH_PASSWORD },
  challenge: true,
}));

app.use(express.static('public'));


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const mappedPoints = points.contests.map((contest, index) => ({
    contest,
    points: points.points[index].map((point, index) => `${String.fromCharCode(index + 'A'.charCodeAt(0))}: ${point}`),
  }));

  res.render('index', { points: mappedPoints });
});

app.use('/api', require('./controller'));

app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}.`);
});
