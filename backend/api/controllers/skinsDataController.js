const steamService = require('../services/steamService');
const skinsService = require('../services/skinsService');
const priceHistoryService = require('../services/priceHistoryService');
const steamAuthService = require('../services/steamAuthService');

class SkinsDataController {
  constructor() {
    // Привязываем контекст методов к инстансу
    this.skinsData = this.skinsData.bind(this);
  }

  async fetchAndSaveSkins(limit = null) {
    const raw = await steamService.fetchAllSkins(limit);
    const unique = [...new Map(raw.map(i => [i.hash_name, i])).values()];
    const dbSkins = await skinsService.upsertSkins(unique);
    await priceHistoryService.recordHistory(dbSkins, unique);
    return unique;
  }

  async skinsData(req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    console.log(`[SkinsDataController] Получен запрос на /skinsData?limit=${limit}`);

    try {
      // Получаем актуальный steamLoginSecure перед запросами
      const secureToken = await steamAuthService.init();
      steamService.setLoginSecure(secureToken);

      const result = await this.fetchAndSaveSkins(limit);
      console.log('[SkinsDataController] Успешно отправили ответ клиенту');
      res.json(result);
    } catch (err) {
      console.error('[SkinsController] Ошибка загрузки скинов:', err);
      res.status(500).json({ error: 'Ошибка при запросе данных о скинах' });
    }
  }
}

module.exports = new SkinsDataController();
