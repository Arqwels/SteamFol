const { Router } = require('express');
const userController = require('../controllers/userController');
const router = Router();
const {body} = require('express-validator');

// Регистрация пользователя
// POST http://localhost:5000/api/auth/register
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 32 }),
  userController.register);

// Авторизация пользователя
// POST http://localhost:5000/api/auth/login
router.post('/login', userController.login);

// Выхода из учётной записи пользователя
// POST http://localhost:5000/api/auth/logout
router.post('/logout', userController.logout);

// GET http://localhost:5000/api/auth/activate/:link
router.get('/activate/:link', userController.activate);

// GET http://localhost:5000/api/auth/refresh
router.get('/refresh', userController.refresh);

module.exports = router;
