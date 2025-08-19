module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || process.env.JWT_SECRET,
  JWT_EXPIRES_IN: '24h',
  PORT: process.env.PORT || 5000
};
