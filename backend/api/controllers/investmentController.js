const ExcelJS = require('exceljs');
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

  async exportInvestments (req, res) {
    try {
      const portfolioId = req.query.portfolioId;
      const where = portfolioId ? { portfolioId: Number(portfolioId) } : {};

      const investments = await Invest.findAll({
        where,
        include: [{ model: Skins, as: 'skin' }],
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
          'skin.date_update': inv.skin.date_update
            ? new Date(inv.skin.date_update).toISOString().split('T')[0]
            : ''
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