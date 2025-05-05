const Router = require('express');
const portfolioController = require('../controllers/portfolioController');
const router = new Router();

// Создание портфолио
// POST http://localhost:5000/api/portfolio
router.post('/', portfolioController.createPortfolio);

// Список всех портфолио
// GET http://localhost:5000/api/portfolio
router.get('/', portfolioController.getAllPortfolios);

// Получить активное портфолио
// GET http://localhost:5000/api/portfolio/active
router.get('/active', portfolioController.getActivePortfolio);

// Установить портфолио активным
// PATCH http://localhost:5000/api/portfolio/:id/activate
router.patch('/:id/activate', portfolioController.activatePortfolio);

module.exports = router;
