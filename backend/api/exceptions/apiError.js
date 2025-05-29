module.exports = class ApiError extends Error {
  /**
   * @param {number} status HTTP-статус
   * @param {string} message сообщение ошибки
   * @param {Array} errors массив доп. ошибок
   * @param {string} type тип ошибки
   */

  constructor(status, message, errors = [], type = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.type = type;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      errors: this.errors,
      type: this.type,
    };
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован!', [], 'AUTH_ERROR');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors, 'VALIDATION_ERROR');
  }

  static Forbidden(message = 'Доступ запрещён') {
    return new ApiError(403, message, [], 'FORBIDDEN');
  }
};
