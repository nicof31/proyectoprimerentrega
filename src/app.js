
import express from "express";
import prodRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";

const app = express();


//configuracion puerto
const PUERTO = process.env.port || 8080;
app.listen(PUERTO, () => {
  console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

//para interpretar mejor los datos de las query
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//carpeta PUBLIC
//app.use(express.static('src/public'));
app.use('/static', express.static('src/public'))


//Use Route
app.use('/api/products/', prodRouter);
app.use('/api/carts/', cartRouter);