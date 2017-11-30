
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
        path: '/project/:id',
        controller: 'ProjectController.find'
    },
    {
        method: 'PUT',
        path: '/project/:id',
        controller: 'ProjectController.update'
    },
    {
        method: 'DELETE',
        path: '/project/:id',
        controller: 'ProjectController.delete'
    },
];
