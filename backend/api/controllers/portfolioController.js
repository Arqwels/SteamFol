const { Portfolio, Invest, Skins } = require("../models");

class PortfolioController {
  async createPortfolio (req, res) {
    try {
      const { namePortfolio } = req.body;

      if (!namePortfolio) {
        return res.status(400).json({ message: 'Название портфолио обязательно' });
      }

      const newPortfolio = await Portfolio.create({ namePortfolio });
      return res.status(201).json(newPortfolio);
    } catch (error) {
      console.error('Ошибка при создании портфолио', error);
      res.status(500).json({ message: 'Ошибка при создании портфолио!' });
    }
  };

  async getAllPortfolios(req, res) {
    try {
      let portfolios = await Portfolio.findAll({
        order: [
          ['id', 'ASC']
        ]
      });

      // Если портфолио нет вовсе, создаём начальное
      if (portfolios.length === 0) {
        const defaultPortfolio = await Portfolio.create({ namePortfolio: 'My Portfolio1', isActive: true });
        portfolios = [defaultPortfolio];
      }

      return res.json(portfolios);
    } catch (error) {
      console.error('Ошибка при получении портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при получении портфолио!' });
    }
  };

  async getActivePortfolio(req, res) {
    try {
      let portfolio = await Portfolio.findOne({
        where: { isActive: true },
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
        const allPortfolios = await Portfolio.findAll({ order: [['createdAt', 'ASC']] });
        if (allPortfolios.length === 0) {
          // Нет портфолио вообще — создаём и возвращаем новое
          portfolio = await Portfolio.create({ namePortfolio: 'Default Portfolio', isActive: true });
        } else {
          // Есть, но не отмечено активным — отмечаем первое в списке
          const first = allPortfolios[0];
          await Portfolio.update({ isActive: false }, { where: {} });
          await Portfolio.update({ isActive: true }, { where: { id: first.id } });
          portfolio = await Portfolio.findByPk(first.id, {
              include: [
                  { model: Invest, as: 'investments', include: [ { model: Skins, as: 'skin' } ] }
              ]
          });
        }
      }

      return res.json(portfolio);
    } catch (error) {
      console.error('Ошибка при получении активного портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при получении активного портфолио!' });
    }
  };

  async activatePortfolio(req, res) {
    try {
      const { id } = req.params;

      await Portfolio.update(
        { isActive: false },
        { where: {} }
      );

      const [updated] = await Portfolio.update(
        { isActive: true },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Портфолио не найдено' });
      }

      return res.json({ message: 'Портфолио активировано' });
    } catch (error) {
      console.error('Ошибка при активации портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при активации портфолио!' });
    }
  };

  async renamePortfolio(req, res) {
    try {
      const { id } = req.params;
      const { namePortfolio } = req.body;

      if (!namePortfolio) {
        return res.status(400).json({ message: 'Новое название портфолио обязательно' });
      }

      const [updatedCount] = await Portfolio.update(
        { namePortfolio },
        { where: { id } }
      );

      if (!updatedCount) {
        return res.status(404).json({ message: 'Портфолио не найдено' });
      }

      const updatedPortfolio = await Portfolio.findByPk(id);
      return res.json(updatedPortfolio);
    } catch (error) {
      console.error('Ошибка при переименовании портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при переименовании портфолио!' });
    }
  };

  async deletePortfolio(req, res) {
    try {
      const { id } = req.params;

      const deletedCount = await Portfolio.destroy({ where: { id } });

      if (!deletedCount) {
        return res.status(404).json({ message: 'Портфолио не найдено' });
      }

      // Если удалили активное портфолио, можно автоматически активировать одно из оставшихся
      const activeExists = await Portfolio.findOne({ where: { isActive: true } });
      if (!activeExists) {
        const next = await Portfolio.findOne({ order: [['createdAt', 'ASC']] });
        if (next) {
          await Portfolio.update({ isActive: true }, { where: { id: next.id } });
        }
      }

      return res.json({ message: 'Портфолио успешно удалено' });
    } catch (error) {
      console.error('Ошибка при удалении портфолио:', error);
      return res.status(500).json({ message: 'Ошибка при удалении портфолио!' });
    }
  };
}

module.exports = new PortfolioController();
