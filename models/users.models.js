const db = require("../db/connection")

exports.findUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((query) => {
        return query.rows
    })
}



