const Router = require('express');
const investmentController = require('../controllers/investmentController');
const router = new Router();

// Создание инвестиции
// POST http://localhost:5000/api/investment
router.post('/', investmentController.additionInvestment);

// Получение инвестиций
// GET http://localhost:5000/api/investment
router.get('/', investmentController.receivingInvestments);

// Обновление инвестиции
// PUT http://localhost:5000/api/investment/:id
router.put('/:id', investmentController.updateInvestment);

// Удаление инвестиции
// DELETE http://localhost:5000/api/investment/:id
router.delete('/:id', investmentController.deleteInvestment);

module.exports = router;
