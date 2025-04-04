const Router = require('express');
const skinsController = require('../controllers/skinsController');
const router = new Router();

// GET /api/skins/search?q=...
router.get('/search', skinsController.searchSkins);

module.exports = router;
