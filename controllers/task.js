'user strict'
let validator = require('validator');
let Task = require('../models/task');


let controller = {
    save: (req, res) => {

        //Recolect params by post
        let params = req.body;
        //Validate data

        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_exp = !validator.isEmpty(params.exp);
            var validate_priority = !validator.isEmpty(params.priority);

        } catch (error) {
            return res.status(200).send({
                message: 'DATA_INCOMPLETE'
            });
        }

        if (validate_title && validate_content && validate_exp && validate_priority) {
            //Create object
            let task = new Task();

            //Assign values
            task.title = params.title;
            task.content = params.content;
            task.exp = params.exp;
            task.priority = params.priority;
            task.user = req.user.sub;
            //Save task

            task.save((err, taskStored) => {

                if (err || !taskStored) {
                    return res.status(500).send({
                        status: "error",
                        message: "ERROR_IN_REQUEST"
                    });
                }


                //Return response
                return res.status(200).send({
                    status: "success",
                    taskStored
                });

            });


        } else {
            return res.status(200).send({
                message: 'INVALID_DATA'
            });
        }
    },

    getTask: (req, res) => {

        //Pick id task from URL

        let taskId = req.params.id;
        //Find id by task
        Task.findById(taskId)
            .populate('user')
            .exec((err, task) => {

                if (err != null) {
                    return res.status(500).send({
                        status: "error",
                        message: "ERROR_IN_REQUEST"
                    });
                }

                if (!task) {
                    return res.status(404).send({
                        status: "error",
                        message: "TASK_NOT_EXISTS"
                    });
                }

                //Return response
                return res.status(200).send({
                    status: 200,
                    task
                });

            });
    },

    update: (req, res) => {

        //Pick ip of task
        let taskId = req.params.id;
        //Pick data from method POST
        var params = req.body;
        //Validate data

        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_exp = !validator.isEmpty(params.exp);
            var validate_priority = !validator.isEmpty(params.priority);

        } catch (error) {
            return res.status(200).send({
                message: 'DATA_INCOMPLETE'
            });
        }

        if (validate_title && validate_content && validate_exp && validate_priority) {
            //Set a json with the data
            let update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            }

            //Find and update of task by id and user's id

            Task.findOneAndUpdate({
                _id: taskId,
                user: req.user.sub
            }, update, {
                new: true
            }, (err, taskUpdated) => {

                if (err != null) {
                    return res.status(500).send({
                        status: "error",
                        message: "ERROR_IN_REQUEST"
                    });
                }

                if (!taskUpdated) {
                    return res.status(404).send({
                        status: "error",
                        message: "Error al actualizar el task"
                    });
                }

                //Return response
                return res.status(200).send({
                    status: 'success',
                    task: taskUpdated
                });

            });


        } else {
            return res.status(200).send({
                message: "NOT_VALID_VALIDATION"
            });
        }
    },


    delete: (req, res) => {

        //Pick el id of url
        let taskId = req.params.id;


        //FindByDelete by task id and user id
        Task.findOneAndDelete({
            _id: taskId,
            user: req.user.sub
        }, (err, taskRemoved) => {

            if (err != null) {
                return res.status(500).send({
                    status: "error",
                    message: "ERROR_IN_REQUEST"
                });
            }

            if (!taskRemoved) {
                return res.status(404).send({
                    status: "error",
                    message: "TASK_NOT_FOUND"
                });
            }

            //Return response
            return res.status(200).send({
                status: "success",
                task: taskRemoved
            });
        });
    },

    search: (req, res) => {
        //Pick string to find
        let searchString = req.params.search;
        //Pick id of user && page
        let userId = req.params.user;
        if (!req.params.page || req.params.page == 0 || req.params.page == '0' || req.params.page == null || req.params.page == undefined || !validator.isInt(req.params.page)) {
            var page = 1;
        } else {
            var page = parseInt(req.params.page);
        }
        //Indicate options of pagination
        var options = {
            sort: {
                date: -1
            },
            populate: 'user',
            limit: 10,
            page: page
        }

        //Find or

        if (searchString) {
            var extendOption = {
                user: userId,
                "$or": [{
                        "title": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    },
                    {
                        "content": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    }

                ]
            }
        } else {
            var extendOption = {
                user: userId
            }
        }

        Task.paginate(extendOption, options, (err, tasks) => {
            if (err != null) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la peticion"
                });
            }

            if (!tasks) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay temas disponibles"
                });
            }

            //return response
            return res.status(200).send({
                status: "success",
                tasks: tasks.docs,
                totalDocs: tasks.totalDocs,
                totalPages: tasks.totalPages
            });

        })



    }
}


module.exports = controller;