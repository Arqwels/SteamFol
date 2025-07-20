const { QueryTypes } = require('sequelize');
const sequelize = require('../../../db');
const SkinPriceHistory = require('../../models/SkinPriceHistory');
const Skins = require('../../models/skinsModel');

class SkinsController {
  constructor() {
    // Привязываем контекст методов к инстансу
    this.skinsData = this.skinsData.bind(this);
  }

  async skinsData(req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    console.log(`Получен запрос на /skinsData?limit=${limit}`);

    try {
      const result = await fetchAndSaveSkins(limit);
      console.log('Успешно отправили ответ клиенту');
      res.json(result);
    } catch (err) {
      console.error('Ошибка загрузки скинов:', err);
      res.status(500).json({ error: 'Ошибка при запросе данных о скинах' });
    }
  };


  async skinHistory (req, res) {
    try {
      const { id } = req.params;

      // 1) получаем только market_hash_name скина
      const skin = await Skins.findByPk(id, {
        attributes: ['market_hash_name']
      });
      if (!skin) {
        return res.status(404).json({ message: 'Skin not found' });
      }

      // 2) получаем всю историю по этому id
      const history = await SkinPriceHistory.findAll({
        where: { skinId: id },
        attributes: ['id', 'price_skin', 'recorded_at'],  // можно убрать skinId, если не нужен
        order: [['recorded_at', 'DESC']],
        raw: true
      });

      // 3) собираем ответ
      return res.json({
        skin: { market_hash_name: skin.market_hash_name },
        history
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка при запросе истории скина' });
    }
  };


  async addHistorySkin (req, res) {
    try {
      const { id } = req.params;

      const findSkin = await Skins.findByPk(id);
      if (!findSkin) {
        return res.status(404).json({ message: 'Скин был не найден!' });
      }

      const data = req.body;
      const entries = Array.isArray(data) ? data : [data];

      const toCreate = entries.map(item => ({
        skinId: id,
        price_skin: item.price_skin,
        recorded_at: item.recorded_at,
      }));

      await SkinPriceHistory.bulkCreate(toCreate);

      res.status(200).json({ message: 'История успешно добавлена!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка при добавлении истории скина' });
    }
  };


  async getting24Percent (req, res) {
    try {
      const { id } = req.params;

      const findSkin = await Skins.findByPk(id);
      if (!findSkin) {
        return res.status(404).json({ message: 'Скин не найден!' });
      }

      const targetDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const tableName = SkinPriceHistory.getTableName();

      // Получаем последнюю цену (актуальную)
      const [currentRow] = await sequelize.query(
        `
        SELECT price_skin::numeric AS price, recorded_at AS timestamp
        FROM "${tableName}"
        WHERE "skinId" = :skinId
        ORDER BY recorded_at DESC
        LIMIT 1
        `,
        { replacements: { skinId: id }, type: QueryTypes.SELECT }
      );

      // Получаем ближайшую цену к 24 часам назад
      const [pastRow] = await sequelize.query(
        `
        SELECT price_skin::numeric AS price, recorded_at AS timestamp
        FROM "${tableName}"
        WHERE "skinId" = :skinId
        ORDER BY ABS(EXTRACT(EPOCH FROM recorded_at) - EXTRACT(EPOCH FROM :targetDate::timestamp))
        LIMIT 1
        `,
        { replacements: { skinId: id, targetDate }, type: QueryTypes.SELECT }
      );

      if (!currentRow || !pastRow) {
        return res.status(404).json({ message: 'Недостаточно данных для расчёта' });
      }

      const currentPrice = parseFloat(currentRow.price);
      const pastPrice    = parseFloat(pastRow.price);
      const changePercent = ((currentPrice - pastPrice) / pastPrice) * 100;

      return res.json({
        changePercent: changePercent.toFixed(2),
        from: pastRow.timestamp,
        to: currentRow.timestamp
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка при вычислении изменения цены' });
    }
  }
}

module.exports = new SkinsController();