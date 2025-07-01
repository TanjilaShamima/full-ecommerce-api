const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');
const craftTypeRouter = require('./craftTypeRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/admin', adminRouter);
router.use('/craft-types', craftTypeRouter);

module.exports = router;