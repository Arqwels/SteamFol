const User = require('../models/userModel');
const argon2 = require('argon2');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/apiError');

class UserService {
  async register(email, password) {
    const candidate = await User.findOne({
      where: { email }
    });
    if (candidate) {
      throw ApiError.BadRequest('Данный почтовый адрес уже используется!', [
        { field: 'email', message: 'Данный почтовый адрес уже используется', type: 'registration' }
      ])
    }

    // Хешируем пароль с настройками Argon2id
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 14,  // 16 MB
      timeCost: 3,          // 3 итерации
      parallelism: 1,       // 1 поток
    });

    const activationLink = uuid.v4();

    const user = await User.create({ email, password: hashedPassword, activationLink });

    await mailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };

  async activate(activationLink) {
    const user = await User.findOne({
      where: { activationLink }
    });

    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка для активации почты!', [
        { field: 'activationLink', message: 'Некорректная ссылка для активации почты', type: 'activation' }
      ])
    }
    user.isActivated = true;
    await user.save();
  };

  async login(email, password) {
    const user = await User.findOne({
      where: { email }
    });
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден!', [
        { field: 'email', message: 'Пользователь не найден', type: 'authentication' }
      ])
    }

    const isPassValid = await argon2.verify(user.password, password);
    if (!isPassValid) {
      throw ApiError.BadRequest('Неверный пароль!', [
        { field: 'password', message: 'Неверный пароль', type: 'authentication' }
      ]);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  };

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findByPk(userData.id);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };
}

module.exports = new UserService();
