const router = require('express').Router();
const {
  createUser, loginUser,
} = require('../controllers/users');
const {
  validateSignUp,
  validateSignIn,
} = require('../middlewares/joi');

router.post('/signin', validateSignIn, loginUser);
router.post('/signup', validateSignUp, createUser);

module.exports = router;
