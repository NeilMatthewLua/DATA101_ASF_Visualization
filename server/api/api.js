const hogCount = require('../data/hog_count.json');

const api = {
    retrieveHogCount(req, res) {
        let regions = req.body.regions;
        
        let filteredResults = hogCount.filter((region) => regions.includes(region.region));

        res.send(filteredResults);
    }
}

module.exports = api; 