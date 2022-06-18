
//Importo el fichero .env para traerme las variables de entorno
require('dotenv').config();
module.exports = {
    //secret: process.env.AUTH_SECRET,
    secret: process.env.AUTH_SECRET || "zA23RtfLoPP", //KEYWORD

    //expires: process.env.AUTH_EXPIRES,
    expires: process.env.AUTH_EXPIRES || "12h", //Duration of the token
    //rounds: process.env.AUTH_ROUNDS
    rounds: process.env.AUTH_ROUNDS || 10 //Rounds to cypher
}