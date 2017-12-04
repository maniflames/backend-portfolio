
module.exports = [
    {
        method: 'GET',
        path: '/projects',
        controller: 'ProjectController.list'
    },
    {
        method: 'POST',
        path: '/projects',
        controller: 'ProjectController.create'
    },
    {
        method: 'GET',
        path: '/projects/:id',
        controller: 'ProjectController.find'
    },
    {
        method: 'PUT',
        path: '/projects/:id',
        controller: 'ProjectController.update'
    },
    {
        method: 'DELETE',
        path: '/projects/:id',
        controller: 'ProjectController.delete'
    },
];
