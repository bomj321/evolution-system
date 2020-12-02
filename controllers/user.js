'user strict'

let validator = require('validator');
let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
let jwt = require('../services/jwt');

let controller = {

    save: (req, res) => {
        // Recolect the parameters in the request
        let params = req.body;
        // Validate data 

        try {
            var validate_fullName = !validator.isEmpty(params.fullName);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: "DATA_INCOMPLETE"
            })
        }

        if (validate_fullName && validate_email && validate_password) {
            // Create user's object
            let user = new User();
            // Assign values in the object user

            user.fullName = params.fullName;
            user.email = params.email.toLowerCase();
            // Verify if the user exists

            User.findOne({
                email: user.email
            }, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "ERROR_CHECKING_DUPLICATES"
                    })
                }

                if (!issetUser) {
                    // And if not, hash the password
                    bcrypt.hash(params.password, null, null, (err, hash) => {

                        if (err) {
                            return res.status(500).send({
                                message: "ERROR_HASH_PASSWORD"
                            })
                        }

                        user.password = hash;
                        user.save((err, userStored) => {

                            if (err) {
                                return res.status(500).send({
                                    message: "ERROR_IN_REQUEST"
                                })
                            } else if (!userStored) {
                                // Return response
                                return res.status(500).send({
                                    message: "USER_NOT_SAVED",
                                    user
                                })
                            } else {
                                return res.status(200).send({
                                    message: "USER_SAVED",
                                    user
                                })
                            }

                        }); //Close save


                    }); // Close bcrypt

                } else {
                    return res.status(200).send({
                        message: "USER_EXIST"
                    })
                }
            });

        } else {
            return res.status(200).send({
                message: "NOT_VALID_VALIDATION",
            })
        }
    },


    login: (req, res) => {
        //Recolect params

        let params = req.body;
        // Validate data

        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: "DATA_INCOMPLETE"
            })
        }


        if (validate_email && validate_password) {
            //Find user

            //If the user exists...
            User.findOne({
                email: params.email.toLowerCase()
            }, (err, user) => {


                if (err != null) {
                    return res.status(500).send({
                        message: "ERROR_IN_REQUEST"
                    })
                }

                if (!user) {
                    return res.status(404).send({
                        message: "USER_NOT_EXIST"
                    })
                }
                //Verify the password (EMAIL AND PASSWORD)

                bcrypt.compare(params.password, user.password, (err, check) => {
                    //If It's correct

                    if (check) {

                        //Clean the object user                        

                        user.password = undefined;
                        //Generate JWT's token && return response

                        return res.status(200).send({
                            status: "USER_LOGGED",
                            token: jwt.createToken(user),
                            user
                        })
                    } else {
                        return res.status(404).send({
                            message: "CREDENTIALS_NOT_CORRECT"

                        })
                    }

                });
            });

        } else {
            return res.status(200).send({
                message: "NOT_VALID_VALIDATION"
            })
        }
    }

};


module.exports = controller;