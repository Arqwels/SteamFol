const { Router } = require('express');
const skinsController = require('../controllers/skinsController');
const router = Router();

// GET /api/skins/search?q=...
router.get('/search', skinsController.searchSkins);

module.exports = router;
