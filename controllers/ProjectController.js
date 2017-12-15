//NOTE: Creating an errorhandler would be effcient
const models = require('../Models');
const Project = models.Project;
const ProjectSchema = Project.schema.tree;
const pagination = require('../lib/pagination');

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

            Project.find({}).select('_id name description img_url _links').skip(start).limit(limit).exec((err, projects) => {
                if(err){
                    console.error(err);
                    return res.status(500).send({error: err});
                }

                let result = projects.map(function (project){
                    project._links = module.exports.getBothLinks(req, project.id);
                    return project;
                });

                const response = {
                    items: result,
                    _links: { self: module.exports.getCollectionLink(req) },
                    pagination: pagination.getPagination(count, start, limit, req.protocol + '://' + req.get('host') + req.path)
                }

                return res.send(response);

            })
        })
    },

    find:(req, res) => {
        Project.findOne({_id: req.params.id}, (err, project) => {
            if(err){
                console.error(err);
                return res.status(500).send({error: err});
            }

            if(!project){
                return res.status(404).send({error: 'project not found'});
            }

            console.log(req.path);

            project._links = module.exports.getBothLinks(req, req.params.id)
            return res.send(project);

        });
    },

    create: (req, res) => {
        Project.create(req.body, (err, newProject) => {
            if(err){
                console.error(err);
                return res.status(400).send(err);
            }
            return res.status(201).send(newProject);
        });
    },

    update: (req, res) => {
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
                    return res.status(400).send(err);
                }

                return res.send(updatedProject);
            })
        })
    },

    delete: (req, res) => {
        Project.find({ _id: req.params.id }, (err, project) => {
            if(err){
                return res.status(500).send(err);
            }

            if(project === null || project === undefined){
                //TODO: make sure the message send has the same pattern as validation error
                return res.status(404).send({'error': 'project not found'});
            }

            Project.remove({ _id: req.params.id}, (err) => {
                return err ? res.status(500).send(err) : res.status(204).send();
            })
        });

    },

    getDetailLink: (req, id = '') => {
        if(req.path.indexOf(id) > 0){
            id = '';
        }
        return { href: req.protocol + '://' + req.get('host') + req.path + id }
    },

    getCollectionLink: (req, id = '') => {
        return { href: req.protocol + '://' + req.get('host') + req.path.replace(id, '')}
    },

    getBothLinks:(req, id = '') => {
        return ({
            self: module.exports.getDetailLink(req, id),
            collection: module.exports.getCollectionLink(req, id)
        })
    }
}
