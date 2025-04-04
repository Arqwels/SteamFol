const { Op } = require('sequelize');
const { Skins, Invest } = require('../models');

class SkinsController {
  async searchSkins (req, res) {
    try {
      const searchQuery = req.query.q;

      if (!searchQuery) {
        return res.status(400).json({ message: 'Для поиска необходимо значение!' });
      }

      const skins = await Skins.findAll({
        where: {
          [Op.or]: [
            { market_name: { [Op.like]: `%${searchQuery}%` } },
            { market_hash_name: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        limit: 5
      });

      res.json(skins);
    } catch (error) {
      console.error('Ошибка при поиске скинов!', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
}

module.exports = new SkinsController();