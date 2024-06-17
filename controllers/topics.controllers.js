const { selectTopics } = require("../models/topics.models")



exports.getTopics = (req, res, next) => {
    return selectTopics().then((topic) => {
      console.log({topic});
      res.status(200).send({topic})
    })
}

