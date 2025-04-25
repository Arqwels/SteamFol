module.exports.chunkArray = function(array, size) {
  const chunks = [];

  // Разбиваем массив на чанки по size элементов
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
};