const objImagenes={};
let Client = require('ssh2-sftp-client');
let fs=require('fs');
var path = require('path');
const model = require('../Models/Imagenes');

//Obtener imagenes desde el ftp de Anik
/*objImagenes.GetImagen=async(req,res)=>{
    try
    {
        let client  = new Client();
        console.log(req.params.strIdProducto);
        let strReferencia=req.params.strIdProducto.split('.')[0];
        let strReferenciaLocal=strReferencia.split('$');
        let remotePath = './Ftp_InmodaFantasy/'+strReferencia.split('$')[0]+'/'+req.params.strIdProducto;
       
        let dst =await fs.createWriteStream(path.join(__dirname,'../Public/'+strReferenciaLocal[0]+'-'+strReferenciaLocal[1]+'.jpg'));
            //res.json({a:process.env})
            client.connect({
                host: "192.168.1.103",
                port: '22',
                username: "sistemas",
                password: '1nm0d42019*'
            }).then(async() => {
                
               await client.get(remotePath, dst)
               client.end(); 
               dst.end();
               res.sendFile(strReferenciaLocal[0]+'-'+strReferenciaLocal[1]+'.jpg',{ root: path.join(__dirname,'../Public/') });
               //res.sendFile(strReferenciaLocal[0]+'-'+strReferenciaLocal[1]+'.jpg',{ root: './Public/' });
            }).catch(err => {
              console.error(err.message);
              client.end();
              dst.end();
              res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
            });

    }catch(Error){
        console.log(Error);
    }
};*/

objImagenes.GetImagenesReferencia=async(req,res)=>{
    model.GetImagenesReferencia(req.params).then(rptaHgi=>{
        if(rptaHgi){
            res.json({
                Success: true, strMensaje: rptaHgi
            });
        }else{
            res.json({
                Success: false, strMensaje: "Hubo un error al consultar imágenes" 
            });
        }
    });
}

const GetUriReferencia = async(strIdProducto)=>{
    const rpta = await model.GetImagenesReferencia(strIdProducto);
    if(rpta){
        return rpta;
    }else{
        return false;
    }
}

//Obtener imagenes desde el owncloud
objImagenes.GetImagen=async(req,res)=>{
    try
    {
        let {src, strIdProducto}=req.query;
        require('dotenv').config();
        let path_owncloud = process.env.NODE_ENV == "development" ? process.env.PATH_DEV : process.env.PATH_PRO;
        if(src == "" || src == "undefined"){
            let uri = await model.GetImagenesReferencia(strIdProducto);
            if(uri !== []){
                let src = uri[0].StrArchivo;
                //src = src.replace("FARMA PET", "MASCOTAS");
                fs.access(path.join(path_owncloud,src), fs.constants.F_OK, (err) => {
                    if(err){
                        res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
                    }else{
                        src = src.split("/");
                        img = src.pop();
                        src = src.join("/");
                        if(img == ""){
                            res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
                        }else{
                            res.sendFile(img,{ root: path.join(path_owncloud,src) });  
                        }  
                    }
                });
            }else{
                res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
            }
        }else{
            
            src = src.replace("FARMA PET", "MASCOTAS");
            fs.access(path.join(path_owncloud,src), fs.constants.F_OK, (err) => {
                if(err){
                    res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
                }else{
                    src = src.split("/");
                    img = src.pop();
                    src = src.join("/");
                    if(img == ""){
                        res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
                    }else{
                        res.sendFile(img,{ root: path.join(path_owncloud,src) });  
                    }  
                }
            });
        }
    }catch(Error){
        res.sendFile('NoDisponible.jpg',{ root: path.join(__dirname,'../Public/') });
    }
};


module.exports=objImagenes;