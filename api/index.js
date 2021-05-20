const app = require('express')();
const { readFileSync } = require('fs');
const { join } = require('path');
const rawHogCount = readFileSync(join(__dirname, 'data', 'hog_count.json'), 'utf8');

app.post('/api/hogcount', (req, res) => {
    let regions = req.body.regions;
    let hogCount = JSON.parse(rawHogCount);
    let filteredResults = hogCount.filter((region) => regions.includes(region.region));

    res.send(filteredResults);
})

module.exports = app