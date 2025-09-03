const { SkinPriceHistory } = require('../models');
const { QueryTypes } = require('sequelize');
const sequelize = require('../../db');

class SkinsHistoryPrice {
  async getting24Percent (skinIds) {
    if (!Array.isArray(skinIds)) skinIds = [skinIds];

    const targetDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const tableName = SkinPriceHistory.getTableName();

    const rows = await sequelize.query(
      `
      WITH ranked AS (
        SELECT
          "skinId",
          price_skin::numeric AS price,
          recorded_at,
          ROW_NUMBER() OVER (PARTITION BY "skinId" ORDER BY recorded_at DESC) AS rn_current,
          ROW_NUMBER() OVER (
            PARTITION BY "skinId"
            ORDER BY ABS(EXTRACT(EPOCH FROM recorded_at) - EXTRACT(EPOCH FROM :targetDate::timestamp))
          ) AS rn_past
        FROM "${tableName}"
        WHERE "skinId" IN (:skinIds)
      )
      SELECT
        "skinId",
        MAX(CASE WHEN rn_current = 1 THEN price END) AS current_price,
        MAX(CASE WHEN rn_past = 1 THEN price END) AS past_price
      FROM ranked
      GROUP BY "skinId";
      `,
      {
        replacements: { skinIds, targetDate },
        type: QueryTypes.SELECT
      }
    );

    return rows.map(row => {
      const currentPrice = parseFloat(row.current_price) || 0;
      const pastPrice = parseFloat(row.past_price) || 0;
      const changePrice = currentPrice - pastPrice;
      const changePercent = pastPrice > 0 ? parseFloat(((changePrice / pastPrice) * 100).toFixed(2)) : 0;
      return { skinId: row.skinId, changePrice, changePercent };
    });
  }

  async getHistoryMap(skinIds) {
    if (!skinIds || (Array.isArray(skinIds) && skinIds.length === 0)) {
      return {};
    }
    const rows = await this.getting24Percent(skinIds);
    return Object.fromEntries(rows.map(item => [item.skinId, item]));
  }
}

module.exports = new SkinsHistoryPrice();