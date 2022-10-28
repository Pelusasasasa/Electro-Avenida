const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://127.0.0.1/electroAvenida"

mongoose.connect(uri,{
    useNewUrlParser: true,
    // useCreateIndex: true
})

const conection = mongoose.connection;

conection.once('open',()=>{
    console.log("DB is conected")
})