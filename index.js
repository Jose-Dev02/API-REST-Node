const { connection } = require("./database/connection")
const express = require("express")
const cors = require("cors")
const port = 3000;

//Inicializar app
console.log("App de node Arrancada");

//Conectar a la base de datos
connection();

//Crear Servidor de Node
const app = express();
//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());//para recibir dato  con content-type app/json
app.use(express.urlencoded({ extended: true })) // form urlencode

//Crear rutas
const routes_articles = require("./routes/article_route");
//Cargo las rutas
app.use("/api", routes_articles);

//Rutas pruebas hardcodeadas
app.get("/", (req, res) => {
    return res.status(200).send(
        "<h1> Empezando a crear un api rest con node</h1>"
    )
});


//Crear servidor y escuchar peticiones http
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});