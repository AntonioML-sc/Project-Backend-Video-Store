
const express = require('express');

const app = express();

const port = 3000;

const db = require('./db/db');

const router = require('./router');

const cors = require('cors');

// cors options

let corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// middleware

app.use(express.json());

app.use(cors(corsOptions));

app.use(router);

// db conexion

db.then(() => {

    app.listen(port, () => console.log(`servidor levantado en el puerto ${port}`))

}).catch((err) => console.log(err.message));