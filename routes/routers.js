const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const notFound = require('../controllers/notFound');
const { auth } = require('../middlewares/auth');

router.use('/', authRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);
router.use(auth, notFound);

module.exports = router;
