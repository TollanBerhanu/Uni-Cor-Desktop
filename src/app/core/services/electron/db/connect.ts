const mongoose = require('mongoose');

 module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/unicor', { useNewUrlParser: true } )
        .then( connection => {
            console.log('Connected to MongoDB Database ...');
            return connection;
         })
        .catch( err => console.log('Error while connecting to database: ' + err) );
}
