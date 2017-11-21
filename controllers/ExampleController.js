const models = require('../Models');
const Project = models.Project;

module.exports = {
    index: function(req, res){

        Project.find({hi: 'bye'}, function(err, project){
            return res.send(project);
        });
    }
}
