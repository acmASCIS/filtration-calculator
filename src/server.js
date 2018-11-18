const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index');
});

const controller = require('./controller');
app.use('/api', controller);

app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}.`);
});
