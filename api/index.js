const app = require('express')();
const hogCount = require('./data/hog_count.json');

app.post('/api/hogcount', (req, res) => {
    let regions = req.body.regions;
        
    let filteredResults = hogCount.filter((region) => regions.includes(region.region));

    res.send(filteredResults);
})

module.exports = app