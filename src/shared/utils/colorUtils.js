/**
 * Generates a random 6-character hex color code (e.g., #A3B4C5)
 * @returns {string} Hex color string
 */
const generateRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

module.exports = {
  generateRandomHexColor
};

