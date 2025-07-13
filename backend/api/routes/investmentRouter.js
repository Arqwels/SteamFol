const { Router } = require('express');
const investmentController = require('../controllers/investmentController');
const router = Router();
const { body } = require('express-validator');

// Создание инвестиции
// POST http://localhost:5000/api/investment
router.post('/', investmentController.additionInvestment);

// Получение инвестиций
// GET http://localhost:5000/api/investment?portfolioId=1
router.get('/', investmentController.receivingInvestments);

// Обновление инвестиции
// PUT http://localhost:5000/api/investment/:id
router.put(
  '/:id',
  body('countItems')
    .isInt({ min: 1 })
    .withMessage('Количество предметов не может быть меньше 1'),
  body('buyPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Цена покупки не может быть ниже 0,01'),
  investmentController.updateInvestment
);

// Удаление инвестиции
// DELETE http://localhost:5000/api/investment/:id
router.delete('/:id', investmentController.deleteInvestment);

// Экспорт инвестиций в Excel (с фильтром по portfolioId)
// GET http://localhost:5000/api/investment/export?portfolioId=1
router.get('/export', investmentController.exportInvestments);

module.exports = router;
