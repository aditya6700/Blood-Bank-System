const mongoose = require('mongoose');

const DB = process.env.LOCAL_DB || process.env.DATABASE_URI;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection succesfull to the database');
}).catch((err) => {
    console.log(`error connecting to the database: ${err}`);
})