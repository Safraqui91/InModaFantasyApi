const express=require('express');
const app=express();
const cors= require('cors');

//Settings
app.set('port',process.env.PORT || 5000);

//Middlewares
app.use(express.json({limit:'200mb'}));
app.use(cors());
app.use(express.json());


//Routers
app.use('/api/productos',require('./Routers/Productos'));

//Facturas
app.use('/api/facturas',require('./Routers/Facturas'));

//Imagenes
app.use('/api/imagenes',require('./Routers/Imagenes'));

//Usuarios
app.use('/api/usuarios',require('./Routers/Usuarios'));

//Terceros
app.use('/api/terceros',require('./Routers/Terceros'));

//Dependencias
app.use('/api/dependencias',require('./Routers/Dependencias'));

//Zonas HGI
app.use('/api/zonas',require('./Routers/Zonas'));

//Pedidos DASH
app.use('/api/pedidos',require('./Routers/Pedidos'));

//Filtros HGI
app.use('/api/filtros',require('./Routers/FiltrosProductos'));

//Consultar clases del hgi para el dash
app.use('/api/dash/clasesHgi',require('./Routers/ClasesHgi'));

//Contactos HGI
app.use('/api/contactos',require('./Routers/Contactos'));

//Contactanos 
app.use('/api/contactanos', require('./Routers/Contactanos'));

app.use('/api/test', require('./Routers/Test'));

module.exports = app;