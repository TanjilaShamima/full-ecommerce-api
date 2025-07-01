const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const roleRouter = require('./roleRouter');
const adminRouter = require('./adminRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/admin', adminRouter);


module.exports = router;