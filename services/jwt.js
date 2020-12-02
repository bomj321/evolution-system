'user strict'

let jwt = require('jwt-simple');
let moment = require('moment');


exports.createToken = (user) =>{

    let payload = {
        sub: user._id,
        fullName: user.fullName,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(30, 'dayes').unix,
    };

    return jwt.encode(payload, 'clave-secreta-para-generar-el-token-9999');

}