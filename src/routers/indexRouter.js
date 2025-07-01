const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const roleRouter = require('./roleRouter');
const adminRouter = require('./adminRouter');
const craftTypeRouter = require('./craftTypeRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/admin', adminRouter);
router.use('/craft-types', craftTypeRouter);

module.exports = router;