const { selectTopics } = require("../models/treasures.models")


exports.getTopics = (req, res, next) => {

    return selectTopics().then((topic) => {
      res.status(200).send(topic.rows)
    })
}