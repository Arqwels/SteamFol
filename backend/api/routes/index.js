const { Router } = require('express');
const router = new Router();

router.use('/skins', require('./skinsRouter'));

router.use('/skins-data', require('./skinsDataRouter'));

router.use('/investment', require('./investmentRouter'));

router.use('/portfolio', require('./portfolioRouter'));

module.exports = router;
