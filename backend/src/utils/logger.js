const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
const currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  error(message, ...args) {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(`[${timestamp()}] ❌ ERROR:`, message, ...args);
    }
  },
  warn(message, ...args) {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(`[${timestamp()}] ⚠️  WARN:`, message, ...args);
    }
  },
  info(message, ...args) {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.log(`[${timestamp()}] ℹ️  INFO:`, message, ...args);
    }
  },
  debug(message, ...args) {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.log(`[${timestamp()}] 🔍 DEBUG:`, message, ...args);
    }
  },
};

export default logger;
