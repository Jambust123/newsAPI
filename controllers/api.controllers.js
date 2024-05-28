const { endpointQuery } = require("../models/api.models")


exports.getEndpoints = (req, res, next) => {
    return endpointQuery().then((endpoints) => {
        
      res.status(200).send(JSON.parse(endpoints))
    })
}