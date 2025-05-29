const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/apiError');

class UserController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.register(email, password);

      //! Если https по добавить secure: true
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json(userData);
    } catch (err) {
      next(err);
    }
  };

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      //! Если https по добавить secure: true
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  };

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return next(ApiError.UnauthorizedError());
      }

      await userService.logout(refreshToken);

      //! Если https по добавить secure: true
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict'
      });

      return res.status(200).json({ message: 'Успешный выход' });
    } catch (err) {
      next(err);
    }
  };

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  };

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);

      //! Если https по добавить secure: true
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });

      return res.json(userData);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new UserController();
