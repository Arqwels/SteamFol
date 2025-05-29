const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.use('/skins', authMiddleware, require('./skinsRouter'));

router.use('/skins-data', require('./skinsDataRouter'));

router.use('/investment', authMiddleware, require('./investmentRouter'));

router.use('/portfolio', authMiddleware, require('./portfolioRouter'));

router.use('/auth', require('./authRouter'));

module.exports = router;
