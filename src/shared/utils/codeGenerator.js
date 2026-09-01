/**
 * Generates a random workspace code with 5 uppercase letters followed by 5 numbers
 * Example: ABCDE12345
 * @returns {string}
 */
/**
 * Generates a random workspace code (5 letters, 5 numbers)
 * @returns {string}
 */
const generateWorkspaceCode = () => {
  return generateCustomCode(5, 5);
};

/**
 * Generates a random channel code (4 letters, 4 numbers)
 * @returns {string}
 */
const generateChannelCode = () => {
  return generateCustomCode(4, 4);
};

/**
 * Helper to generate code with specific lengths and shuffle them
 */
const generateCustomCode = (letterCount, numberCount) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let codeArray = [];
  
  for (let i = 0; i < letterCount; i++) {
    codeArray.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }
  
  for (let i = 0; i < numberCount; i++) {
    codeArray.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  }
  
  // Fisher-Yates shuffle algorithm to mix letters and numbers randomly
  for (let i = codeArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [codeArray[i], codeArray[j]] = [codeArray[j], codeArray[i]];
  }
  
  return codeArray.join('');
};

module.exports = {
  generateWorkspaceCode,
  generateChannelCode
};

