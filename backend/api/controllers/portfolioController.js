const { Portfolio, Invest, Skins } = require("../models");

class PortfolioController {
  async createPortfolio (req, res) {
    try {
      const { namePortfolio } = req.body;
      const userId = req.user.id;

      if (!namePortfolio) {
        return res.status(400).json({ message: 'Название портфолио обязательно' });
      }

      if (namePortfolio.length > 100) {
        return res.status(400).json({ message: 'Название должно быть до 100 символов' });
      }

      const newPortfolio = await Portfolio.create({
        namePortfolio,
        userId,
        isActive: false
      });
      return res.status(201).json(newPortfolio);
    } catch (error) {
      console.error('Ошибка при создании портфолио', error);
      return res.status(500).json({ message: 'Ошибка при создании портфолио!' });
    }
  }

  async getAllPortfolios(req, res) {
    try {
      const userId = req.user.id;
      let portfolios = await Portfolio.findAll({
        where: { userId },
        order: [['id', 'ASC']]
      });

      // Если портфолио нет вовсе, создаём начальное
      if (portfolios.length === 0) {
        const defaultPortfolio = await Portfolio.create({
          namePortfolio: 'My Portfolio',
          isActive: true,
          userId
        });
        portfolios = [defaultPortfolio];
      }

      return res.status(200).json(portfolios);
    } catch (error) {
      console.error('Ошибка при получении портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при получении портфолио!' });
    }
  }

  async getActivePortfolio(req, res) {
    try {
      const userId = req.user.id;
      let portfolio = await Portfolio.findOne({
        where: { userId, isActive: true },
        include: [
          {
            model: Invest,
            as: 'investments',
            include: [
              { model: Skins, as: 'skin' }
            ]
          }
        ]
      });

      if (!portfolio) {
        const allPortfolios = await Portfolio.findAll({
          where: { userId },
          order: [['createdAt', 'ASC']]
        });
        if (allPortfolios.length === 0) {
          // Нет портфолио вообще — создаём и возвращаем новое
          portfolio = await Portfolio.create({
            namePortfolio: 'My Portfolio',
            isActive: true,
            userId
          });
        } else {
          await sequelize.transaction(async (t) => {
            await Portfolio.update(
              { isActive: false },
              { where: { userId }, transaction: t }
            );
            await Portfolio.update(
              { isActive: true },
              { where: { id: allPortfolios[0].id, userId }, transaction: t }
            );
          });

          portfolio = await Portfolio.findByPk(allPortfolios[0].id, { 
            include: [
              { model: Invest, as: 'investments', include: [ { model: Skins, as: 'skin' } ] }
            ]
          });
        }
      }

      return res.status(200).json(portfolio);
    } catch (error) {
      console.error('Ошибка при получении активного портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при получении активного портфолио!' });
    }
  }

  async renamePortfolio(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { namePortfolio } = req.body;

      if (!namePortfolio || namePortfolio.length > 100) {
        return res.status(400).json({ message: 'Новое название портфолио обязательно и до 100 символов' });
      }

      const existing = await Portfolio.findOne({
        where: { id, userId }
      });
      if (!existing) {
        return res.status(404).json({ message: 'Портфолио не найдено' });
      }

      await Portfolio.update(
        { namePortfolio },
        { where: { id, userId } }
      );
      const updatedPortfolio = await Portfolio.findOne({
        where: { id, userId }
      });

      return res.status(200).json(updatedPortfolio);
    } catch (error) {
      console.error('Ошибка при переименовании портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при переименовании портфолио!' });
    }
  }

  async activatePortfolio(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await sequelize.transaction(async (t) => {
        await Portfolio.update(
          { isActive: false },
          { where: { userId }, transaction: t }
        );

        const [updated] = await Portfolio.update(
          { isActive: true },
          { where: { id, userId }, transaction: t }
        );

        return updated;
      });

      if (!result) {
        return res.status(404).json({ message: 'Портфолио не найдено' });
      }

      return res.json({ message: 'Портфолио активировано' });
    } catch (error) {
      console.error('Ошибка при активации портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при активации портфолио!' });
    }
  }

  async deletePortfolio(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deletedCount = await Portfolio.destroy({
        where: { id, userId }
      });
      if (!deletedCount) {
        return res.status(404).json({ message: 'Портфолио не найдено' });
      }

      const activeExists = await Portfolio.findOne({
        where: { userId, isActive: true }
      });
      if (!activeExists) {
        const next = await Portfolio.findOne({
          where: { userId },
          order: [['createdAt', 'ASC']]
        });
        if (next) await Portfolio.update(
          { isActive: true },
          { where: { id: next.id } }
        );
      }

      return res.status(200).json({ message: 'Портфолио успешно удалено' });
    } catch (error) {
      console.error('Ошибка при удалении портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при удалении портфолио!' });
    }
  }
}

module.exports = new PortfolioController();
