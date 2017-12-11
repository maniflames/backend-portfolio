const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbUrl = process.env.DB || 'mongodb://localhost:27017/portfolio'; //TODO: Fix env file!!
mongoose.connect(dbUrl , {
    useMongoClient: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(){
    console.log('Connected to MongoDB');
    module.exports.connection = mongoose.connect;
})
