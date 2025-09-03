const ExcelJS = require('exceljs');
const { Invest, Skins, Portfolio } = require('../models');
const ApiError = require('../exceptions/apiError');
const { validationResult } = require('express-validator');
const skinsHistoryPrice = require('../services/skinsHistoryPrice');
const { Op, QueryTypes }= require('sequelize');
const sequelize = require('../../db');
const { COMMISSION_RATE } = require('../utils/constants');

class InvestmentController {
  async additionInvestment (req, res) {
    try {
      const userId = req.user.id;
      const { portfolioId, idItem, countItems, buyPrice, dateBuyItem } = req.body;

      if (!portfolioId) return res.status(400).json({ message: 'portfolioId обязательный' });

      // проверка существования скина
      const existingSkin = await Skins.findByPk(idItem);
      if (!existingSkin) {
        return res.status(400).json({ message: 'Скин не найден!' });
      }

      // создаём инвестицию
      const investment = await Invest.create({
        portfolioId,
        idItem,
        countItems,
        buyPrice,
        dateBuyItem
      });

      // подтягиваем все данные о скине
      const fullInvestment = await Invest.findByPk(investment.id, {
        include: [
          { model: Skins, as: 'skin' }
        ]
      });

      // Получаем историю изменений цены для нового скина
      const historyMap = await skinsHistoryPrice.getHistoryMap([fullInvestment.idItem]);
      const { changePrice = 0, changePercent = 0 } = historyMap[fullInvestment.idItem] || {};
      fullInvestment.setDataValue('changePrice', changePrice);
      fullInvestment.setDataValue('changePercent', changePercent);

      res.status(201).json({
        message: 'Инвестиция успешно создана',
        investment: fullInvestment
      });
    } catch (error) {
      console.error('Ошибка при добавлении инвестиций!', error);
      return res.status(500).json({ message: 'Ошибка при добавлении инвестиций!' });
    }
  }

  async receivingInvestments (req, res) {
    try {
      const userId = req.user.id;
      const { portfolioId, limit: qLimit, lastId: qLastId } = req.query;

      let limit = qLimit !== undefined ? Number(qLimit) : 25;
      if (Number.isNaN(limit) || limit <= 0) limit = 25;
      const MAX_LIMIT = 100;
      if (limit > MAX_LIMIT) limit = MAX_LIMIT;

      const pid = portfolioId ? Number(portfolioId) : null;
      if (portfolioId && isNaN(pid)) {
        return res.status(400).json({ message: 'Неверный портфель ID' });
      }

      const where = pid ? { portfolioId: pid } : {};
      if (qLastId !== undefined && qLastId !== null && qLastId !== '') {
        const lastId = Number(qLastId);
        if (!Number.isNaN(lastId)) {
          // сортировка DESC — берем записи c id < lastId
          where.id = { [Op.lt]: lastId };
        }
      }

      const investments = await Invest.findAll({
        where,
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
        limit,
        order: [['id', 'DESC']],
      });

      const idItem = investments.map(item => item.idItem);
      let historyMap = {};
      if (idItem.length > 0) {
        historyMap = await skinsHistoryPrice.getHistoryMap(idItem);
      }

      for (const inv of investments) {
        const { changePrice = 0, changePercent = 0 } = historyMap[inv.idItem] || {};
        inv.setDataValue('changePrice', changePrice);
        inv.setDataValue('changePercent', changePercent);
      }

      const last = investments.length ? investments[investments.length - 1].id : null;
      const hasMore = investments.length === limit;

      return res.status(200).json({
        investments,
        meta: { lastId: last, hasMore, limit },
      });
    } catch (error) {
      console.error('Ошибка при получении инвестиций!', error);
      return res.status(500).json({ message: 'Ошибка при получении инвестиций!' });
    }
  }

  async updateInvestment (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
      }

      const userId = req.user.id;
      const investmentId = req.params.id;

      const investment = await Invest.findByPk(investmentId, {
        include: [{ model: Portfolio, as: 'portfolio', where: { userId } }]
      });

      if (!investment) {
        return res.status(404).json({ message: 'Инвестиция не найдена!' });
      }

      // Обновляем только проверенные поля
      const { countItems, buyPrice } = req.body;
      await investment.update({ countItems, buyPrice });

      const updated = await Invest.findByPk(investmentId, {
        include: [
          {
            model: Portfolio,
            as: 'portfolio',
            attributes: ['id', 'namePortfolio']
          },
          {
            model: Skins,
            as: 'skin'
          },
        ],
      });

      if (!updated) {
        return res.status(500).json({ message: 'Ошибка: не удалось получить обновлённую запись' });
      }

      const historyMap = await skinsHistoryPrice.getHistoryMap([updated.idItem]);
      const { changePrice = 0, changePercent = 0 } = historyMap[updated.idItem] || {};

      // подготовим plain объект
      const updatedPlain = updated.get ? updated.get({ plain: true }) : updated;
      updatedPlain.changePrice = changePrice;
      updatedPlain.changePercent = changePercent;

      return res.status(200).json({
        message: 'Инвестиция успешно обновлена!',
        investment: updatedPlain
      });
    } catch (error) {
      console.error(`Ошибка при обновлении инвестиции ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Ошибка при обновлении инвестиции!' });
    }
  }

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
      return res.status(500).json({ message: 'Ошибка при удалении инвестиции!' });
    }
  }

  async exportInvestments (req, res) {
    try {
      const userId = req.user.id;
      const { portfolioId } = req.query;
      const pid = portfolioId ? Number(portfolioId) : null;
      if (portfolioId && isNaN(pid)) {
        return res.status(400).json({ message: 'Неверный портфель ID' });
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
      return res.status(500).json({ message: 'Ошибка при экспорте инвестиций!' });
    }
  }

  /**
   * @router GET /api/investment/:portfolioId/summary
   * @description Рассчитывает summary инвестиций для портфеля
   */
  async summaryInvestments(req, res) {
    const portfolioId = Number(req.params.portfolioId);
    if (!portfolioId) return res.status(400).json({ message: 'portfolioId обязательный' });

    try {
      const sql = `
        SELECT
          COALESCE(SUM(i."countItems" * i."buyPrice"), 0) AS "totalInvested",
          COALESCE(SUM(i."countItems" * s.price_skin), 0) AS "currentBalance",
          COALESCE(SUM(i."countItems" * s.price_skin) - SUM(i."countItems" * i."buyPrice"), 0) AS "grossProfit"
        FROM invests i
        LEFT JOIN skins s ON s.id = i."idItem"
        WHERE i."portfolioId" = :portfolioId
      `;

      const [row] = await sequelize.query(sql, {
        replacements: { portfolioId },
        type: QueryTypes.SELECT,
      });

      const totalInvested = Number(row.totalInvested ?? 0);
      const currentBalance = Number(row.currentBalance ?? 0);
      const grossProfit = currentBalance - totalInvested;

      const currentBalanceNet = currentBalance * (1 - COMMISSION_RATE);
      const netProfit = currentBalanceNet - totalInvested;

      return res.json({
        totalInvested: +totalInvested.toFixed(2),
        currentBalance: +currentBalance.toFixed(2),
        grossProfit: +grossProfit.toFixed(2),
        netProfit: +netProfit.toFixed(2),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка при получении всего инвестиций, тек. баланса и общей прибыли' });
    }
  }
}

module.exports = new InvestmentController();
