const mongoose = require('mongoose');

const connectdb = async ()=>{
    try{
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.MongoURI);
        console.log(`mongodb is connected at: ${conn.connection.host}`)
    }
    catch(error){
        console.log(error)
    }
}

module.exports = connectdb;
