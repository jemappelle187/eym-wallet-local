// Simple password check for when API functions aren't working
const VALID_PASSWORD = 'sendnreceive2026';

function checkPassword(inputPassword) {
  return inputPassword === VALID_PASSWORD;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkPassword };
} else {
  window.checkPassword = checkPassword;
}
