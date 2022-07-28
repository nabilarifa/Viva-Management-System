const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
    /// get token from header
    /// when we send a request to a protected route,
    /// we need to send the token within the header too
    const token = req.header('x-auth-token'); // header key
   /// console.log('Yes. Inside jwt middleware!');
    // check if no token
    if(!token) {
        return res.status(401).json({msg : 'No token, authorization denied' });
        // 401 -> not authorised
    }
    // verify token
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        //console.log('Print decoded part:');
        //console.log(decoded);
        next(); 
    } catch(err) {
        res.status(401).json({msg: 'Token is not valid'});
    }
}