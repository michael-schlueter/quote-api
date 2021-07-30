const getRandomElement = arr => {
  if (!Array.isArray(arr)) throw new Error('Expected an array');
  return arr[Math.floor(Math.random() * arr.length)];
}

// Get the index of a quote object based on its id
const getIndexById = (id, arr) => {
  return arr.findIndex((quote) => {
    return quote.id == id;
  });
};

const generateId = (arr) => {
  arr.forEach((quote, index) => {
    quote.id = !quote.id && `quote${index + 1}`;
  })
}

module.exports = {
  getRandomElement, getIndexById, generateId
};
