const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD
      }
    })
  };

  async sendActivationMail(to, link) {
    const activationUrl = `${process.env.SERVER_URL}/api/auth/activate/${link}`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_LOGIN,
        to,
        subject: `Активация почты на ${process.env.CLIENT_URL}`,
        html: `
          <div>
            <h1>Чтобы активировать аккаунт, перейдите по ссылке:</h1>
            <a href="${activationUrl}">${activationUrl}</a>
          </div>
        `
      });
    } catch (err) {
      console.error('Ошибка при отправке письма активации', err);
      throw err;
    }
  };
}

module.exports = new MailService();
