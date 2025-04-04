const { default: axios } = require('axios');
const { searchParamsNamesSkins, headers } = require('../config/consts');
const SkinsModel = require('../models/skinsModel');
const SkinPriceHistory = require('../models/SkinPriceHistory');

/**
 * Функция для определения валюты и расчёта цены.
 * Если sell_price_text начинается с "$", то валюта USD, иначе по умолчанию RUB.
 * Цена делится на 100, т.к. приходят данные в копейках/центах.
 */
function getCurrencyAndPrice(skinData) {
  let price = skinData.sell_price / 100;
  let currency_code = "RUB";
  if (skinData.sell_price_text && skinData.sell_price_text.trim().startsWith("$")) {
    currency_code = "USD";
  }
  return { price, currency_code };
}

/**
 * Функция для разбиения массива на чанки указанного размера.
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

class SkinsDataController {
  constructor() {
    this.requestCount = 0; // Счетчик запросов к API
    this.skinsData = this.skinsData.bind(this);
    this.fetchAndSaveSkins = this.fetchAndSaveSkins.bind(this);
  }

  /**
   * Вспомогательный метод для выполнения запроса с повторными попытками.
   * Если возникает ошибка 502 или 429, ждёт указанное время и повторяет запрос.
   * @param {string} url URL для запроса.
   * @param {object} config Конфигурация запроса.
   * @param {number} retries Количество попыток (по умолчанию 3).
   * @returns {Promise} Результат запроса axios.
   */
  async makeRequestWithRetry(url, config, retries = 3) {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await axios.get(url, config);
      } catch (error) {
        if (error.response && (error.response.status === 502 || error.response.status === 429)) {
          attempt++;
          // Если сервер указывает время ожидания, используем его, иначе 5 секунд
          const retryAfter = error.response.headers["retry-after"];
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          console.log(
            `Request failed with status ${error.response.status}. Retrying attempt ${attempt} of ${retries} in ${waitTime / 1000} seconds...`
          );
          await this.delay(waitTime);
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries reached for transient errors.");
  }

  // Метод для получения данных с API, обновления основной таблицы и добавления записи в историю
  async fetchAndSaveSkins() {
    try {
      const count = 100;      // Количество элементов на один запрос
      let start = 0;          // Начальная позиция
      let allSkins = [];      // Массив для накопления скинов
      const searchUrl = "https://steamcommunity.com/market/search/render/";
      const customHeaders = {
        ...headers,
        Cookie: `steamLoginSecure=${process.env.STEAM_LOGIN_SECURE}`,
      };

      // Цикл последовательного получения данных
      while (true) {
        this.requestCount++;
        let response;
        try {
          response = await this.makeRequestWithRetry(searchUrl, {
            params: { ...searchParamsNamesSkins, start, count },
            headers: customHeaders,
          });
        } catch (error) {
          console.log(`Request for start=${start} failed after retries, skipping this block.`);
          start += count;
          continue; // переходим к следующей итерации цикла
        }

        let totalCount = response.data.total_count;
        let retryCount = 0;
        // Если totalCount не определен, повторяем попытку (до 3 раз)
        while ((!totalCount || totalCount === 0) && retryCount < 3) {
          console.log("Total count is undefined, retrying after 5 seconds...");
          await this.delay(5000);
          try {
            response = await this.makeRequestWithRetry(searchUrl, {
              params: { ...searchParamsNamesSkins, start, count },
              headers: customHeaders,
            });
          } catch (error) {
            console.log(`Retry for total_count at start=${start} failed, skipping block.`);
            break;
          }
          totalCount = response.data.total_count;
          retryCount++;
        }
        if (totalCount === undefined) {
          console.log("Total count is still undefined after retries, moving to next block.");
          start += count;
          continue;
        }

        console.log("Total count:", totalCount);
        console.log("Total requests:", this.requestCount);
        const skins = response.data.results;
        allSkins.push(...skins);
        // Выходим из цикла, если получены все данные
        if (allSkins.length >= totalCount) {
          break;
        }
        await this.delay(1500);
        start += count;
      }

      // Удаляем дубликаты по полю hash_name
      const uniqueSkins = this.removeDuplicates(allSkins);

      // Подготовка данных для пакетного сохранения (upsert) в таблицу Skins
      const skinsForUpsert = uniqueSkins.map(skinData => {
        const { price, currency_code } = getCurrencyAndPrice(skinData);
        return {
          market_name: skinData.name,
          market_hash_name: skinData.hash_name,
          price_skin: price,
          image_url: skinData.app_icon,
          currency_code: currency_code,
          date_update: new Date()
        };
      });

      // Разбиваем данные на чанки (например, по 500 записей)
      const chunkSize = 500;
      const skinsChunks = chunkArray(skinsForUpsert, chunkSize);
      for (const chunk of skinsChunks) {
        await SkinsModel.bulkCreate(chunk, {
          updateOnDuplicate: ["market_name", "price_skin", "image_url", "currency_code", "date_update"]
        });
      }

      // Получаем обновленные/созданные записи для связывания с историей
      const skinsFromDb = await SkinsModel.findAll({
        where: {
          market_hash_name: uniqueSkins.map(s => s.hash_name)
        }
      });
      const skinHashMap = {};
      skinsFromDb.forEach(skin => {
        skinHashMap[skin.market_hash_name] = skin;
      });

      // Подготовка данных для пакетного сохранения истории цен
      const historyRecords = uniqueSkins.map(skinData => {
        const { price } = getCurrencyAndPrice(skinData);
        return {
          skinId: skinHashMap[skinData.hash_name].id,
          price_skin: price,
          recorded_at: new Date()
        };
      });

      // Разбиваем данные истории на чанки (например, по 500 записей)
      const historyChunks = chunkArray(historyRecords, chunkSize);
      for (const chunk of historyChunks) {
        await SkinPriceHistory.bulkCreate(chunk);
      }

      return uniqueSkins;
    } catch (error) {
      console.error("Error in fetchAndSaveSkins:", error);
      throw error;
    }
  }

  // Метод, который можно использовать как endpoint для ручного запуска
  async skinsData(req, res) {
    try {
      const uniqueSkins = await this.fetchAndSaveSkins();
      return res.json(uniqueSkins);
    } catch (error) {
      console.error("Error fetching skins:", error);
      return res.status(500).json({ error: "Error fetching skins data" });
    }
  }

  removeDuplicates(array) {
    const uniqueMap = {};
    return array.filter((item) => {
      if (!uniqueMap[item.hash_name]) {
        uniqueMap[item.hash_name] = true;
        return true;
      }
      return false;
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = new SkinsDataController();
