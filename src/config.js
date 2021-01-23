require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  CF_KEY: process.env.CF_KEY,
  CF_SECRET: process.env.CF_SECRET,
  BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
};
