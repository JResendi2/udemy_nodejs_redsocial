const mongoose = require("mongoose")

const conection = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/red_social");
    } catch(error){
        console.error(error);
        throw new Error("No se pudo conectar con la base de datos")
    }
}

module.exports = {
    conection
}