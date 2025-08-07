const { Router } = require('express');
const skinsController = require('./controllers/skinsController');
const router = Router();

// Endpoint для получения всех скинов и сохранения в БД
// Можно и без лимита, но будет получать слишком долго и все данные (около 24к)
// http://localhost:5000/api/dev/skins-data/?limit=10
router.get('/skins-data', skinsController.skinsData);


// http://localhost:5000/api/dev/skin/:id/history
router.get('/skin/:id/history', skinsController.skinHistory);

router.post('/skin/add-history/:id', skinsController.addHistorySkin);

// http://localhost:5000/api/dev/skin/:id/24hours
router.get('/skin/:id/24hours', skinsController.getting24Percent);

module.exports = router;
