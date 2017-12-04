const mongoose = require('mongoose');
let schema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    description: {
        type: 'string',
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    img_url: {
        type: 'string',
        required: true
    },
    git_url: {
        type: 'string',
        required: true
    },
    _links: {
        self: { href: 'string' },
        collection: { href: 'string' }
    }
});

let Project = mongoose.model('Project', schema);

module.exports = Project;
