const router = require('express').Router();
const User = require('../model/User');

/*
Routes below are never used
*/

router.get('/getProfile/:id', async(req, res) => {
  /// id
  const { id } = req.params
  try {
    const user = await User.findOne({_id: id}); // Finding user from User table
    return res.status(200).json(user); /// User information is sent
  } catch(err) {
    return res.status(404).json(err);
  }
});

router.get('/getLink', async(req, res) => {
  // email
  const email = req.query.email;
  try {
    const user = await User.findOne({ email });
    const id = user._id;
    let profilelink = '/profile/' + id;
    return res.status(200).json(profilelink);
  } catch(err) {
    return res.status(404).json(err);
  }
});


module.exports = router