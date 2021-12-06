require('dotenv').config({path:'../.env'});
const app= require('./app');
const https = require('https');
const fs = require('fs');

async function Main(){
  if(process.env.NODE_ENV == "development"){
    await app.listen(app.get('port'));
    console.log('server puerto 4000');
  }else{
    const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/inmodafantasy.com.co/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/inmodafantasy.com.co/cert.pem')
    };
    https.createServer(options, app).listen(4000, ()=>{
      console.log("server puerto 4000")
    });
  }
}
Main();