//NOTE: Controllers aren't lean I should probably move some logic to models or helpers
//NOTE: Creating an errorhandler would be effcient
const models = require('../Models');
const Project = models.Project;
const ProjectSchema = Project.schema.tree;

module.exports = {
    list: (req, res) => {
        Project.find({}, (err, projects) => {
            if(err){
                console.error(err);
                return res.status(500).send({error: err});
            }

            return res.send(projects);
        });
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
