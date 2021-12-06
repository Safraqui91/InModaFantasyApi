const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config.js');

exports.generateToken = (data)=>{
    return jwt.sign({data}, config.secretKey);
}

exports.generateTokenExpire = (data)=>{
    return jwt.sign({data}, config.secretKey, { expiresIn: '15m' }, { algorithm: 'RS256'});
}

exports.validateToken = (token)=>{
    return jwt.verify(token, config.secretKey);
}

exports.verifyToken = async (req, res, next)=>{
    try {
        const token = req.headers.authorization;
        if (!token) return res.json({Success : false , message:'No token provided'});
        const decoded = jwt.verify(token, config.secretKey);
        //validar token decodificado en la base de datos...
        if(!decoded) return res.json({Success : false , message:'No user found'});
        req.body.token = decoded;
        next();
    } catch (error) {
        res.json({Success : false , message:'Unauthorized'});
    }
}