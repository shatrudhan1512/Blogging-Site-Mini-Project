const jwt = require('jsonwebtoken')

//-----------------------------------------------------------------------------//
// This is the middleware will be used for the authentication purpose

const authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        let decodedToken = jwt.verify(token, "Radium Star")
        if (decodedToken) {
            req.userId = decodedToken.userId
            next();
        } else {
            res.send({ status: false, message: 'Token not valid' })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
//-----------------------------------------------------------------------------//
module.exports.authentication = authentication;