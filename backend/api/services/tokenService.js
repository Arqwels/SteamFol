const jwt = require('jsonwebtoken');
const Token = require('../models/tokenModel');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn:'3h' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn:'60d' }
    );

    return { accessToken, refreshToken };
  };

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  };

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  };

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({
      where: { userId }
    });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    return await Token.create({ userId, refreshToken });
  };

  async removeToken(refreshToken) {
    await Token.destroy({where: { refreshToken }});
  };

  async findToken(refreshToken) {
    return await Token.findOne({where: { refreshToken }});
  };
}

module.exports = new TokenService();
