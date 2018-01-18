const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
// Move the following line to after middleware app.use calls
// so it doesn't render in case of maintenance or authentication fail
// app.use(express.static(__dirname + '/public'));

// Middleware executes before a page is rendered (Perform authentication)
// Logs each request to a file before rendering triggered by next()
app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err)
    {
      console.log('Unable to append server log.');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (reg, res) => {
  res.render('home.hbs', {
    pageTitle: 'About me',
    welcomeMsg: 'Welcome to my Webpage',
    name: 'Tamil',
    likes: ['music', 'movies'],
    // currentYear: new Date().getFullYear()
  });
  // res.send('<h1>Hello Express</h1>');
  // res.send({
  //   name: 'John',
  //   likes: [
  //     'music',
  //     'movies'
  //   ]
  // })
});

app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear()
  });
})

// /bad - send back json with errorMessage

app.get('/bad', (req, res) => {
  res.send({
    errorCode: '400',
    errorMessage: 'Bad Request'
  })
});
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
// app.listen(3000, () => {
//   console.log('Server is up on port 3000');
// });
