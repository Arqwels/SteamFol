const ExcelJS = require('exceljs');
const { Invest, Skins, Portfolio } = require("../models");

class InvestmentController {
  async additionInvestment (req, res) {
    try {
      const userId = req.user.id;
      const { portfolioId, idItem, countItems, buyPrice, dateBuyItem } = req.body;

      // проверка владения портфелем
      const portfolio = await Portfolio.findOne({ where: { id: portfolioId, userId } });
      if (!portfolio) {
        return res.status(403).json({ message: 'Нет доступа к этому портфелю' });
      }

      // проверка существования скина
      const existingSkin = await Skins.findByPk(idItem);
      if (!existingSkin) {
        return res.status(400).json({ message: 'Записи с таким idItem не существует!' });
      }

      await Invest.create({ portfolioId, idItem, countItems, buyPrice, dateBuyItem });
      res.status(201).json({ message: 'Инвестиция успешно создана.' });
    } catch (error) {
      console.error('Ошибка при добавлении инвестиций!', error);
      res.status(500).json({ message: 'Ошибка при добавлении инвестиций!' });
    }
  };

  async receivingInvestments (req, res) {
    try {
      const userId = req.user.id;
      const { portfolioId } = req.query;
      const pid = portfolioId ? Number(portfolioId) : null;

      if (portfolioId && isNaN(pid)) {
        return res.status(400).json({ message: 'Неверный портфель ID' });
      }

      if (pid) {
        const ok = await Portfolio.findOne({ where: { id: pid, userId } });
        if (!ok) {
          return res.status(403).json({ message: 'Нет доступа к этому портфелю' });
        }
      }

      const investments = await Invest.findAll({
        where: pid ? { portfolioId: pid } : {},
        include: [
          {
            model: Portfolio,
            as: 'portfolio',
            where: { userId },
            attributes: ['id', 'namePortfolio']
          },
          {
            model: Skins,
            as: 'skin'
          },
        ],
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

  async updateInvestment (req, res) {
    try {
      const userId = req.user.id;
      const investmentId = req.params.id;
      const investment = await Invest.findByPk(investmentId, {
        include: [{ model: Portfolio, as: 'portfolio', where: { userId } }]
      });

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

  async deleteInvestment (req, res) {
    try {
      const userId = req.user.id;
      const investmentId = req.params.id;
      const investment = await Invest.findByPk(investmentId, {
        include: [{ model: Portfolio, as: 'portfolio', where: { userId } }]
      });

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

  async exportInvestments (req, res) {
    try {
      const userId = req.user.id;
      const { portfolioId } = req.query;
      const pid = portfolioId ? Number(portfolioId) : null;
      if (portfolioId && isNaN(pid)) {
        return res.status(400).json({ message: 'Неверный портфель ID' });
      }

      if (pid) {
        const ok = await Portfolio.findOne({ where: { id: pid, userId } });
        if (!ok) {
          return res.status(403).json({ message: 'Нет доступа к этому портфелю' });
        }
      }

      const investments = await Invest.findAll({
        where: pid ? { portfolioId: pid } : {},
        include: [
          {
            model: Portfolio,
            as: 'portfolio',
            where: { userId },
            attributes: []
          },
          { model: Skins, as: 'skin' }
        ],
        order: [['dateBuyItem', 'ASC']],
        raw: true,
        nest: true
      });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Инвестиции');

      sheet.columns = [
        { header: 'ID', key: 'id', width: 8 },
        { header: 'ID Item', key: 'idItem', width: 12 },
        { header: 'Portfolio ID', key: 'portfolioId', width: 12 },
        { header: 'Кол-во', key: 'countItems', width: 10 },
        { header: 'Цена покупки', key: 'buyPrice', width: 15 },
        { header: 'Дата покупки', key: 'dateBuyItem', width: 20 },
        { header: 'Скин (название)', key: 'skin.market_name', width: 40 },
        { header: 'Текущая цена скина', key: 'skin.price_skin', width: 18 },
        { header: 'Дата обновления скина', key: 'skin.date_update', width: 20 },
      ];

      investments.forEach(inv => {
        sheet.addRow({
          id: inv.id,
          idItem: inv.idItem,
          portfolioId: inv.portfolioId,
          countItems: inv.countItems,
          buyPrice: inv.buyPrice,
          dateBuyItem: new Date(inv.dateBuyItem).toISOString().split('T')[0],
          'skin.market_name': inv.skin.market_name,
          'skin.price_skin': inv.skin.price_skin,
          'skin.date_update': inv.skin.date_update ? new Date(inv.skin.date_update).toISOString().split('T')[0] : '',
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename="investments.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Ошибка при экспорте инвестиций!', error);
      res.status(500).json({ message: 'Ошибка при экспорте инвестиций!' });
    }
  };
}

module.exports = new InvestmentController();
