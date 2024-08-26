const mongoose = require("mongoose");
const localConnectionString_mi_blog = "mongodb://localhost:27017/mi_blog"


const connection = async () => {
    try {

        await mongoose.connect(localConnectionString_mi_blog)
        // Paramestros dentro de objeto
        //useNewUrlParser: true
        //useUnifiedTopology: true
        //useCreateIndex: true

        console.log("Conectado correctamente a la base de datos!!")
    } catch (error) {
        console.log(error);
        throw new Error("Unable to Connect database")
    };
}

module.exports = {
    connection
}