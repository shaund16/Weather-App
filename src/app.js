const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//HomePage
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Shaun Purslow'
    })
});

//About Page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        msg: "Hi, I'm Shaun! I built this using Node.js, Express.js, Handlebars, Mapbox API. ",
        name: 'Shaun Purslow'
    })
})

//Help Page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Shaun Purslow',
        message: 'Do you need help? Try google!'
    })
})

//Weather Page
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
       return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
  res.send({
      products: []
  });
});

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Shaun Purslow',
        errorMessage: 'Help article not found'
    })
})

//If nothing gets matched with above routes here an error will perform
app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Shaun Purslow',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
