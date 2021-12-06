const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
//const html = fs.readFileSync('./format.html', 'utf8');

const CrearHtml = (jsonData)=>{
    const encabezado = jsonData.encabezado;
    let obj = {};
    const arrayDetalle = jsonData.detalle;
    let detalle = arrayDetalle.map(val=>{
        return(
            `<tr>
            <td>`+val.StrProducto+`</td>
            <td>`+val.StrDescripcion+`</td>
            <td>`+val.IntCantidad+`</td>
            <td>`+val.StrUdm+`</td>
            <td>`+val.IntValorUnitario+`</td>
            <td>`+val.IntValorIva+`</td>
            <td>`+val.IntValorTotal+`</td>
          </tr>`
        )
    })

    obj.html = `
    <style>
    table td{
        font-size:8;
    }
    table th p{
      font-size:8;
    }
    table tr{
        margin:0;
    }
	table{
        width:100%;
      }
      .border{
        border: 2px solid black;
        border-radius: 10px;
      }
      
      .datos th, td {
        padding: 5px;
        text-align: left;    
      }

      .datos th {
        font-size:10;
      }
      
      .tabla-fecha{
        text-align: center;
      }
      
      .tabla-fecha tr th{
        font-size:10;
        border: 1px solid black;
      }
      
      .tabla-fecha tr td{
        font-size:8;
        border: 1px solid black;
      }
      
      .detalle{
        margin-top:5px;
        border: 1px solid black;
      }
      
      .detalle th{
        border: 1px solid black;
        font-size:10;
      }
      
      .info{
        margin-top:5px;
        border: 1px solid black;
      }
      .info-pago{
        font-size : 10px;
      }
      .border{
        border: 2px solid black;
        border-radius: 10px;
      }
    </style>
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Factura In Moda</title>
</head>
<body>

  <table >
    <tr>
    <th>
        <img src="https://www.inmodafantasy.com.co/DASH/Images/logo_empresa.png" width="200"/>
        <p>900433668-2</p>
    </th>
    <th>
        <h5>IN MODA FANTASY SAS</h5>
        <p>CR 52A 45 33 BG 501<br>
        Medellin - Colombia<br>
        Tel: 5124129<br>
        Somos Responsables de IVA
        No Somos Autoretenedores
        No Somos Grandes Contribuyentes
        </p>
    </th> 
    <th>
        <div class="border">
        <h4>FACTURA DE VENTA ELECTRONICA <br>
            N. FEI - `+encabezado.IntDocumento+`</h4>
        </div>
    </th>
    </tr>
    </table>
  <table >
  <tr>
    <th>
      <div class="border">
        <table class="datos">
          <tr>
            <th>Nombre y apellidos o Razón Social:</th>
            <td>`+encabezado.StrNombre+`</td>
          </tr>
          <tr>
            <th rowspan="1">Nit:</th>
            <td>`+encabezado.StrIdTercero+`</td>
          </tr>
          <tr>
            <th>Dirección:</th>
            <td>`+encabezado.StrDireccion+`</td>
          </tr>
          <tr>
            <th>Teléfono:</th>
            <td>`+encabezado.StrTelefono+`</td>
          </tr>
          <tr>
            <th>Celular:</th>
            <td>`+encabezado.StrCelular+`</td>
          </tr>
          <tr>
            <th>Ciudad Envio:</th>
            <td>`+encabezado.StrCiudad+`</td>
          </tr>
          <tr>
            <th>Direccion Envio:</th>
            <td>`+encabezado.StrReferencia1+`</td>
          </tr>
        </table>
      </div>
    </th>
    <th>
      <td>
      <table class="tabla-fecha">
        <tr>
          <th colspan="3">FECHA</th>
        </tr>
        <tr>
          <th>AÑO</th>
          <th>MES</th> 
          <th>DIA</th>
        </tr>
        <tr>
          <td>`+encabezado.IntAno+`</td>
          <td>`+encabezado.IntPeriodo+`</td>
          <td>`+encabezado.DatFechaDia+`</td>
        </tr>
      </table>
      </td>
    </th>
    <th>
      <td>
      <table class="tabla-fecha">
        <tr>
          <th colspan="3">VENCIMIENTO</th>
        </tr>
        <tr>
          <th>AÑO</th>
          <th>MES</th> 
          <th>DIA</th>
        </tr>
        <tr>
          <td>`+encabezado.AnoVen+`</td>
          <td>`+encabezado.MesVen+`</td>
          <td>`+encabezado.DiaVen+`</td>
        </tr>
      </table>
      </td>
    </th>
  </tr>
</table>
  <table class="detalle">
    <tr>
      <th>REF.</th>
      <th>PRODUCTO</th> 
      <th>CANT.</th>
      <th>UDM</th>
      <th>VR. UNITARIO</th>
      <th>IVA</th>
      <th>VR. TOTAL</th>
    </tr>
    `+detalle+`
  </table>
</body>
</html>
    `;
obj.options = {format:'letter',
    paginationOffset: 1,       // Override the initial pagination number
    "header": {
      "height": "30px",
      "contents": `
      `
    },
    "footer": {
      "height": "130px",
      "contents": {
        last: `
        <style>
        table td{
            font-size:10;
        }
        table tr{
            margin:0;
        }
      table{
            width:100%;
          }
          .border{
            border: 2px solid black;
            border-radius: 10px;
          }
          
          .datos th, td {
            padding: 5px;
            text-align: left;    
          }
          
          .tabla-fecha{
            text-align: center;
          }
          
          .tabla-fecha th{
            font-size:6;
            border: 1px solid black;
          }
          
          .tabla-fecha td{
            font-size:6;
            border: 1px solid black;
          }
          
          .detalle{
            margin-top:5px;
            border: 1px solid black;
          }
          
          .detalle th{
            border: 1px solid black;
          }
          
          .info{
            margin-top:5px;
            border: 1px solid black;
          }

          .info th{
            font-size:6;
          }
          .info-pago{
            font-size : 10px;
          }
      
        </style>
        <table class="info">
        <tr>
          <th rowspan="2" style="width:70%">***PASADOS DIEZ DIAS DE LA RECEPCION DE LA MERCANCIA NO SE ACEPTARAN DEVOLUCIONES NI CAMBIOS***
          TODOS NUESTROS PRECIOS LLEVAN IVA INCLUIDO
          </th>
          <th>SUBTOTAL</th>
          <td>$ `+encabezado.IntSubtotal+`</td>
        </tr>
        <tr>
          <th>DESCUENTO</th>
          <td>$0</td>
        </tr>
        <tr>
          <th rowspan="3" class="info-pago">El pago no oportuno de esta factura causarà intereses de mora a la tasa mas alta permitida por la superintendencia de industria y comercio. El cliente autoriza expresamente a Inmoda Fantasy SAS para que lo consulte en centrales de riesgo y lo reporte si se hace necesario, en caso de que se tenga que cobrar esta factura, los gastos prejuridicos o juridicos generados seran cancelados por el cliente. Este documento se asemeja a una letra de cambio, para todos los efectos juridicos segùn los articulos 774 y consecuentes del c.cc y los articulos 448 y 844 del c.p.c. quien firma este documento se considera autorizado por el representante legal y renuncia a reconocimiento de firma y excepciones.
          </th>
          <th>IVA</th>
          <td>$ `+encabezado.IntIva+`</td>
        </tr>
        <tr>
          <th>VALOR</th>
          <td>$ `+encabezado.IntValor+`</td>
        </tr>
        <tr>
          <th>TOTAL</th>
          <td>$ `+encabezado.IntTotal+`</td>
        </tr>
      </table>
        `
      }
    }};

    return obj;
}

const CreatePdf = (filename,jsonData)=>{
    let obj = CrearHtml(jsonData);
    return new Promise((resolve, reject)=>{
        pdf.create(obj.html, obj.options).toFile(path.join(__dirname,'/documents/'+filename+'.pdf'),(err, res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
    
}

module.exports= {
    CreatePdf
}
