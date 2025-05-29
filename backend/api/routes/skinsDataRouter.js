const { Router } = require('express');
const skinsDataController = require('../controllers/skinsDataController');
const router = Router();

// Endpoint для получения всех скинов и сохранения в БД
// http://localhost:5000/api/skins-data/
router.get('/', skinsDataController.skinsData);

module.exports = router;
