//NOTE: Controllers aren't lean I should probably move some logic to models or helpers
//NOTE: Creating an errorhandler would be effcient
const models = require('../Models');
const Project = models.Project;
const ProjectSchema = Project.schema.tree;

module.exports = {
    list: (req, res) => {
        let response = {};
        const start = parseInt(req.query.start) - 1; // transforming start because mongoose starts at 0
        const limit = parseInt(req.query.limit);

        Project.count({}, (err, count) => {
            if(err){
                console.error(err);
                return res.status(500).send({error: err});
            }

            //TODO: check if start is out of bounds

            Project.find({}).skip(start).limit(limit).exec((err, projects) => {
                if(err){
                    console.error(err);
                    return res.status(500).send({error: err});
                }

                //TODO: include self & collection links for each project

                response.items = projects;
                response._links = {
                    _self: {
                        href: req.url //TODO: print full url
                    }
                }
                response.pagination = {
                    currentPage: Math.ceil((start + 1) / limit), //correct start with start + 1
                    currentItems: limit || count,
                    totalPages: Math.ceil(count / limit) || 1,
                    totalItems: count
                    //TODO: include links
                }

                return res.send(response);

            })
        })
    },

    find:(req, res) => {

        Project.find({_id: req.params.id}, (err, project) => {
            if(err){
                console.error(err);
                return res.status(500).send({error: err});
            }
            return res.send(project);
        });
    },

    create: (req, res) => {
        Project.create(req.body, (err, newProject) => {
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.send(newProject);
        });
    },

    update: (req, res) => {

        let valid = true;
        for(let field in ProjectSchema){
            if(ProjectSchema[field].required){
                if(!req.body.hasOwnProperty(field)){
                    valid = false;
                }
            }
        }

        if(!valid){
            //TODO: make sure the message send has the same pattern as validation error
            return res.status(400).send({'error': 'not all required fields are send'});
        }

        Project.findById(req.params.id, (err, project) => {
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }

            for(let key in req.body){
                project[key] = req.body[key];
            }

            project.save((err, updatedProject) => {
                if(err){
                    console.error(err);
                    return res.status(500).send(err);
                }

                return res.send(updatedProject);
            })
        })
    },

    delete: (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            if(err){
                return res.status(500).send(err);
            }

            if(project === null || project === undefined){
                //TODO: make sure the message send has the same pattern as validation error
                return res.status(404).send({'error': 'project not found'});
            }

            Project.remove(req.params.id, (err) => {
                if(err){
                    return res.status(500).send(err);
                }

                return res.status(204).send();
            })
        });

    }
}
