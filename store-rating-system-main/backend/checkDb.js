require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('SEQUELIZE_OK');
    return sequelize.close();
  })
  .catch((err) => {
    console.error('SEQUELIZE_ERROR', err.message);
    return sequelize.close().then(() => process.exit(1));
  });
