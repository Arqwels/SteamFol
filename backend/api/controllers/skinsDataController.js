const { fetchAndSaveSkins } = require('../services/skinsTaskService');

class SkinsDataController {
  constructor() {
    // Привязываем контекст методов к инстансу
    this.skinsData = this.skinsData.bind(this);
  }

  async skinsData(req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    console.log(`[SkinsDataController] Получен запрос на /skinsData?limit=${limit}`);

    try {
      const result = await fetchAndSaveSkins(limit);
      console.log('[SkinsDataController] Успешно отправили ответ клиенту');
      res.json(result);
    } catch (err) {
      console.error('[SkinsController] Ошибка загрузки скинов:', err);
      res.status(500).json({ error: 'Ошибка при запросе данных о скинах' });
    }
  }
}

module.exports = new SkinsDataController();
