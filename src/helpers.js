const objHelpers = {};
var nodemailer = require('nodemailer');

objHelpers.EnviarEmailPedidoFinalizado = async(email, nombreTercero, nombreDependencia, idPedido, strObservacion)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'inmodadev3@gmail.com',
            pass: 'inmodasistemas123'
        }
    });
    var mailOptions = {
      from: 'inmodadev3@gmail.com',
      to: ['inmodadev@gmail.com', email],
      subject: 'Pedido IM Finalizado '+nombreTercero,
      html:`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
          <p><b>Pedido Finalizado</b></p>
          <p><b>Id Pedido: </b>`+idPedido+`</p>
          <p><b>Nombre Tercero: </b>`+nombreTercero+`</p>
          <p><b>Nombre Dependencia: </b>`+nombreDependencia+`</p>
          <p><b>Observaciones: </b>`+strObservacion+`</p><br/>
        </body>
      </html>`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log(info);
      }
    });
}

objHelpers.EnviarEmailRegistroTercero = async(jsonData, files)=>{
    const { names, documento, email} = jsonData;
    let nombreTercero = names;
    let identificacion = documento;
    /*if (jsonData.TipoFormulario == 0) {
        const {
            names,
            documento
        } = jsonData;
        nombreTercero = names.val;
        identificacion = documento.val;
    }else{
        const {
            razonSocial,
            nit
        } = jsonData;
        nombreTercero = razonSocial.val;
        identificacion = nit.val;
    }*/
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'inmodadev3@gmail.com',
            pass: 'inmodasistemas123'
        }
    });
    var mailOptions = {
      from: 'inmodadev3@gmail.com',
      to: ['inmodadev3@gmail.com'],
      subject: 'Registro IM Tercero',
      html:`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
          <p><b>Registro HGI</b></p>
          <p><b>Nombre Tercero: </b>`+nombreTercero+`</p>
          <p><b>Identificación: </b>`+identificacion+`</p>
          <p><b>Correo electrónico: </b>`+email+`</p>
          <p><b>Recuerde validar los datos del tercero y solicitar los faltantes, posteriormente <b>marcar</b> el tercero para así tener un registro exitoso!!</p>
        </body>
      </html>`
    };
    if(files.file !== undefined){
      if(files.file.length !== 0){
        mailOptions.attachments = [];
        for (let index = 0; index < files.file.length; index++) {
          const file = files.file[index];
          mailOptions.attachments.push({path : file.path})
        }
      }
    }
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log(info);
      }
    });
    
}

objHelpers.EnviarEmailToken = async(email, token)=>{
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'inmodadev3@gmail.com',
          pass: 'inmodasistemas123'
      }
  });
  var mailOptions = {
    from: 'inmodadev3@gmail.com',
    to: [email],
    subject: 'Solicitud cambio contraseña - IN MODA FANTASY',
    html:`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
        <a href="http://localhost:3000/CambiarContrasena/?token=`+token+`"><img src="cid:unique@kreata.ee"/></a>
        </body>
      </html>
    `,
    attachments: [{
      path: __dirname + '/Public/ChangePass.jpg',
      cid: 'unique@kreata.ee' //same cid value as in the html img src
    }]
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
      console.log("token ", token)
        console.log(info);
    }
  });
}

objHelpers.EnviarEmailAlertaPrecioTercero = async(jsonData)=>{
  const {
    StrNombre,
    StrApellido1,
    StrApellido2,
    StrIdTercero,
    JsonVendedor
  } = jsonData;
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'inmodadev3@gmail.com',
          pass: 'inmodasistemas123'
      }
  });
  var mailOptions = {
    from: 'inmodadev3@gmail.com',
    to: ['inmodadev3@gmail.com', JsonVendedor.strEmail == null?'ventas1inmoda@gmail.com':JsonVendedor.strEmail],
    subject: 'Validación IM Tercero',
    html:`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p><b>Validación precio HGI</b></p>
        <p>El tercero supera la cantidad de compras con los montos requeridos, evaluar con la persona encargada para realizar dicha modificación</p>
        <p><b>Nombre Tercero: </b>`+StrNombre+` `+StrApellido1+`</p>
        <p><b>Identificación: </b>`+StrIdTercero+`</p>
      </body>
    </html>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log(info);
    }
  });
}

objHelpers.EnviarEmailContactanos = async(jsonData)=>{
  const {name, email, phone, city, comments} = jsonData;
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'inmodadev3@gmail.com',
          pass: 'inmodasistemas123'
      }
  });
  var mailOptions = {
    from: 'inmodadev3@gmail.com',
    to: ['inmodadev3@gmail.com', 'ventas1inmoda@gmail.com'],
    subject: 'Comentario Página',
    html:`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p><b>Nombre Tercero: </b>`+name.val+`</p>
        <p><b>Email: </b>`+email.val+`</p>
        <p><b>Télefono: </b>`+phone.val+`</p>
        <p><b>Ciudad: </b>`+city.val+`</p>
        <p><b>Comentario: </b>`+comments.val+`</p>
      </body>
    </html>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log(info);
    }
  });
}

module.exports = objHelpers;