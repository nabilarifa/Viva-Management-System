const User = require('../model/User');

module.exports = async function(req, res, next) {
  //  console.log('Inside studentLogin middleware');
  //  console.log(req.body.email);
    const data = await User.findOne({email : req.body.email});
    if(!data) {
        return res.status(401).json({msg : 'Not authorized' });
            // 401 -> not authorised
    }
    next();
};