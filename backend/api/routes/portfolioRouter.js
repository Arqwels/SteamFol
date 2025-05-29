const { Router } = require('express');
const portfolioController = require('../controllers/portfolioController');
const router = Router();

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

// Переименовать портфолио
// PATCH http://localhost:5000/api/portfolio/:id
router.patch('/:id', portfolioController.renamePortfolio);

// Удаление портфолио
// DELETE http://localhost:5000/api/portfolio/:id
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;
