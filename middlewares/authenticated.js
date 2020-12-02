'user strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = "clave-secreta-para-generar-el-token-9999";

exports.authenticated = (req, res, next) => {

    // Verify if the bearer token is present

    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'NOT_VALID_AUTHORIZATION'
        });
    }

    //Clean token and delete ""

    let token = req.headers.authorization.replace(/['"]+/g, '')

    try {

        //Decode token
        let payload = jwt.decode(token, secret)

        //Prove if the token is valid
        if (payload.exp <= moment().unix()) {
            return res.status(403).send({
                message: 'INVALID_TOKEN'
            });
        }

        //To attach user identified to request
        req.user = payload;


    } catch (error) {
        return res.status(403).send({
            message: 'INVALID_TOKEN'
        });
    }

    //Next action    
    next();
};