const fs = require("fs/promises")

exports.endpointQuery = () => {
    return fs.readFile("./endpoints.json", "utf-8")
    }
    