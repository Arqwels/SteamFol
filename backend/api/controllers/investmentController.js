const { Invest, Skins } = require("../models");

class InvestmentController {
  // C - Создание инвестиции
  async additionInvestment (req, res) {
    try {
      const skin = req.body;

      const existingSkin = await Skins.findByPk(skin.idItem);
      if (!existingSkin) {
        return res.status(400).json({ message: 'Записи с таким idItem не существует!' });
      }

      //! может что то потом придумаю ещё
      // const addSkin = await Invest.create(skin);
      await Invest.create(skin);

      res.status(201).json({ message: 'Инвестиция успешно создана.' });
    } catch (error) {
      console.error('Ошибка при добавлении инвестиций!', error);
      res.status(500).json({ message: 'Ошибка при добавлении инвестиций!' });
    }
  };
  // R - Получение инвестиций
  async receivingInvestments (req, res) {
    try {
      const { portfolioId } = req.query;
      const where = portfolioId
        ? { portfolioId: Number(portfolioId) }
        : {};

      if (portfolioId && isNaN(Number(portfolioId))) {
        return res.status(400).json({ message: 'Неверный портфель ID' });
      }

      const investments = await Invest.findAll({
        where,
        include: [{ model: Skins, as: 'skin' }]
      });

      if (!investments || investments.length ===  0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(investments);
    } catch (error) {
      console.error('Ошибка при получении инвестиций!', error);
      res.status(500).json({ message: 'Ошибка при получении инвестиций!' });
    }
  };
  // U - Обновление инвестиции
  async updateInvestment (req, res) {
    try {
      const investmentId = req.params.id;
      const investment = await Invest.findByPk(investmentId);

      if (!investment) {
        return res.status(404).json({ message: 'Инвестиция не найдена!' });
      }

      await investment.update(req.body);
      return res.status(200).json({ message: 'Инвестиция успешно обновлена!' });
    } catch (error) {
      console.error('Ошибка при обновлении инвестиции!', error);
      res.status(500).json({ message: 'Ошибка при обновлении инвестиции!' });
    }
  };
  // D - Удаление инвестиции
  async deleteInvestment (req, res) {
    try {
      const investmentId = req.params.id;
      const investment = await Invest.findByPk(investmentId);

      if (!investment) {
        return res.status(404).json({ message: 'Инвестиция не найдена!' });
      }

      await investment.destroy();
      return res.status(200).json({ message: 'Инвестиция успешно удалена!' });
    } catch (error) {
      console.error('Ошибка при удалении инвестиции!', error);
      res.status(500).json({ message: 'Ошибка при удалении инвестиции!' });
    }
  };
}

module.exports = new InvestmentController();