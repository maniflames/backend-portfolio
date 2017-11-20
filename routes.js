module.exports = [
    {
        method: 'GET',
        path: '/',
        controller: 'ExampleController.index'
    },
    {
        method: 'POST',
        path: '/',
        controller: 'ExampleController.index'
    },
    {
        method: 'GET',
        path: '/lol/:id',
        controller: 'ExampleController.index'
    },
    {
        method: 'GET',
        path: '/lol',
        controller: 'ExampleController.index'
    }
];
